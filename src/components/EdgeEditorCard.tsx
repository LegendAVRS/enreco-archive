import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useChartContext } from "@/context/useChartContext";
import useEditor from "@/hooks/useEditor";
import useFlowState from "@/hooks/useFlowState";
import { useEdgesState, useNodesState } from "@xyflow/react";

const EdgeEditorCard = () => {
    const { selectedEdge } = useFlowState();
    const { relationships } = useChartContext();
    const { data } = useChartContext();

    const [nodes, setNodes] = useNodesState(data.nodes);
    const [edges, setEdges] = useEdgesState(data.edges);
    const { updateEdge } = useEditor(nodes, setNodes, edges, setEdges);

    const handleUpdate = (value: string) => {
        if (!selectedEdge) {
            return;
        }
        if (!selectedEdge.data) {
            return;
        }
        const copyOfSelectedEdge = { ...selectedEdge };
        copyOfSelectedEdge.data.relationship = value;
        console.log(value);
        updateEdge(copyOfSelectedEdge, setEdges);
    };

    return (
        <Card className="absolute right-5 top-1/2 -translate-y-1/2">
            <CardContent>
                <h2>{selectedEdge && selectedEdge.id}</h2>

                <div>
                    <Select onValueChange={handleUpdate}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Relationship..." />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(relationships).map((key) => (
                                <SelectItem key={key} value={key}>
                                    {key}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};

export default EdgeEditorCard;
