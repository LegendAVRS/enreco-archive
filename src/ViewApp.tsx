import ViewCustomEdge from "@/components/view/ViewCustomEdge";
import ImageNodeView from "@/components/view/ViewImageNode";
import chart from "@/data/chart.json";
import { ChartData, CustomEdgeType, ImageNodeType } from "@/lib/type";
import {
    ConnectionMode,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";
import ViewEdgeCard from "@/components/view/ViewEdgeCard";
import ViewNodeCard from "@/components/view/ViewNodeCard";
import ViewSettingCard from "@/components/view/ViewSettingCard";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useViewStore } from "@/store/viewStore";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
    image: ImageNodeView,
};

const edgeTypes = {
    custom: ViewCustomEdge,
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
    } = useViewStore();

    const { fitView, setCenter } = useReactFlow();

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

                flow.nodes.forEach((node) => {
                    teamVisibilityLoaded[node.data.team] = true;
                    characterVisibilityLoaded[node.data.title] = true;
                });

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

    // function to get center of svg path
    const getCenter = (path: string) => {
        const pathElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        pathElement.setAttribute("d", path);
        const pathLength = pathElement.getTotalLength();
        const { x, y } = pathElement.getPointAtLength(pathLength / 2);
        return { x, y };
    };

    return (
        <div className="w-screen h-screen overflow-hidden ">
            <ReactFlow
                connectionMode={ConnectionMode.Loose}
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                onNodeClick={(e, node) => {
                    setSelectedNode(node);
                    fitView({ nodes: [node], duration: 500, maxZoom: 1.3 });
                    setCurrentCard("node");
                }}
                onEdgeClick={(e, edge) => {
                    setSelectedEdge(edge);
                    if (!edge.data) return;
                    const centerPoint = getCenter(edge.data.path || "");
                    setCenter(centerPoint.x, centerPoint.y, {
                        duration: 500,
                        zoom: 1.3,
                    });
                    setCurrentCard("edge");
                }}
                minZoom={0.9}
                zoomOnDoubleClick={false}
            ></ReactFlow>
            <Button
                className="top-5 right-10 absolute"
                onClick={() => setCurrentCard("setting")}
            >
                Settings
            </Button>
            {currentCard === "setting" && <ViewSettingCard />}
            {currentCard === "node" && <ViewNodeCard />}
            {currentCard === "edge" && <ViewEdgeCard />}
        </div>
    );
};

export default ViewApp;
