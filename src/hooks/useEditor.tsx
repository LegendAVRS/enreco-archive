import useFlowState from "@/hooks/useFlowState";
import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import { useReactFlow, addEdge } from "@xyflow/react";

const useEditor = (
    nodes: ImageNodeType[],
    setNodes: React.Dispatch<React.SetStateAction<ImageNodeType[]>>,
    edges: CustomEdgeType[],
    setEdges: React.Dispatch<React.SetStateAction<CustomEdgeType[]>>
) => {
    const { screenToFlowPosition, deleteElements } = useReactFlow();
    const { selectedEdge, selectedNode } = useFlowState();

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

    // @ts-expect-error Define type later, red lines annoying
    const connectEdge = (params, setEdges) => {
        params.type = "custom";
        // @ts-expect-error Define type later, red lines annoying
        setEdges((eds) => addEdge(params, eds));
    };

    // @ts-expect-error Define type later, red lines annoying
    const updateEdge = (params, setEdges) => {
        // Replace the edge with the same id with the new edge
        // @ts-expect-error Define type later, red lines annoying

        setEdges((eds) =>
            eds.map((edge) => (edge.id === params.id ? params : edge))
        );
    };

    // Delete selected node
    const deleteElement = () => {
        if (selectedNode) {
            deleteElements({
                nodes: [selectedNode],
            });
        }
        if (selectedEdge) {
            deleteElements({
                edges: [selectedEdge],
            });
        }
        return;
    };
    return { addNode, deleteElement, connectEdge, updateEdge };
};

export default useEditor;
