import { ImageNodeType } from "@/lib/type";
import { Edge, useOnSelectionChange } from "@xyflow/react";
import { useCallback, useState } from "react";
import { Card, CardContent } from "./ui/card";

export default function Sidebar() {
    const [selectedNodes, setSelectedNodes] = useState<ImageNodeType>();
    const [selectedEdges, setSelectedEdges] = useState<Edge>();

    // the passed handler has to be memoized, otherwise the hook will not work correctly
    const onChange = useCallback(({ nodes, edges }) => {
        if (nodes.length === 0 && edges.length === 0) {
            return;
        }
        setSelectedNodes(nodes[0]);
        setSelectedEdges(edges[0]);
    }, []);

    useOnSelectionChange({
        onChange,
    });

    return (
        <Card className="absolute right-5 top-1/2 -translate-y-1/2">
            <CardContent>
                <h2>Selected elements</h2>
                {selectedNodes && <p>Nodes: {selectedNodes.id}</p>}
                {selectedEdges && <p>Edges: {selectedEdges.id}</p>}
            </CardContent>
        </Card>
    );
}
