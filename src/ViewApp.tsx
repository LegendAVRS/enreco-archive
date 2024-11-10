import { useCallback, useEffect, useState } from "react";

import { CustomEdgeType, ImageNodeType } from "@/lib/type";
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
import { useViewStore } from "@/store/viewStore";
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
        day,
        siteData,
    } = useViewStore();

    const { fitView, setCenter, getNode } = useReactFlow();
    const [minZoom, setMinZoom] = useState(0.5);
    const [settingCardWidth, setSettingCardWidth] = useState(0);

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
        if (
            chapter !== undefined &&
            day !== undefined &&
            siteData.chapters.length > 0
        ) {
            setData(siteData.chapters[chapter].charts[day]);
        }
    }, [chapter, day, setData, siteData]);

    // Load the flow when data changes
    useEffect(() => {
        loadFlow();
    }, [loadFlow, data]);

    // This seems very reduntant and hacky, but idk why, fitView (in the useEffect down below) needs to be called twice to work
    // This is a temporary fix, if we don't do this it'd flip the fitView (when setting opens it zooms in even though it should zoom out)
    useEffect(() => {
        if (currentCard === "setting") {
            setSettingCardWidth(300);
        } else {
            setSettingCardWidth(0);
        }
    }, [currentCard, setSettingCardWidth]);

    // Update react flow renderer width when setting card is open, so the flow is not covered by the card
    useEffect(() => {
        if (currentCard === "setting") {
            const reactFlowRenderer = document.querySelector<HTMLDivElement>(
                ".react-flow__renderer"
            );
            if (reactFlowRenderer && !isMobile) {
                reactFlowRenderer.style.width = `calc(100% - ${300}px)`;
            }
            fitView({ padding: 0.5, duration: 1000 });
        } else {
            const reactFlowRenderer = document.querySelector<HTMLDivElement>(
                ".react-flow__renderer"
            );
            if (reactFlowRenderer && !isMobile) {
                reactFlowRenderer.style.width = `100%`;
            }
            // Fit view when no card is open
            if (currentCard === null) {
                fitView({ padding: 0.5, duration: 1000 });
            }
        }
    }, [settingCardWidth, fitView, nodes, edges, currentCard]);

    // Get center of edge, based of the center of the two nodes (needs to be improved)
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
                ></ReactFlow>
                <ViewSettingIcon className="absolute top-5 right-5 z-10" />
                {currentCard === "setting" && <ViewSettingCard />}
                {currentCard === "node" && <ViewNodeCard />}
                {currentCard === "edge" && <ViewEdgeCard />}
            </div>
            <ViewInfoModal open={modalOpen} onOpenChange={setModalOpen} />
        </>
    );
};

export default ViewApp;
