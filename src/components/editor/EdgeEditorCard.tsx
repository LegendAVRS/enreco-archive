import EditorCard from "@/components/editor/EditorCard";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useEditor from "@/hooks/useEditor";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useEffect, useState } from "react";

const EdgeEditorCard = () => {
    const { selectedEdge } = useFlowStore();
    const { data } = useChartStore();
    const { updateEdge, deleteEdge } = useEditor();

    const [localRelationship, setLocalRelationship] = useState(
        selectedEdge?.data?.relationship
    );
    const [localTitle, setLocalTitle] = useState(selectedEdge?.data?.title);
    const [localContent, setLocalContent] = useState(
        selectedEdge?.data?.content
    );
    const [localStream, setLocalStream] = useState(
        selectedEdge?.data?.timestampUrl
    );

    const [marker, setMarker] = useState(selectedEdge?.data?.marker);

    // Sync local state with selectedEdge whenever selectedEdge changes
    useEffect(() => {
        if (selectedEdge) {
            setLocalRelationship(selectedEdge.data?.relationship);
            setLocalTitle(selectedEdge.data?.title);
            setLocalContent(selectedEdge.data?.content);
            setLocalStream(selectedEdge.data?.timestampUrl);
            setMarker(selectedEdge.data?.marker);
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
        newEdge.data.marker = marker;
        updateEdge(newEdge);
    };

    return (
        <EditorCard>
            <CardHeader>
                <h2 className="text-lg font-bold">Edge Editor</h2>
            </CardHeader>
            <CardContent className="flex-col flex gap-4">
                <div>
                    <Select
                        value={localRelationship}
                        onValueChange={setLocalRelationship}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={localRelationship} />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(data.relationships).map((key) => (
                                <SelectItem key={key} value={key}>
                                    {key}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedEdge?.data?.marker}
                        onValueChange={setMarker}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={marker} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="single">Single</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-4">
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
            </CardContent>
            <CardFooter className="flex flex-row gap-4">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={deleteEdge}>Delete</Button>
            </CardFooter>
        </EditorCard>
    );
};

export default EdgeEditorCard;
