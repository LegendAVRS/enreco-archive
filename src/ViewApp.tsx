"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import {
    Background,
    BackgroundVariant,
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
import { parseChapterAndDay, useViewStore } from "@/store/viewStore";
import { isMobile } from "react-device-detect";

import siteDataIn from "@/data/site.json";

const nodeTypes = {
    image: ImageNodeView,
};

const edgeTypes = {
    fixed: ViewCustomEdge,
};

const ViewApp = () => {
    const { setData, data } = useChartStore();
    const [nodes, setNodes] = useNodesState<ImageNodeType>([]);
    const [edges, setEdges] = useEdgesState<CustomEdgeType>([]);
    const { setSelectedEdge, setSelectedNode } = useFlowStore();
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
        siteData,
        setHoveredEdgeId,
        validateChapterAndDay,
    } = useViewStore();

    const { fitView, setCenter, getNode } = useReactFlow();
    const [minZoom, setMinZoom] = useState(0.5);
    const [settingCardWidth, setSettingCardWidth] = useState(0);
    const panFromSetting = useRef(false);

    useEffect(() => {
        // On mobile it's harader to zoom out, so we set a lower min zoom
        if (isMobile) {
            setMinZoom(0.3);
        }

        // Set site data, temporary until we have a proper way to load data
        // @ts-expect-error json data might be wrong
        setSiteData(siteDataIn);
    }, [setSiteData]);

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
        if (chapter !== undefined && day !== undefined && siteData.chapter) {
            setData(siteData.chapter.charts[day]);
        }
    }, [chapter, day, setData, siteData]);

    // Update the URL when the chapter or day changes
    useEffect(() => {
        if (chapter !== undefined && day !== undefined) {
            // This works but it also modifies history.
            // document.location.hash = `${chapter}/${day}`

            window.history.replaceState({}, "", `#${chapter}/${day}`);
        }
    }, [chapter, day]);

    // Update the chapter and day if the URL hash changes too
    useEffect(() => {
        const handleHashChange = () => {
            const [possibleNewChapter, possibleNewDay] = parseChapterAndDay();
            const [newChapter, newDay] = validateChapterAndDay(
                possibleNewChapter,
                possibleNewDay
            );

            setChapter(newChapter);
            setDay(newDay);

            // If they set something dumb, should this also "reset" the URL to whatever we're actually
            // internally using?
            window.history.replaceState({}, "", `#${newChapter}/${newDay}`);
        };

        window.addEventListener("hashchange", handleHashChange);
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, [setChapter, setDay, validateChapterAndDay]);

    // Load the flow when data changes
    useEffect(() => {
        loadFlow();
    }, [loadFlow, data]);
    useEffect(() => {
        if (currentCard === "setting") {
            // Same width as the ViewCard
            setSettingCardWidth(500);
            panFromSetting.current = true;
        } else {
            if (currentCard !== null) {
                panFromSetting.current = false;
            }
            setSettingCardWidth(0);
        }
    }, [currentCard, setSettingCardWidth, panFromSetting]);

    // Update react flow renderer width when setting card is open, so the flow is not covered by the card
    useEffect(() => {
        const reactFlowRenderer = document.querySelector<HTMLDivElement>(
            ".react-flow__renderer"
        );
        if (reactFlowRenderer && !isMobile) {
            reactFlowRenderer.style.width = `calc(100% - ${settingCardWidth}px)`;
        }

        // Need a slight delay to make sure the width is updated before fitting the view
        if (currentCard === "setting") {
            setTimeout(() => {
                fitView({ padding: 0.5, duration: 1000 });
            }, 50);
            return;
        }

        // Fit view when no card is open (only on mobile or when closing from setting)
        if (currentCard === null && (isMobile || panFromSetting.current)) {
            setTimeout(() => {
                fitView({ padding: 0.5, duration: 1000 });
            }, 50);
            panFromSetting.current = false;
        }
    }, [fitView, currentCard, nodes, edges, panFromSetting, settingCardWidth]);

    // Get center of edge, based of the center of the two nodes
    // TODO: needs to be improved
    const getCenter = (nodeAID: string, nodeBID: string) => {
        const nodeA = getNode(nodeAID);
        const nodeB = getNode(nodeBID);
        const nodeAPosition = nodeA!.position;
        const nodeBPosition = nodeB!.position;
        const offsetX = 0;
        const offsetY = 0;
        // if (!isMobile) {
        //     offsetX = Math.abs(nodeA!.position.x - nodeB!.position.x) / 2;
        //     offsetY = Math.abs(nodeA!.position.y - nodeB!.position.y) / 4;
        // }
        return {
            x: (nodeAPosition.x + nodeBPosition.x) / 2 + offsetX,
            y: (nodeAPosition.y + nodeBPosition.y) / 2 + offsetY,
        };
    };

    const getTopLeftNode = useCallback(() => {
        let topLeftNode = nodes[0];
        for (const node of nodes) {
            if (node.position.y < topLeftNode.position.y) {
                topLeftNode = node;
            }
        }
        for (const node of nodes) {
            if (
                node.position.y <= topLeftNode.position.y &&
                node.position.x < topLeftNode.position.x
            ) {
                topLeftNode = node;
            }
        }
        return topLeftNode;
    }, [nodes]);

    const getBottomRightNode = useCallback(() => {
        let bottomRightNode = nodes[0];
        for (const node of nodes) {
            if (node.position.y > bottomRightNode.position.y) {
                bottomRightNode = node;
            }
        }
        for (const node of nodes) {
            if (
                node.position.y >= bottomRightNode.position.y &&
                node.position.x > bottomRightNode.position.x
            ) {
                bottomRightNode = node;
            }
        }
        return bottomRightNode;
    }, [nodes]);

    // To limit the area where the user can pan
    const areaOffset = 1000;
    const topLeftNode = useMemo(() => getTopLeftNode(), [getTopLeftNode]);
    const bottomRightNode = useMemo(
        () => getBottomRightNode(),
        [getBottomRightNode]
    );

    if (!data) {
        return;
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
                        setCurrentCard("node");
                    }}
                    onEdgeClick={(_, edge) => {
                        setSelectedEdge(edge);
                        const centerPoint = getCenter(edge.source, edge.target);
                        setCenter(centerPoint.x, centerPoint.y, {
                            duration: 1000,
                            zoom: 1.5,
                        });
                        setCurrentCard("edge");
                    }}
                    minZoom={minZoom}
                    zoomOnDoubleClick={false}
                    onPaneClick={() => {
                        setCurrentCard(null);
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
                >
                    <Background variant={BackgroundVariant.Dots} />
                </ReactFlow>
                <ViewSettingCard />
                <ViewNodeCard />
                <ViewEdgeCard />
                <ViewSettingIcon className="absolute top-5 right-5 z-10" />
            </div>
            <ViewInfoModal open={modalOpen} onOpenChange={setModalOpen} />
        </>
    );
};

export default ViewApp;
