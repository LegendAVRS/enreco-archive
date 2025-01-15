"use client";
import { useCallback, useEffect, useMemo } from "react";

import { CustomEdgeType, ImageNodeType, SiteData } from "@/lib/type";
import {
    ConnectionMode,
    ReactFlow,
    useEdgesState,
    useNodesState,
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
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { findCenterViewOfEdge } from "./lib/centerViewOnEdge";
import { CardType, useViewStore } from "@/store/viewStore";
import { isMobile } from "react-device-detect";

import Progress from "@/components/view/Progress";
import { useDisabledMobilePinchZoom } from "./hooks/useDisabledMobilePinchZoom";
import { useBrowserHash } from "./hooks/useBrowserHash";
import { useFlowViewShrinker } from "./hooks/useFlowViewShrinker";

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
    const { setData, data } = useChartStore();
    const [nodes, setNodes] = useNodesState<ImageNodeType>([]);
    const [edges, setEdges] = useEdgesState<CustomEdgeType>([]);
    const { setSelectedEdge, setSelectedNode } = useFlowStore();
    const { edgeVisibility } = useViewStore();
    const {
        currentCard,
        setCurrentCard,
        setEdgeVisibility,
        setTeamVisibility,
        setCharacterVisibility,
        modalOpen,
        setModalOpen,
        setSiteData,
        chapter,
        setChapter,
        day,
        setDay,
        setHoveredEdgeId,
    } = useViewStore();

    const { fitView, setCenter, getNode } = useReactFlow<ImageNodeType, CustomEdgeType>();
    const { shrinkFlowView, resetFlowView } = useFlowViewShrinker();

    // For disabling default pinch zoom on mobiles, as it conflict with the chart's zoom
    // Also when pinch zoom when one of the cards are open, upon closing the zoom will stay that way permanently
    useDisabledMobilePinchZoom();

    useEffect(() => {
        // Set site data, temporary until we have a proper way to load data
        // @ts-expect-error json data might be wrong
        setSiteData(siteData);
    }, [setSiteData, siteData]);

    // Load the flow from current chart data
    const loadFlow = useCallback(() => {
        const flow = data;

        if (flow) {
            // Setting the nodes, edges and data
            setNodes((flow.nodes as ImageNodeType[]) || []);
            setEdges((flow.edges as CustomEdgeType[]) || []);

            // Setting the visibility of edges, teams and characters
            const edgeVisibilityLoaded: { [key: string]: boolean } = {};
            const teamVisibilityLoaded: { [key: string]: boolean } = {};
            const characterVisibilityLoaded: { [key: string]: boolean } = {};

            // To avoid overwriting current visibility for "new"
            edgeVisibilityLoaded["new"] = edgeVisibilityLoaded["new"] || true;

            Object.keys(flow.relationships).forEach((key) => {
                edgeVisibilityLoaded[key] = true;
            });

            Object.keys(flow.teams).forEach((key) => {
                teamVisibilityLoaded[key] = true;
            });

            for (const node of flow.nodes) {
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
        }
    }, [
        setNodes,
        setEdges,
        setEdgeVisibility,
        setTeamVisibility,
        setCharacterVisibility,
        data,
    ]);

    // Update data when chapter or day changes
    useEffect(() => {
        if (chapter !== undefined && day !== undefined && siteData.chapters) {
            setData(siteData.chapters[chapter].charts[day]);
        }
    }, [chapter, day, setData, siteData]);

    function updateData(newChapter: number, newDay: number) {
        if(newChapter < 0 || newChapter > siteData.numberOfChapters || 
            newDay < 0 || newDay > siteData.chapters[chapter].numberOfDays
        ) {
            return;
        }
        setChapter(newChapter);
        setDay(newDay);
        setBrowserHash(`${newChapter}/${newDay}`);
    }

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
        else {
            resetFlowView();
        }

        setCurrentCard(newCurrentCard);
    }

    const { browserHash, setBrowserHash } = useBrowserHash(onBrowserHashChange);

    // Load the flow when data changes
    useEffect(() => {
        loadFlow();
    }, [loadFlow, data]);

    // Function to fit edge to view
    const fitEdge = (
        nodeAID: string,
        nodeBID: string,
        edge: CustomEdgeType
    ) => {
        const nodeA = getNode(nodeAID);
        const nodeB = getNode(nodeBID);
        if(!nodeA || !nodeB) {
            return;
        }
        
        const {centerPointX, centerPointY, duration, zoom} = findCenterViewOfEdge(nodeA, nodeB, edge, isMobile);

        // Pan to calculated center point
        setCenter(centerPointX, centerPointY, {
            duration: duration,
            zoom: zoom,
        });
    };

    const getTopLeftNode = useCallback(() => {
        let topLeftNode = nodes[0];
        for (const node of nodes) {
            if (node.position.x < topLeftNode.position.x) {
                topLeftNode = node;
            }
        }
        for (const node of nodes) {
            if (
                node.position.x <= topLeftNode.position.x &&
                node.position.y < topLeftNode.position.y
            ) {
                topLeftNode = node;
            }
        }
        return topLeftNode;
    }, [nodes]);

    const getBottomRightNode = useCallback(() => {
        let bottomRightNode = nodes[0];
        for (const node of nodes) {
            if (node.position.x > bottomRightNode.position.x) {
                bottomRightNode = node;
            }
        }
        for (const node of nodes) {
            if (
                node.position.x >= bottomRightNode.position.x &&
                node.position.y > bottomRightNode.position.y
            ) {
                bottomRightNode = node;
            }
        }
        return bottomRightNode;
    }, [nodes]);

    const topLeftNode = useMemo(() => getTopLeftNode(), [getTopLeftNode]);
    const bottomRightNode = useMemo(
        () => getBottomRightNode(),
        [getBottomRightNode]
    );
    if (!data) {
        return;
    }

    if(!didInit) {
        didInit = true;
        
        const initialChapterDay = parseChapterAndDayFromBrowserHash(browserHash);
        if(initialChapterDay) {
            const [chapter, day] = initialChapterDay;
            updateData(chapter, day);
        }
    }

    return (
        <>
            <div className="w-screen h-screen overflow-hidden ">
                <ReactFlow
                    connectionMode={ConnectionMode.Loose}
                    nodes={nodes}
                    edges={edges}
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
                        fitEdge(edge.source, edge.target, edge);

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
                <ViewSettingCard />
                <ViewNodeCard />
                <ViewEdgeCard />
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
