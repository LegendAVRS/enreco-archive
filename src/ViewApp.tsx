import ViewCustomEdge from "@/components/view/ViewCustomEdge";
import ImageNodeView from "@/components/view/ViewImageNode";
import chart from "@/data/day5.json";
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

const nodeTypes = {
    image: ImageNodeView,
};

const edgeTypes = {
    fixed: ViewCustomEdge,
};

const ViewApp = () => {
    const { setData } = useChartStore();
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
    } = useViewStore();

    const { fitView, setCenter, getNode } = useReactFlow();
    const [minZoom, setMinZoom] = useState(0.7);

    useEffect(() => {
        // On mobile it's harader to zoom out, so we set a lower min zoom
        if (isMobile) {
            setMinZoom(0.5);
        }
    }, []);

    const loadFlow = useCallback(() => {
        const restoreFlow = async () => {
            const flow = chart;

            if (flow) {
                setNodes((flow.nodes as ImageNodeType[]) || []);
                setEdges((flow.edges as CustomEdgeType[]) || []);
                setData((flow as ChartData) || {});
                const edgeVisibilityLoaded: { [key: string]: boolean } = {};
                const teamVisibilityLoaded: { [key: string]: boolean } = {};
                const characterVisibilityLoaded: { [key: string]: boolean } =
                    {};

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
    ]);

    useEffect(() => {
        loadFlow();
    }, [loadFlow]);

    // function to get center of edge, based of the center of the two nodes
    const getCenter = (nodeAID: string, nodeBID: string) => {
        const nodeA = getNode(nodeAID);
        const nodeB = getNode(nodeBID);
        const nodeAPosition = nodeA!.position;
        const nodeBPosition = nodeB!.position;
        let offsetX = 0;
        let offsetY = 0;
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
                    onNodeClick={(_, node) => {
                        setSelectedNode(node);
                        fitView({ nodes: [node], duration: 500, maxZoom: 1.5 });
                        setCurrentCard("node");
                    }}
                    onEdgeClick={(_, edge) => {
                        setSelectedEdge(edge);
                        const centerPoint = getCenter(edge.source, edge.target);
                        setCenter(centerPoint.x, centerPoint.y, {
                            duration: 500,
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
