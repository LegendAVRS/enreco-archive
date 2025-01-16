"use client";
import { useState } from "react";

import { CustomEdgeType, ImageNodeType, SiteData } from "@/lib/type";
import ViewEdgeCard from "@/components/view/ViewEdgeCard";
import ViewInfoModal from "@/components/view/ViewInfoModal";
import ViewNodeCard from "@/components/view/ViewNodeCard";
import ViewSettingCard from "@/components/view/ViewSettingCard";
import ViewSettingIcon from "@/components/view/ViewSettingIcon";
import { useFlowStore } from "@/store/flowStore";
import { CardType, useViewStore } from "@/store/viewStore";

import Progress from "@/components/view/Progress";
import { useDisabledDefaultMobilePinchZoom } from "./hooks/useDisabledDefaultMobilePinchZoom";
import { useBrowserHash } from "./hooks/useBrowserHash";
import ViewChart from "./components/view/ViewChart";

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
    } = useViewStore();

    const [ chartShrink, setChartShrink ] = useState(0);
    const { browserHash, setBrowserHash } = useBrowserHash(onBrowserHashChange);

    // For disabling default pinch zoom on mobiles, as it conflict with the chart's zoom
    // Also when pinch zoom when one of the cards are open, upon closing the zoom will stay that way permanently
    useDisabledDefaultMobilePinchZoom();

    /* Data variables */
    const chapterData = siteData.chapters[chapter];
    const dayData = chapterData.charts[day];
    const nodes = dayData.nodes;
    const edges = dayData.edges;

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
            setChartShrink(500);
        }
        else if(currentCard === "setting" && newCurrentCard === null) {
            setChartShrink(0);
        }

        setCurrentCard(newCurrentCard);
    }

    function onNodeClick(node: ImageNodeType) {
        onCurrentCardChange("node");
        setSelectedNode(node);
    }

    function onEdgeClick(edge: CustomEdgeType) {
        onCurrentCardChange("edge");
        setSelectedEdge(edge);
    }

    function onPaneClick() {
        onCurrentCardChange(null);
        setSelectedNode(null);
        setSelectedEdge(null);
    }

    function onNodeLinkClicked(targetNode: ImageNodeType) {
        setCurrentCard("node");
        setSelectedNode(targetNode);
    }

    function onEdgeLinkClicked(targetEdge: CustomEdgeType) {
        setCurrentCard("edge");
        setSelectedEdge(targetEdge);
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
                <ViewChart
                    nodes={nodes}
                    edges={edges}
                    edgeVisibility={edgeVisibility}
                    teamVisibility={teamVisibility}
                    characterVisibility={characterVisibility}
                    dayData={dayData}
                    selectedNode={selectedNode}
                    selectedEdge={selectedEdge}
                    widthToShrink={chartShrink}
                    onNodeClick={onNodeClick}
                    onEdgeClick={onEdgeClick}
                    onPaneClick={onPaneClick}
                />
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
