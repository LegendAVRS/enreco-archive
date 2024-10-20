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
import ImageNodeView from "@/components/view/ImageNodeView";
import CustomEdgeView from "@/components/view/CustomEdgeView";

import "@xyflow/react/dist/style.css";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useViewStore } from "@/store/viewStore";
import NodeCardView from "@/components/view/NodeCardView";
import EdgeCardView from "@/components/view/EdgeCardView";
import { Button } from "@/components/ui/button";
import SettingCard from "@/components/view/SettingCard";

const nodeTypes = {
    image: ImageNodeView,
};

const edgeTypes = {
    custom: CustomEdgeView,
};

// This is a simple view app that uses the ReactFlow component
const ViewApp = () => {
    const [nodes, setNodes] = useNodesState<ImageNodeType>([]);
    const [edges, setEdges] = useEdgesState<CustomEdgeType>([]);
    const { setData } = useChartStore();
    const { setSelectedEdge, setSelectedNode } = useFlowStore();
    const { currentCard, setCurrentCard, setEdgeVisibility } = useViewStore();

    const { fitView, setCenter } = useReactFlow();

    const loadFlow = useCallback(() => {
        const restoreFlow = async () => {
            console.log(chart);
            // const flow = JSON.parse(chart);
            const flow = chart;

            if (flow) {
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setData(flow || {});
                const edgeVisibilityLoaded: { [key: string]: boolean } = {};
                Object.keys(flow.relationships).forEach((key) => {
                    edgeVisibilityLoaded[key] = true;
                });
                setEdgeVisibility(edgeVisibilityLoaded);
            }
        };

        restoreFlow();
    }, [setNodes, setEdges, setData, setEdgeVisibility]);

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
        <div className="w-screen h-screen overflow-hidden">
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
            {currentCard === "setting" && <SettingCard />}
            {currentCard === "node" && <NodeCardView />}
            {currentCard === "edge" && <EdgeCardView />}
        </div>
    );
};

export default ViewApp;
