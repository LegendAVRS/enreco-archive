import { 
    addEdge, 
    applyEdgeChanges, 
    applyNodeChanges, 
    Connection, 
    ConnectionLineType, 
    ConnectionMode, 
    OnEdgesChange, 
    OnNodesChange, 
    ReactFlow,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import EditorImageNode from "@/components/editor/EditorImageNode";
import EditorCustomEdge from "@/components/editor/EditorCustomEdge";
import EditorSmoothEdge from "@/components/editor/EditorSmoothEdge";
import EditorStraightEdge from "@/components/editor/EditorStraightEdge";
import EditorFixedEdge from "@/components/editor/EditorFixedEdge";
import { CustomEdgeType, CustomEdgeTypeNames, EditorImageNodeType } from "@/lib/type";
import { MouseEventHandler, useCallback } from "react";
import { generateEdgeId } from "@/lib/editor-utils";

const nodeTypes = {
    editorImage: EditorImageNode,
};

const edgeTypes = {
    custom: EditorCustomEdge,
    customSmooth: EditorSmoothEdge,
    customStraight: EditorStraightEdge,
    fixed: EditorFixedEdge,
};

interface EditorChartProps {
    nodes: EditorImageNodeType[];
    edges: CustomEdgeType[];
    areNodesDraggable: boolean;
    canPlaceNewNode: boolean;
    edgeType: CustomEdgeTypeNames;
    onNodeClick: (node: EditorImageNodeType) => void;
    onEdgeClick: (edge: CustomEdgeType) => void;
    setNodes: (nodes: EditorImageNodeType[]) => void;
    setEdges: (edges: CustomEdgeType[]) => void;
}

export function EditorChart({
    nodes,
    edges,
    areNodesDraggable,
    canPlaceNewNode,
    edgeType,
    setNodes,
    setEdges,
    onNodeClick,
    onEdgeClick,
}: EditorChartProps) {
    const { screenToFlowPosition } = useReactFlow();

    const addNode = useCallback((x: number, y: number) => {
        const newNode: EditorImageNodeType = {
            id: `node-${nodes.length + 1}`,
            type: "editorImage",
            position: screenToFlowPosition({ x, y }),
            data: {
                title: "",
                content: "",
                imageSrc: "/default-node-image.png",
                teamId: "",
                status: "",
                new: true,
                bgCardColor: "",
                renderShowHandles: true
            },
        };
        console.log(x, y, newNode);
        setNodes([...nodes, newNode]);
    }, [nodes, screenToFlowPosition, setNodes]);

    const connectEdge = useCallback((params: Connection) => {
        const newEdge: CustomEdgeType = {
            id: generateEdgeId(params.source, params.target, params.sourceHandle, params.targetHandle),
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
                marker: false,
                renderEdgeStyle: {},
                customEdgeHLOffset: 0,
                customEdgeVLOffset: 0,
                customEdgeHCOffset: 0,
                customEdgeVROffset: 0,
                customEdgeHROffset: 0
            }
        };
        
        setEdges(addEdge(newEdge, edges));
    }, [edgeType, edges, setEdges]);

    const onNodesChange: OnNodesChange<EditorImageNodeType> = useCallback((changes) => {
        const newNodes = applyNodeChanges(changes, nodes);
        setNodes(newNodes);
    }, [nodes, setNodes]);

    const onEdgesChange: OnEdgesChange<CustomEdgeType> = useCallback((changes) => {
        const newEdges = applyEdgeChanges(changes, edges);
        setEdges(newEdges);
    }, [edges, setEdges]);

    const handleClick: MouseEventHandler<HTMLDivElement> = useCallback((event) => {
        if (canPlaceNewNode) {
            addNode(event.clientX, event.clientY);
        }
    }, [addNode, canPlaceNewNode]);

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
            onClick={handleClick}
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