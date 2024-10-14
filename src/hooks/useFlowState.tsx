import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import { useOnSelectionChange } from "@xyflow/react";
import { useCallback, useState } from "react";

const useFlowState = () => {
    const [selectedNode, setSelectedNode] = useState<ImageNodeType>();
    const [selectedEdge, setSelectedEdge] = useState<CustomEdgeType>();

    // @ts-expect-error Define type later, red lines annoying
    const onChange = useCallback(({ nodes, edges }) => {
        if (nodes.length === 0 && edges.length === 0) {
            return;
        }
        setSelectedNode(nodes[0]);
        setSelectedEdge(edges[0]);
    }, []);

    useOnSelectionChange({
        onChange,
    });

    return { selectedNode, selectedEdge };
};

export default useFlowState;
