"use client";
import { useState } from "react";

import { CustomEdgeType, FitViewOperation, ImageNodeType, SiteData } from "@/lib/type";
import ViewEdgeCard from "@/components/view/ViewEdgeCard";
import ViewInfoModal from "@/components/view/ViewInfoModal";
import ViewNodeCard from "@/components/view/ViewNodeCard";
import ViewSettingCard from "@/components/view/ViewSettingCard";
import { useFlowStore } from "@/store/flowStore";
import { CardType, useViewStore } from "@/store/viewStore";

import { useDisabledDefaultMobilePinchZoom } from "./hooks/useDisabledDefaultMobilePinchZoom";
import { useBrowserHash } from "./hooks/useBrowserHash";
import ViewChart from "./components/view/ViewChart";
import ViewSettingsModal from "./components/view/ViewSettingsModal";
import { ViewTransportControls } from "./components/view/ViewTransportControls";
import { IconButton } from "./components/ui/IconButton";

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
        infoModalOpen,
        setInfoModalOpen,
        settingsModalOpen,
        setSettingsModalOpen,
        chapter,
        setChapter,
        day,
        setDay,
    } = useViewStore();

    // TODO: might need to convert this to state once bgm is implemented
    const [ isBgmEnabled, setIsBgmEnabled] = useState(false); 
    const [ chartShrink, setChartShrink ] = useState(0);
    const [ fitViewOperation, setFitViewOperation ] = useState<FitViewOperation>("none");
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

        onCurrentCardChange(null);
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
        else {
            setChartShrink(0);
        }

        if(newCurrentCard === "setting" || newCurrentCard === null) {
            setFitViewOperation("fit-to-all");
        }
        else if(newCurrentCard === "node") {
            setFitViewOperation("fit-to-node");
        }
        else if(newCurrentCard === "edge") {
            setFitViewOperation("fit-to-edge");
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

    /* Init block, runs only on first render/load. */
    if(!didInit) {
        didInit = true;
        
        const initialChapterDay = parseChapterAndDayFromBrowserHash(browserHash);
        if(initialChapterDay) {
            const [chapter, day] = initialChapterDay;
            updateData(chapter, day);
        }
        else {
            updateData(0, 0);
        }
    }

    return (
        <>
            <div className="w-screen h-screen top-0 inset-x-0 overflow-hidden">
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
                    isCardOpen={currentCard !== null}
                    fitViewOperation={fitViewOperation}
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
                    day={day}
                    dayData={dayData} 
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
                    onNodeLinkClicked={onNodeClick}
                    onEdgeLinkClicked={onEdgeClick}
                />
                <ViewEdgeCard 
                    isCardOpen={ currentCard === "edge" } 
                    selectedEdge={ selectedEdge }
                    onCardClose={ () => onCurrentCardChange(null) }
                    onNodeLinkClicked={onNodeClick}
                    onEdgeLinkClicked={onEdgeClick}
                />
            </div>
            
            <ViewInfoModal 
                open={infoModalOpen} 
                onOpenChange={setInfoModalOpen} 
            />

            <ViewSettingsModal 
                open={settingsModalOpen} 
                onOpenChange={setSettingsModalOpen}
                bgmEnabled={isBgmEnabled}
                onBgmEnabledChange={(newValue: boolean) => setIsBgmEnabled(newValue) }
            />

            <div className="fixed top-0 right-0 m-2 z-10 flex flex-col gap-2">
                <IconButton
                    id="chart-info-btn"
                    className="h-10 w-10 bg-transparent outline-none border-0 transition-all cursor-pointer hover:opacity-80 hover:scale-110"
                    tooltipText="Chart Info / Visibility"
                    imageSrc="https://cdn.holoen.fans/hefw/media/emblem.webp"
                    enabled={true}
                    tooltipSide="left"
                    onClick={() => onCurrentCardChange(currentCard === "setting" ? null : "setting")}
                />

                <IconButton
                    id="info-btn"
                    className="h-10 w-10 p-1"
                    tooltipText="Info"
                    imageSrc="/ui/circle-info-solid.svg"
                    enabled={true}
                    tooltipSide="left"
                    onClick={() => setInfoModalOpen(true)}
                />
    
                <IconButton
                    id="settings-btn"
                    className="h-10 w-10 p-1"
                    tooltipText="Settings"
                    imageSrc="/ui/gear-solid.svg"
                    enabled={true}
                    tooltipSide="left"
                    onClick={() => setSettingsModalOpen(true)}
                />

                <IconButton
                    id="minigames-btn"
                    className="h-10 w-10 p-1"
                    tooltipText="Minigames"
                    imageSrc="/ui/dice-six-solid.svg"
                    enabled={true}
                    tooltipSide="left"
                    onClick={() => console.log("minigame button clicked")}
                />
            </div>

            <div className="fixed inset-x-0 bottom-0 w-full md:w-4/5 2xl:w-2/5 mb-2 px-2 md:p-0 md:mx-auto">
                <ViewTransportControls 
                    chapter={chapter}
                    chapterData={chapterData}
                    day={day}
                    numberOfChapters={siteData.numberOfChapters}
                    numberOfDays={chapterData.numberOfDays}
                    onChapterChange={(newChapter) => updateData(newChapter, day)}
                    onDayChange={(newDay) => updateData(chapter, newDay)}
                />
            </div>
        </>
    );
};

export default ViewApp;
