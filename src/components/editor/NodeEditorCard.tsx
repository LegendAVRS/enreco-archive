import EditorCard from "@/components/editor/EditorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageNodeType } from "@/lib/type";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { SelectTrigger } from "@radix-ui/react-select";
import { useEffect, useState } from "react";

interface NodeEditorCardProps {
    updateNode: (node: ImageNodeType) => void;
    deleteNode: () => void;
}

export default function NodeEditorCard({
    updateNode,
    deleteNode,
}: NodeEditorCardProps) {
    const { selectedNode } = useFlowStore();
    const { data } = useChartStore();

    const [localImageSrc, setLocalImageSrc] = useState("");
    const [localTitle, setLocalTitle] = useState("");
    const [localContent, setLocalContent] = useState("");
    const [localTeam, setLocalTeam] = useState("");

    useEffect(() => {
        if (selectedNode) {
            setLocalImageSrc(selectedNode.data?.imageSrc || "");
            setLocalTitle(selectedNode.data?.title || "");
            setLocalContent(selectedNode.data?.content || "");
            setLocalTeam(selectedNode.data?.team || "");
        }
    }, [selectedNode]);

    const handleSave = () => {
        if (!selectedNode) return; // Ensure selectedNode exists
        const newNode = {
            ...selectedNode,
            data: {
                ...selectedNode.data,
                imageSrc: localImageSrc,
                title: localTitle,
                content: localContent,
                team: localTeam,
            },
        };
        updateNode(newNode);
    };

    return (
        <EditorCard>
            <h1 className="text-xl font-bold">Node editor</h1>
            <div>Id: {selectedNode?.id}</div>
            <Select value={localTeam} onValueChange={setLocalTeam}>
                <SelectTrigger>
                    <SelectValue placeholder={localTeam || "Select a team"} />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(data).map((key) => (
                        <SelectItem key={key} value={key}>
                            {key}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                placeholder="Image URL..."
                value={localImageSrc}
                onChange={(e) => setLocalImageSrc(e.target.value)}
            />
            <Input
                placeholder="Title..."
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
            />
            <Textarea
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                placeholder="Content..."
            />
            <div className="flex flex-row gap-4">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={deleteNode}>Delete</Button>
            </div>
        </EditorCard>
    );
}
