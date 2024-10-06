import { ImageNodeType } from "@/lib/type";
import { useReactFlow } from "@xyflow/react";

const useEditor = (
    nodes: ImageNodeType[],
    setNodes: React.Dispatch<React.SetStateAction<ImageNodeType[]>>
) => {
    // Add a new image node at the the given position
    const { screenToFlowPosition } = useReactFlow();
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

    // Delete selected node
    const deleteElement = () => {
        return;
    };
    return { addNode, deleteElement };
};

export default useEditor;
