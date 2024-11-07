import EditorCard from "@/components/editor/EditorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomEdgeType } from "@/lib/type";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useEffect, useState } from "react";

interface EditorEdgeCard {
    updateEdge: (edge: CustomEdgeType) => void;
    deleteEdge: () => void;
}

const EdgeEditorCard = ({ updateEdge, deleteEdge }: EditorEdgeCard) => {
    const { selectedEdge } = useFlowStore();
    const { data } = useChartStore();

    const [localRelationship, setLocalRelationship] = useState("");
    const [localTitle, setLocalTitle] = useState("");
    const [localContent, setLocalContent] = useState("");
    const [localStream, setLocalStream] = useState("");
    const [localNew, setLocalNew] = useState(true);

    // Sync local state with selectedEdge whenever selectedEdge changes
    useEffect(() => {
        if (selectedEdge) {
            setLocalRelationship(selectedEdge.data?.relationship || "");
            setLocalTitle(selectedEdge.data?.title || "");
            setLocalContent(selectedEdge.data?.content || "");
            setLocalStream(selectedEdge.data?.timestampUrl || "");
            setLocalNew(selectedEdge.data?.new || true);
        }
    }, [selectedEdge]);

    const handleSave = () => {
        const newEdge = { ...selectedEdge };
        if (!newEdge.data) {
            return;
        }
        newEdge.data.relationship = localRelationship;
        newEdge.data.title = localTitle;
        newEdge.data.content = localContent;
        newEdge.data.timestampUrl = localStream;
        newEdge.data.new = localNew;
        // @ts-expect-error - undefined data should be fine, i think
        updateEdge(newEdge);
    };

    return (
        <EditorCard>
            <div>
                <h2 className="text-lg font-bold">Edge Editor</h2>
            </div>
            <div className="flex-col flex gap-4">
                <Select
                    value={localRelationship}
                    onValueChange={setLocalRelationship}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue
                            placeholder={localRelationship || "Relationship..."}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(data.relationships).map((key) => (
                            <SelectItem key={key} value={key}>
                                {key}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex flex-row gap-2 items-center">
                    <Checkbox
                        id="marker"
                        checked={localNew}
                        onCheckedChange={() => setLocalNew((prev) => !prev)}
                    />
                    <Label htmlFor="marker">New</Label>
                </div>
                <Input
                    placeholder="Title..."
                    onChange={(e) => setLocalTitle(e.target.value)}
                    value={localTitle}
                />
                <Textarea
                    placeholder="Content..."
                    onChange={(e) => setLocalContent(e.target.value)}
                    value={localContent}
                />
                <Input
                    placeholder="Stream embed..."
                    onChange={(e) => setLocalStream(e.target.value)}
                    value={localStream}
                />
                <div>
                    <iframe src={localStream} />
                </div>
            </div>
            <div className="flex flex-row gap-4">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={deleteEdge}>Delete</Button>
            </div>
        </EditorCard>
    );
};

export default EdgeEditorCard;
