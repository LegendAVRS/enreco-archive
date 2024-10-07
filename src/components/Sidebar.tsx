import useFlowState from "@/hooks/useFlowState";
import { Card, CardContent } from "./ui/card";

export default function Sidebar() {
    const { selectedEdge, selectedNode } = useFlowState();

    return (
        <Card className="absolute right-5 top-1/2 -translate-y-1/2">
            <CardContent>
                <h2>Selected elements</h2>
                {selectedNode && <p>Nodes: {selectedNode.id}</p>}
                {selectedEdge && <p>Edges: {selectedEdge.id}</p>}
            </CardContent>
        </Card>
    );
}
