"use client";
import { useMemo } from "react";

import { CustomEdgeType, ImageNodeType, SiteData } from "@/lib/type";
import {
    ConnectionMode,
    ReactFlow,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import ViewCustomEdge from "@/components/view/ViewCustomEdge";
import ViewEdgeCard from "@/components/view/ViewEdgeCard";
import ImageNodeView from "@/components/view/ViewImageNode";
import ViewInfoModal from "@/components/view/ViewInfoModal";
import ViewNodeCard from "@/components/view/ViewNodeCard";
import ViewSettingCard from "@/components/view/ViewSettingCard";
import ViewSettingIcon from "@/components/view/ViewSettingIcon";
import { useFlowStore } from "@/store/flowStore";
import { CardType, useViewStore } from "@/store/viewStore";
import { isMobile } from "react-device-detect";

import Progress from "@/components/view/Progress";
import { useDisabledMobilePinchZoom } from "./hooks/useDisabledMobilePinchZoom";
import { useBrowserHash } from "./hooks/useBrowserHash";
import { useFlowViewShrinker } from "./hooks/useFlowViewShrinker";
import { useReactFlowFitViewToEdge } from "./hooks/useReactFlowFitViewToEdge";

function parseChapterAndDayFromBrowserHash(hash: string): number[] | null {
    const parseOrZero = (value: string): number => {
        const parsed = parseInt(value, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const parts = hash.split("/");

    if (parts.length === 2) {
        const chapter = parseOrZero(parts[0])
        const day = parseOrZero(parts[1])
        return [chapter, day];
    }

    return null;
}

function findTopLeftNode(nodes: ImageNodeType[]) {
    let topLeftNode = nodes[0];
    for (const node of nodes) {
        if (
            node.position.x < topLeftNode.position.x || 
            (node.position.x === topLeftNode.position.x && node.position.y < topLeftNode.position.y)
        ) {
            topLeftNode = node;
        }
    }
    return topLeftNode;
}

function findBottomRightNode(nodes: ImageNodeType[]) {
    let bottomRightNode = nodes[0];
    for (const node of nodes) {
        if (
            node.position.x > bottomRightNode.position.x || 
            (node.position.x === bottomRightNode.position.x && node.position.y > bottomRightNode.position.y)
        ) {
            bottomRightNode = node;
        }
    }
    return bottomRightNode;
}

const nodeTypes = {
    image: ImageNodeView,
};

const edgeTypes = {
    fixed: ViewCustomEdge,
};

// On mobile it's harder to zoom out, so we set a lower min zoom
const minZoom = isMobile ? 0.3 : 0.5;
// To limit the area where the user can pan
const areaOffset = 1000;

interface Props {
    siteData: SiteData
}

let didInit = false;
const ViewApp = ({ siteData }: Props) => {
    /* State variables */
    const { selectedEdge, selectedNode, setSelectedEdge, setSelectedNode } = useFlowStore();
    const {
        currentCard,
        setCurrentCard,
        edgeVisibility,
        setEdgeVisibility,
        teamVisibility,
        setTeamVisibility,
        characterVisibility,
        setCharacterVisibility,
        modalOpen,
        setModalOpen,
        chapter,
        setChapter,
        day,
        setDay,
        hoveredEdgeId,
        setHoveredEdgeId,
    } = useViewStore();

    const { fitView } = useReactFlow<ImageNodeType, CustomEdgeType>();
    const { fitViewToEdge } = useReactFlowFitViewToEdge();
    const { shrinkFlowView, resetFlowView } = useFlowViewShrinker();
    const { browserHash, setBrowserHash } = useBrowserHash(onBrowserHashChange);

    // For disabling default pinch zoom on mobiles, as it conflict with the chart's zoom
    // Also when pinch zoom when one of the cards are open, upon closing the zoom will stay that way permanently
    useDisabledMobilePinchZoom();

    /* Data variables */
    const chapterData = siteData.chapters[chapter];
    const dayData = chapterData.charts[day];
    const nodes = dayData.nodes;
    const edges = dayData.edges;

    /* Hooks that depend on main data variables. */
    const topLeftNode = useMemo(() => findTopLeftNode(nodes), [nodes]);
    const bottomRightNode = useMemo(() => findBottomRightNode(nodes), [nodes]);

    // Filter and fill in render properties for nodes/edges before passing them to ReactFlow.
    const renderableNodes = nodes.filter(node => {
        // Compute node visibility based on related edge and viewstore settings
        let isVisible = true;

        if (node.data.team) {
            isVisible = isVisible && teamVisibility[node.data.team];
        } 
        if (node.data.title) {
            isVisible = isVisible && characterVisibility[node.data.title];
        }
        return isVisible;
    }).map(node => {
        // Set team icon image, if available.
        if(node.data.team) {
            node.data.renderTeamImageSrc = dayData.teams[node.data.team]?.imageSrc || "";
        }
        else {
            node.data.renderTeamImageSrc = "";
        }
        
        return node;
    });

    const renderableEdges = edges.filter(edge => {
        const nodeSrc = nodes.filter(node => node.id == edge.source)[0] as ImageNodeType;
        const nodeTarget = nodes.filter(node => node.id == edge.target)[0] as ImageNodeType;
        if(!nodeSrc || !nodeTarget) {
            return false;
        }

        let visibility = true;
        if (edge.data?.relationship) {
            visibility = visibility && edgeVisibility[edge.data.relationship];
        }
        /*
        if (edge.data?.new) {
            visibility = visibility && edgeVisibility["new"];
        }
        */
        if (nodeSrc?.data.team) {
            visibility = visibility && teamVisibility[nodeSrc.data.team];
        }
        if (nodeTarget?.data.team) {
            visibility = visibility && teamVisibility[nodeTarget.data.team];
        }
        if (nodeSrc?.data.title) {
            visibility = visibility && characterVisibility[nodeSrc.data.title];
        }
        if (nodeTarget?.data.title) {
            visibility = visibility && characterVisibility[nodeTarget.data.title];
        }
        
        return visibility;
    }).map(edge => {
        if(!edge.data) {
            return edge;
        }

        if(edge.data.relationship) {
            edge.data.renderEdgeStyle = dayData.relationships[edge.data.relationship] || {};
        }

        edge.data.renderIsHoveredEdge = edge.id === hoveredEdgeId; 

        return edge;
    });

    /* Helper function to coordinate state updates when data changes. */
    function updateData(newChapter: number, newDay: number) {
        if(newChapter < 0 || newChapter > siteData.numberOfChapters || 
            newDay < 0 || newDay > siteData.chapters[chapter].numberOfDays
        ) {
            return;
        }

        const newChapterData = siteData.chapters[newChapter];
        const newDayData = newChapterData.charts[newDay];

        // Rest edge/team/character visibility on data change.
        // Setting the visibility of edges, teams and characters
        const edgeVisibilityLoaded: { [key: string]: boolean } = {};
        const teamVisibilityLoaded: { [key: string]: boolean } = {};
        const characterVisibilityLoaded: { [key: string]: boolean } = {};

        // To avoid overwriting current visibility for "new"
        edgeVisibilityLoaded["new"] = edgeVisibilityLoaded["new"] || true;

        Object.keys(newDayData.relationships).forEach((key) => {
            edgeVisibilityLoaded[key] = true;
        });

        Object.keys(newDayData.teams).forEach((key) => {
            teamVisibilityLoaded[key] = true;
        });

        for (const node of newDayData.nodes) {
            if (node.data.team) {
                teamVisibilityLoaded[node.data.team] = true;
            }
            if (node.data.title) {
                characterVisibilityLoaded[node.data.title] = true;
            }
        }

        setEdgeVisibility(edgeVisibilityLoaded);
        setTeamVisibility(teamVisibilityLoaded);
        setCharacterVisibility(characterVisibilityLoaded);
        setChapter(newChapter);
        setDay(newDay);
        setBrowserHash(`${newChapter}/${newDay}`);
    }

    /* Event handler functions */
    function onBrowserHashChange(hash: string) {
        const parsedValues = parseChapterAndDayFromBrowserHash(hash);

        if(parsedValues) {
            const [chapter, day] = parsedValues;
            updateData(chapter, day);
        }
    }

    // Update react flow renderer width when setting card is open, so the flow is not covered by the card
    function onCurrentCardChange(newCurrentCard: CardType) {
        if(newCurrentCard === "setting") {
            // Same width as the ViewCard
            shrinkFlowView(500);
        }
        else if(currentCard === "setting" && newCurrentCard === null) {
            resetFlowView();
        }
        else if(currentCard !== "setting" && newCurrentCard === null) {
            fitView({ padding: 0.5, duration: 1000 });
        }

        setCurrentCard(newCurrentCard);
    }

    function onNodeLinkClicked(targetNode: ImageNodeType) {
        setCurrentCard("node");
        setSelectedNode(targetNode);
        fitView({
            nodes: [targetNode],
            duration: 1000,
            maxZoom: 1.5,
        });
    }

    function onEdgeLinkClicked(targetEdge: CustomEdgeType) {
        setCurrentCard("edge");
        setSelectedEdge(targetEdge);
        fitViewToEdge(targetEdge.source, targetEdge.target, targetEdge);
    }

    /* Init block, runs only on first render/load. */
    if(!didInit) {
        didInit = true;
        
        const initialChapterDay = parseChapterAndDayFromBrowserHash(browserHash);
        if(initialChapterDay) {
            console.log(initialChapterDay);
            const [chapter, day] = initialChapterDay;
            updateData(chapter, day);
        }
        else {
            updateData(0, 0);
        }
    }

    return (
        <>
            <div className="w-screen h-screen overflow-hidden ">
                <ReactFlow
                    connectionMode={ConnectionMode.Loose}
                    nodes={renderableNodes}
                    edges={renderableEdges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.5, duration: 1000 }}
                    onNodeClick={(_, node) => {
                        setSelectedNode(node);
                        fitView({
                            nodes: [node],
                            duration: 1000,
                            maxZoom: 1.5,
                        });
                        onCurrentCardChange("node");
                    }}
                    onEdgeClick={(_, edge) => {
                        // Disable edge selection on if is old edge and only show new is true
                        if (edge.data?.new === false && edgeVisibility["new"]) {
                            return;
                        }

                        setSelectedEdge(edge);
                        fitViewToEdge(edge.source, edge.target, edge);

                        onCurrentCardChange("edge");
                    }}
                    minZoom={minZoom}
                    zoomOnDoubleClick={false}
                    onPaneClick={() => {
                        onCurrentCardChange(null);
                    }}
                    onEdgeMouseEnter={(_, edge) => {
                        setHoveredEdgeId(edge.id);
                    }}
                    onEdgeMouseLeave={() => {
                        setHoveredEdgeId("");
                    }}
                    proOptions={{
                        hideAttribution: true,
                    }}
                    translateExtent={
                        topLeftNode &&
                        bottomRightNode && [
                            [
                                topLeftNode.position.x - areaOffset,
                                topLeftNode.position.y - areaOffset,
                            ],
                            [
                                bottomRightNode.position.x + areaOffset,
                                bottomRightNode.position.y + areaOffset,
                            ],
                        ]
                    }
                ></ReactFlow>
                <div
                    className="absolute top-0 left-0 w-screen h-screen -z-10"
                    style={{
                        backgroundImage: "url('bg.webp')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                <ViewSettingCard 
                    isCardOpen={currentCard === "setting"}  
                    onCardClose={ () => onCurrentCardChange(null) }
                    chapter={chapter}
                    chapterData={chapterData}
                    day={day}
                    dayData={dayData} 
                    onDayChange={(newDay: number) => updateData(chapter, newDay) }
                    onModalOpen={() => setModalOpen(true)}
                    edgeVisibility={edgeVisibility}
                    onEdgeVisibilityChange={setEdgeVisibility}
                    teamVisibility={teamVisibility}
                    onTeamVisibilityChange={setTeamVisibility}
                    characterVisibility={characterVisibility}
                    onCharacterVisibilityChange={setCharacterVisibility}
                />
                <ViewNodeCard 
                    isCardOpen={currentCard === "node"}
                    selectedNode={selectedNode}
                    onCardClose={ () => onCurrentCardChange(null) }
                    dayData={dayData}
                    onNodeLinkClicked={onNodeLinkClicked}
                    onEdgeLinkClicked={onEdgeLinkClicked}
                />
                <ViewEdgeCard 
                    isCardOpen={ currentCard === "edge" } 
                    selectedEdge={ selectedEdge }
                    onCardClose={ () => onCurrentCardChange(null) }
                    onNodeLinkClicked={onNodeLinkClicked}
                    onEdgeLinkClicked={onEdgeLinkClicked}
                />
                <ViewSettingIcon 
                    onIconClick={() => onCurrentCardChange(currentCard === "setting" ? null : "setting")}
                    className="absolute top-2 right-2 z-10" 
                />
            </div>
            <ViewInfoModal open={modalOpen} onOpenChange={setModalOpen} />

            <Progress 
                chapterData={siteData.chapters[chapter]} 
                day={day} 
                onDayChange={ (newDay: number) => updateData(chapter, newDay) } 
            />
        </>
    );
};

export default ViewApp;
