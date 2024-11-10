import ViewCustomEdge from "@/components/view/ViewCustomEdge";
import ImageNodeView from "@/components/view/ViewImageNode";
import { ChartData, CustomEdgeType, ImageNodeType } from "@/lib/type";
import {
    ConnectionMode,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";

import ViewEdgeCard from "@/components/view/ViewEdgeCard";
import ViewInfoModal from "@/components/view/ViewInfoModal";
import ViewNodeCard from "@/components/view/ViewNodeCard";
import ViewSettingCard from "@/components/view/ViewSettingCard";
import ViewSettingIcon from "@/components/view/ViewSettingIcon";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useViewStore } from "@/store/viewStore";
import "@xyflow/react/dist/style.css";
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
            setMinZoom(0.5);
        }

        // Set site data, temporary until we have a proper way to load data
        // @ts-expect-error json data might be wrong
        setSiteData(siteDataIn);
    }, [setSiteData]);
    console.log(siteData);

    const loadFlow = useCallback(() => {
        const restoreFlow = async () => {
            const flow = data;

            if (flow) {
                setNodes((flow.nodes as ImageNodeType[]) || []);
                setEdges((flow.edges as CustomEdgeType[]) || []);
                setData((flow as ChartData) || {});
                const edgeVisibilityLoaded: { [key: string]: boolean } = {};
                const teamVisibilityLoaded: { [key: string]: boolean } = {};
                const characterVisibilityLoaded: { [key: string]: boolean } =
                    {};

                edgeVisibilityLoaded["new"] =
                    edgeVisibilityLoaded["new"] || true;
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
        };

        restoreFlow();
    }, [
        setNodes,
        setEdges,
        setData,
        setEdgeVisibility,
        setTeamVisibility,
        setCharacterVisibility,
        data,
    ]);

    useEffect(() => {
        if (
            chapter !== undefined &&
            day !== undefined &&
            siteData.chapters.length > 0
        ) {
            setData(siteData.chapters[chapter].charts[day]);
        }
    }, [chapter, day, setData, siteData]);

    useEffect(() => {
        loadFlow();
    }, [loadFlow, data]);

    useEffect(() => {
        if (currentCard === "setting") {
            setSettingCardWidth(300);
        } else {
            setSettingCardWidth(0);
        }
    }, [currentCard, setSettingCardWidth]);

    useEffect(() => {
        if (currentCard === "setting") {
            const reactFlowRenderer = document.querySelector<HTMLDivElement>(
                ".react-flow__renderer"
            );
            console.log(reactFlowRenderer);
            if (reactFlowRenderer && !isMobile) {
                reactFlowRenderer.style.width = `calc(100% - ${300}px)`;
                console.log(reactFlowRenderer);
            }
            fitView({ padding: 0.5, duration: 1000 });
        } else {
            const reactFlowRenderer = document.querySelector<HTMLDivElement>(
                ".react-flow__renderer"
            );
            console.log(reactFlowRenderer);
            if (reactFlowRenderer && !isMobile) {
                reactFlowRenderer.style.width = `100%`;
            }
            if (currentCard === null) {
                fitView({ padding: 0.5, duration: 1000 });
            }
        }
    }, [settingCardWidth, fitView, nodes, edges, currentCard]);

    // function to get center of edge, based of the center of the two nodes
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
