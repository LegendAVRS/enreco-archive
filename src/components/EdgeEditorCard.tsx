import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
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
import { useReactFlow } from "@xyflow/react";

const EdgeEditorCard = () => {
    const { selectedEdge } = useFlowState();
    const { relationships } = useChartContext();
    const { updateEdge, nodes } = useEditor();

    const handleUpdate = (value: string) => {
        if (!selectedEdge) {
            return;
        }
        if (!selectedEdge.data) {
            return;
        }
        selectedEdge.data.relationship = value;
        updateEdge(selectedEdge);
    };

    return (
        <Card className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <CardHeader>
                <img src="" />
            </CardHeader>
            <CardContent className="">
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
            <CardFooter className="flex flex-row gap-4">
                <Button>Save</Button>
                <Button>Delete</Button>
            </CardFooter>
        </Card>
    );
};

export default EdgeEditorCard;
