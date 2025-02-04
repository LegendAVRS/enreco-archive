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
import { CustomEdgeType, RelationshipMap } from "@/lib/type";

import { produce, WritableDraft } from "immer";
import { LucideX } from "lucide-react";
import { useState } from "react";

interface EditorEdgeCard {
    isVisible: boolean;
    selectedEdge: CustomEdgeType;
    relationships: RelationshipMap;
    updateEdge: (oldEdge: CustomEdgeType, newEdge: CustomEdgeType) => void;
    deleteEdge: () => void;
    onCardClose: () => void;
}

const EdgeEditorCard = ({ 
    isVisible,
    selectedEdge, 
    relationships, 
    updateEdge, 
    deleteEdge, 
    onCardClose 
}: EditorEdgeCard) => {
    const [workingEdge, setWorkingEdge] = useState(selectedEdge);
    const [streamPreviewLink, setStreamPreviewLink] = useState(selectedEdge.data?.timestampUrl);

    const handleSave = () => {
        updateEdge(selectedEdge, workingEdge);
    };

    const setWorkingEdgeAttr = (updater: (draft: WritableDraft<CustomEdgeType>) => void) => {
        setWorkingEdge(
            produce(workingEdge, updater)
        );
    }

    const onClose = () => {
        onCardClose();
    }

    if(!isVisible) {
        return;
    }

    return (
        <EditorCard>
            <div>
                <h2 className="text-2lg font-bold">Edge Editor</h2>
            </div>

            <Button onClick={onClose} className="absolute top-2 right-2">
                <LucideX />
            </Button>

            <div className="grid grid-cols-[1fr_4fr] gap-2 w-full">
                <Label className="text-right text-lg self-center">Id</Label>
                <span className="text-md self-center">{workingEdge.id}</span>

                <Label htmlFor="edge-relationship" className="text-right text-lg self-center">Relationship</Label>
                <Select
                    value={ workingEdge.data?.relationshipId || selectedEdge.data?.relationshipId }
                    onValueChange={(value) => setWorkingEdgeAttr(draft => {draft.data!.relationshipId = value})}
                >
                    <SelectTrigger id="edge-relationship">
                        <SelectValue
                            placeholder={relationships[workingEdge.data!.relationshipId]?.name || "Select a relationship"}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(relationships).map((key) => (
                            <SelectItem key={key} value={key}>
                                { relationships[key].name }
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <Label htmlFor="edge-title" className="text-right text-lg self-center">Title</Label>
                <Input
                    id="edge-title"
                    type="text"
                    value={workingEdge.data!.title}
                    onChange={(event) => setWorkingEdgeAttr(draft => {draft.data!.title = event.target.value})}
                />

                <div className="flex flex-row gap-2 items-center col-start-2">
                    <Checkbox
                        id="marker"
                        checked={workingEdge.data?.new}
                        onCheckedChange={(checked) => 
                            checked === true ? 
                            setWorkingEdgeAttr(draft => { draft.data!.new = true }) : 
                            setWorkingEdgeAttr(draft => { draft.data!.new = false })
                        }
                    />
                    <Label htmlFor="marker" className="text-right text-lg self-center">New</Label>
                </div>

                <hr className="col-span-2 my-0.5" />
                
                <div className="flex flex-col col-span-2">
                    <Label htmlFor="edge-content" className="text-lg">Content</Label>
                    <Textarea
                        id="edge-content"
                        value={workingEdge.data!.content}
                        onChange={(event) => setWorkingEdgeAttr(draft => { draft.data!.content = event.target.value })}
                    />
                </div>
                
                <Label htmlFor="edge-stream-link" className="text-right text-lg self-center">Stream Link</Label>
                <Input
                    id="edge-stream-link"
                    value={workingEdge.data!.timestampUrl}
                    onChange={(event) => setWorkingEdgeAttr(draft => { draft.data!.timestampUrl = event.target.value })}
                    onBlur={(event) => setStreamPreviewLink(event.target.value)}
                />
                <div className="col-span-2 h-48">
                    <span className="text-lg">Stream Preview</span>
                    {streamPreviewLink && <iframe src={streamPreviewLink} />}
                </div>
            </div>
            <div className="flex flex-row gap-16">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={deleteEdge}>Delete</Button>
            </div>
        </EditorCard>
    );
};

export default EdgeEditorCard;
