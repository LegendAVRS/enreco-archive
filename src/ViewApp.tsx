import { loadFile } from "@/lib/helper";
import {
    ConnectionLineType,
    ConnectionMode,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import chart from "@/data/chart.json";
import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import { useCallback, useEffect } from "react";
import ImageNodeView from "@/components/view/ViewImageNode";
import ViewCustomEdge from "@/components/view/ViewCustomEdge";

import "@xyflow/react/dist/style.css";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useViewStore } from "@/store/viewStore";
import ViewNodeCard from "@/components/view/ViewNodeCard";
import ViewEdgeCard from "@/components/view/ViewEdgeCard";
import { Button } from "@/components/ui/button";
import ViewSettingCard from "@/components/view/ViewSettingCard";

const nodeTypes = {
    image: ImageNodeView,
};

const edgeTypes = {
    custom: ViewCustomEdge,
};

const ViewApp = () => {
    const [nodes, setNodes] = useNodesState<ImageNodeType>([]);
    const [edges, setEdges] = useEdgesState<CustomEdgeType>([]);
    const { setData } = useChartStore();
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
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setData(flow || {});
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
                    const centerPoint = getCenter(edge.data.path);
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
