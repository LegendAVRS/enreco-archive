import { Card, CardContent } from "../ui/card";
import { useFlowStore } from "@/store/flowStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useEditor from "@/hooks/useEditor";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import EditorCard from "@/components/editor/EditorCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { useChartStore } from "@/store/chartStore";

export default function NodeEditorCard() {
    const { selectedNode } = useFlowStore();
    const { updateNode, deleteNode } = useEditor();
    const { data } = useChartStore();

    const [localImageSrc, setLocalImageSrc] = useState(
        selectedNode?.data?.imageSrc
    );
    const [localTitle, setLocalTitle] = useState(selectedNode?.data?.title);
    const [localContent, setLocalContent] = useState(
        selectedNode?.data?.content
    );
    const [localTeam, setLocalTeam] = useState(selectedNode?.data.team);

    useEffect(() => {
        if (selectedNode) {
            setLocalImageSrc(selectedNode?.data?.imageSrc);
            setLocalTitle(selectedNode?.data?.title);
            setLocalContent(selectedNode?.data?.content);
        }
    }, [selectedNode]);

    const handleSave = () => {
        const newNode = { ...selectedNode };
        if (!newNode.data) {
            return;
        }
        newNode.data.imageSrc = localImageSrc;
        newNode.data.title = localTitle;
        newNode.data.content = localContent;
        newNode.data.team = localTeam;
        updateNode(newNode);
    };

    return (
        <EditorCard>
            <h1 className="text-xl font-bold">Node editor</h1>
            <div>Id: {selectedNode?.id}</div>
            <Select value={localTeam} onValueChange={setLocalTeam}>
                <SelectTrigger>
                    <SelectValue placeholder={localTeam} />
                </SelectTrigger>
                {Object.keys(data).map((key) => (
                    <SelectItem key={key} value={key}>
                        {key}
                    </SelectItem>
                ))}
            </Select>
            <Input
                placeholder="Image url..."
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
