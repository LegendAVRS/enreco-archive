import { useChartStore } from "@/store/chartStore";
import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import {
    addEdge,
    MarkerType,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import { useFlowStore } from "@/store/flowStore";
import { useEditorStore } from "@/store/editorStore";

const useEditor = () => {
    const { data } = useChartStore();
    const [nodes, setNodes, onNodesChange] = useNodesState<ImageNodeType>(
        data.nodes
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>(
        data.edges
    );
    const { screenToFlowPosition, deleteElements } = useReactFlow();
    const { selectedEdge, selectedNode, setSelectedEdge, setSelectedNode } =
        useFlowStore();
    const { setCurrentCard } = useEditorStore();

    // Add a new image node at the the given position
    const addNode = (x: number, y: number) => {
        const newNode: ImageNodeType = {
            id: `node-${nodes.length}`,
            type: "image",
            position: screenToFlowPosition({ x, y }),
            data: {
                imageSrc:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4bQpq3aVnJCw8BEZhZPCZ-Mr_R9lY3hLXag&s",
            },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const connectEdge = (params: CustomEdgeType) => {
        params.type = "custom";
        params.data = {
            relationship: null,
            title: "",
            content: "",
            timestampUrl: "",
        };
        params.markerEnd = {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#FF0072",
        };
        setEdges((eds) => addEdge(params, eds));
    };

    // @ts-expect-error Define type later, red lines annoying
    const updateEdge = (params) => {
        // Create a new edges array to force re-render
        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === params.id ? { ...edge, ...params } : edge
            )
        );
    };

    // Delete selected node
    const deleteEdge = () => {
        if (selectedEdge) {
            deleteElements({
                edges: [selectedEdge],
            });
        }
        setSelectedEdge(null);
        setCurrentCard(null);
    };

    const deleteNode = () => {
        if (selectedNode) {
            deleteElements({
                nodes: [selectedNode],
            });
        }
        setSelectedNode(null);
        setCurrentCard(null);
        return;
    };
    return {
        addNode,
        deleteEdge,
        deleteNode,
        connectEdge,
        updateEdge,
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
    };
};

export default useEditor;
