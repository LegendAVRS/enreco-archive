import { addEdge, Connection, ConnectionLineType, ConnectionMode, OnEdgesChange, OnNodesChange, ReactFlow, useReactFlow } from "@xyflow/react";

import EditorImageNode from "@/components/editor/EditorImageNode";
import EditorCustomEdge from "@/components/editor/EditorCustomEdge";
import EditorSmoothEdge from "@/components/editor/EditorSmoothEdge";
import EditorStraightEdge from "@/components/editor/EditorStraightEdge";
import EditorFixedEdge from "@/components/editor/EditorFixedEdge";
import { CustomEdgeType, CustomEdgeTypeNames, ImageNodeType } from "@/lib/type";
import { MouseEventHandler, useCallback } from "react";

const nodeTypes = {
    image: EditorImageNode,
};

const edgeTypes = {
    custom: EditorCustomEdge,
    customSmooth: EditorSmoothEdge,
    customStraight: EditorStraightEdge,
    fixed: EditorFixedEdge,
};

interface EditorChartProps {
    nodes: ImageNodeType[];
    edges: CustomEdgeType[];
    areNodesDraggable: boolean;
    edgeType: CustomEdgeTypeNames;
    onNodesChange: OnNodesChange<ImageNodeType>;
    onEdgesChange: OnEdgesChange<CustomEdgeType>;
    onNodeClick: (node: ImageNodeType) => void;
    onEdgeClick: (edge: CustomEdgeType) => void;
    onClick: MouseEventHandler<HTMLDivElement>;
}

export function EditorChart({
    nodes,
    edges,
    areNodesDraggable,
    edgeType,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onEdgeClick,
    onClick
}: EditorChartProps) {
    const { setEdges } = useReactFlow<ImageNodeType, CustomEdgeType>();

    const connectEdge = useCallback((params: Connection) => {
        const newEdge: CustomEdgeType = {
            id: `${params.source}-${params.target}-${params.sourceHandle}-${params.targetHandle}`,
            source: params.source,
            target: params.target,
            sourceHandle: params.sourceHandle,
            targetHandle: params.targetHandle,
            type: edgeType,
            data: {
                relationshipId: "",
                title: "",
                content: "",
                timestampUrl: "",
                new: true,
                path: "",
                marker: false
            }
        };
        
        setEdges((oldEdges) => addEdge(newEdge, oldEdges));
    }, [edgeType, setEdges]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodesDraggable={areNodesDraggable}
            onClick={onClick}
            onNodeClick={(_, node) => {
                onNodeClick(node);
            }}
            onEdgeClick={(_, edge) => {
                onEdgeClick(edge);
            }}
            onConnect={connectEdge}
            snapToGrid
            snapGrid={[25, 25]}
            connectionMode={ConnectionMode.Loose}
            connectionLineType={ConnectionLineType.SmoothStep}
            zoomOnDoubleClick={false}
        />
    );
}