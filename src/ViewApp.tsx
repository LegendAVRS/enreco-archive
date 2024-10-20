import { loadFile } from "@/lib/helper";
import {
    ConnectionLineType,
    ConnectionMode,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import chart from "@/data/chart.json";
import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import { useCallback, useEffect } from "react";
import ImageNodeView from "@/components/ImageNodeView";
import CustomEdgeView from "@/components/CustomEdgeView";

import "@xyflow/react/dist/style.css";

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

    const loadFlow = useCallback(() => {
        const restoreFlow = async () => {
            console.log(chart);
            // const flow = JSON.parse(chart);
            const flow = chart;

            if (flow) {
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
            }
        };

        restoreFlow();
    }, [setNodes, setEdges]);

    useEffect(() => {
        loadFlow();
    }, [loadFlow]);

    return (
        <div className="w-screen h-screen">
            <ReactFlow
                connectionMode={ConnectionMode.Loose}
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
            ></ReactFlow>
        </div>
    );
};

export default ViewApp;
