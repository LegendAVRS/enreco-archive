"use client";
import { useState } from "react";

import ViewEdgeCard from "@/components/view/ViewEdgeCard";
import ViewInfoModal from "@/components/view/ViewInfoModal";
import ViewNodeCard from "@/components/view/ViewNodeCard";
import ViewSettingCard from "@/components/view/ViewSettingCard";
import {
    CustomEdgeType,
    FitViewOperation,
    ImageNodeType,
    SiteData,
} from "@/lib/type";
import { useFlowStore } from "@/store/flowStore";
import { CardType, useViewStore } from "@/store/viewStore";

import ViewAskVideoModal from "@/components/view/ViewAskVideoModal";
import ViewMiniGameModal from "@/components/view/ViewMiniGameModal";
import ViewVideoModal from "@/components/view/ViewVideoModal";
import { Dice6, Info, Settings } from "lucide-react";
import { IconButton } from "./components/ui/IconButton";
import ViewChart from "./components/view/ViewChart";
import ViewSettingsModal from "./components/view/ViewSettingsModal";
import { ViewTransportControls } from "./components/view/ViewTransportControls";
import { useBrowserHash } from "./hooks/useBrowserHash";
import { useDisabledDefaultMobilePinchZoom } from "./hooks/useDisabledDefaultMobilePinchZoom";

function parseChapterAndDayFromBrowserHash(hash: string): number[] | null {
    const parseOrZero = (value: string): number => {
        const parsed = parseInt(value, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const parts = hash.split("/");

    if (parts.length === 2) {
        const chapter = parseOrZero(parts[0]);
        const day = parseOrZero(parts[1]);
        return [chapter, day];
    }

    return null;
}

interface Props {
    siteData: SiteData;
}

let didInit = false;
const ViewApp = ({ siteData }: Props) => {
    /* State variables */
    const flowStore = useFlowStore();
    const viewStore = useViewStore();

    // TODO: might need to convert this to state once bgm is implemented
    const [isBgmEnabled, setIsBgmEnabled] = useState(false);
    const [chartShrink, setChartShrink] = useState(0);
    const [fitViewOperation, setFitViewOperation] =
        useState<FitViewOperation>("none");
    const { browserHash, setBrowserHash } = useBrowserHash(onBrowserHashChange);

    // For disabling default pinch zoom on mobiles, as it conflict with the chart's zoom
    // Also when pinch zoom when one of the cards are open, upon closing the zoom will stay that way permanently
    useDisabledDefaultMobilePinchZoom();

    /* Data variables */
    const chapterData = siteData.chapters[viewStore.chapter];
    const dayData = chapterData.charts[viewStore.day];
    const nodes = dayData.nodes;
    const edges = dayData.edges;

    /* Helper function to coordinate state updates when data changes. */
    function updateData(newChapter: number, newDay: number) {
        if (
            newChapter < 0 ||
            newChapter > siteData.numberOfChapters ||
            newDay < 0 ||
            newDay > siteData.chapters[viewStore.chapter].numberOfDays
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
        viewStore.setEdgeVisibility(edgeVisibilityLoaded);
        viewStore.setTeamVisibility(teamVisibilityLoaded);
        viewStore.setCharacterVisibility(characterVisibilityLoaded);
        viewStore.setChapter(newChapter);
        viewStore.setDay(newDay);
        setBrowserHash(`${newChapter}/${newDay}`);
    }

    /* Event handler functions */
    function onBrowserHashChange(hash: string) {
        const parsedValues = parseChapterAndDayFromBrowserHash(hash);

        if (parsedValues) {
            const [chapter, day] = parsedValues;
            updateData(chapter, day);
        }
    }

    // Update react flow renderer width when setting card is open, so the flow is not covered by the card
    function onCurrentCardChange(newCurrentCard: CardType) {
        if (newCurrentCard === "setting") {
            // Same width as the ViewCard
            setChartShrink(500);
        } else {
            setChartShrink(0);
        }

        if (newCurrentCard === "setting" || newCurrentCard === null) {
            setFitViewOperation("fit-to-all");
        } else if (newCurrentCard === "node") {
            setFitViewOperation("fit-to-node");
        } else if (newCurrentCard === "edge") {
            setFitViewOperation("fit-to-edge");
        }

        viewStore.setCurrentCard(newCurrentCard);
    }

    function onNodeClick(node: ImageNodeType) {
        onCurrentCardChange("node");
        flowStore.setSelectedNode(node);
    }

    function onEdgeClick(edge: CustomEdgeType) {
        onCurrentCardChange("edge");
        flowStore.setSelectedEdge(edge);
    }

    function onPaneClick() {
        onCurrentCardChange(null);
        flowStore.setSelectedNode(null);
        flowStore.setSelectedEdge(null);
    }

    /* Init block, runs only on first render/load. */
    if (!didInit) {
        didInit = true;

        const initialChapterDay =
            parseChapterAndDayFromBrowserHash(browserHash);
        if (initialChapterDay) {
            const [chapter, day] = initialChapterDay;
            updateData(chapter, day);
        } else {
            updateData(0, 0);
        }
    }

    return (
        <>
            <div className="w-screen h-screen top-0 inset-x-0 overflow-hidden">
                <ViewChart
                    nodes={nodes}
                    edges={edges}
                    edgeVisibility={viewStore.edgeVisibility}
                    teamVisibility={viewStore.teamVisibility}
                    characterVisibility={viewStore.characterVisibility}
                    dayData={dayData}
                    selectedNode={flowStore.selectedNode}
                    selectedEdge={flowStore.selectedEdge}
                    widthToShrink={chartShrink}
                    isCardOpen={viewStore.currentCard !== null}
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
                    isCardOpen={viewStore.currentCard === "setting"}
                    onCardClose={() => onCurrentCardChange(null)}
                    day={viewStore.day}
                    dayData={dayData}
                    edgeVisibility={viewStore.edgeVisibility}
                    onEdgeVisibilityChange={viewStore.setEdgeVisibility}
                    teamVisibility={viewStore.teamVisibility}
                    onTeamVisibilityChange={viewStore.setTeamVisibility}
                    characterVisibility={viewStore.characterVisibility}
                    onCharacterVisibilityChange={
                        viewStore.setCharacterVisibility
                    }
                />
                <ViewNodeCard
                    isCardOpen={viewStore.currentCard === "node"}
                    selectedNode={flowStore.selectedNode}
                    onCardClose={() => onCurrentCardChange(null)}
                    dayData={dayData}
                    onNodeLinkClicked={onNodeClick}
                    onEdgeLinkClicked={onEdgeClick}
                />
                <ViewEdgeCard
                    isCardOpen={viewStore.currentCard === "edge"}
                    selectedEdge={flowStore.selectedEdge}
                    onCardClose={() => onCurrentCardChange(null)}
                    onNodeLinkClicked={onNodeClick}
                    onEdgeLinkClicked={onEdgeClick}
                />
            </div>

            <ViewInfoModal
                open={viewStore.infoModalOpen}
                onOpenChange={viewStore.setInfoModalOpen}
            />

            <ViewSettingsModal
                open={viewStore.settingsModalOpen}
                onOpenChange={viewStore.setSettingsModalOpen}
                bgmEnabled={isBgmEnabled}
                onBgmEnabledChange={(newValue: boolean) =>
                    setIsBgmEnabled(newValue)
                }
            />

            <ViewMiniGameModal
                open={viewStore.minigameModalOpen}
                onOpenChange={viewStore.setMinigameModalOpen}
            />

            <ViewVideoModal
                open={viewStore.videoModalOpen}
                onOpenChange={viewStore.setVideoModalOpen}
                videoUrl={viewStore.videoUrl}
            />

            <ViewAskVideoModal
                open={viewStore.askVideoModalOpen}
                onOpenChange={viewStore.setAskVideoModalOpen}
            />

            <div className="fixed top-0 right-0 m-2 z-10 flex flex-col gap-2">
                <IconButton
                    id="chart-info-btn"
                    className="h-10 w-10 p-0 bg-transparent outline-none border-0 transition-all cursor-pointer hover:opacity-80 hover:scale-110"
                    tooltipText="Chart Info / Visibility"
                    enabled={true}
                    tooltipSide="left"
                    onClick={() =>
                        onCurrentCardChange(
                            viewStore.currentCard === "setting"
                                ? null
                                : "setting"
                        )
                    }
                >
                    <img
                        src="https://cdn.holoen.fans/hefw/media/emblem.webp"
                        className="w-full h-full"
                    />
                </IconButton>

                <IconButton
                    id="info-btn"
                    className="h-10 w-10 p-1"
                    tooltipText="Info"
                    enabled={true}
                    tooltipSide="left"
                    onClick={() => viewStore.setInfoModalOpen(true)}
                >
                    <Info />
                </IconButton>

                <IconButton
                    id="settings-btn"
                    className="h-10 w-10 p-1"
                    tooltipText="Settings"
                    enabled={true}
                    tooltipSide="left"
                    onClick={() => viewStore.setSettingsModalOpen(true)}
                >
                    <Settings />
                </IconButton>

                <IconButton
                    id="minigames-btn"
                    className="h-10 w-10 p-1"
                    tooltipText="Minigames"
                    enabled={true}
                    tooltipSide="left"
                    onClick={() => viewStore.setMinigameModalOpen(true)}
                >
                    <Dice6 />
                </IconButton>
            </div>

            <div className="fixed inset-x-0 bottom-0 w-full md:w-4/5 2xl:w-2/5 mb-2 px-2 md:p-0 md:mx-auto">
                <ViewTransportControls
                    chapter={viewStore.chapter}
                    chapterData={chapterData}
                    day={viewStore.day}
                    numberOfChapters={siteData.numberOfChapters}
                    numberOfDays={chapterData.numberOfDays}
                    isCardOpen={viewStore.currentCard !== null}
                    onChapterChange={(newChapter) =>
                        updateData(newChapter, viewStore.day)
                    }
                    onDayChange={(newDay) =>
                        updateData(viewStore.chapter, newDay)
                    }
                />
            </div>
        </>
    );
};

export default ViewApp;
