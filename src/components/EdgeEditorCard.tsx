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
import { useChartStore } from "@/store/chartStore";
import useEditor from "@/hooks/useEditor";
import { useState } from "react";
import { useFlowStore } from "@/store/flowStore";

const EdgeEditorCard = () => {
    const { selectedEdge } = useFlowStore();
    const { relationships } = useChartStore();
    const { updateEdge, deleteEdge } = useEditor();

    const [localRelationship, setLocalRelationship] = useState(
        selectedEdge?.data?.relationship
    );
    console.log(selectedEdge);

    const handleSave = () => {
        if (!selectedEdge) {
            return;
        }
        if (!selectedEdge.data) {
            return;
        }
        const newEdge = { ...selectedEdge };
        // @ts-expect-error shut up ts
        newEdge.data.relationship = localRelationship;
        updateEdge(newEdge);
    };

    return (
        <Card className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <CardHeader>
                <h2 className="text-lg font-bold">Edge Editor</h2>
            </CardHeader>
            <CardContent className="">
                <div>
                    <Select
                        value={localRelationship}
                        onValueChange={setLocalRelationship}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={localRelationship} />
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
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={deleteEdge}>Delete</Button>
            </CardFooter>
        </Card>
    );
};

export default EdgeEditorCard;
