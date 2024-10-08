import useFlowState from "@/hooks/useFlowState";
import { ImageNodeType } from "@/lib/type";
import { useReactFlow, addEdge } from "@xyflow/react";

const useEditor = (
    nodes: ImageNodeType[],
    setNodes: React.Dispatch<React.SetStateAction<ImageNodeType[]>>
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
        params.type = "smoothstep";
        // @ts-expect-error Define type later, red lines annoying
        setEdges((eds) => addEdge(params, eds));
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
    return { addNode, deleteElement, connectEdge };
};

export default useEditor;
