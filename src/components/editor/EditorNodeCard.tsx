import EditorCard from "@/components/editor/EditorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { ImageNodeType, TeamMap } from "@/lib/type";
import { SelectTrigger } from "@radix-ui/react-select";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";

interface EditorNodeCardProps {
    teams: TeamMap;
    selectedNode: ImageNodeType | null;
    updateNode: (oldNode: ImageNodeType, newNode: ImageNodeType) => void;
    deleteNode: () => void;
}

export default function EditorNodeCard({
    teams,
    selectedNode,
    updateNode,
    deleteNode,
}: EditorNodeCardProps) {
    const [localImageSrc, setLocalImageSrc] = useState("");
    const [localTitle, setLocalTitle] = useState("");
    const [localContent, setLocalContent] = useState("");
    const [localTeam, setLocalTeam] = useState("");
    const [localStatus, setLocalStatus] = useState("");
    const [localNew, setLocalNew] = useState(true);

    useEffect(() => {
        if (selectedNode) {
            setLocalImageSrc(selectedNode.data?.imageSrc || "");
            setLocalTitle(selectedNode.data?.title || "");
            setLocalContent(selectedNode.data?.content || "");
            setLocalTeam(selectedNode.data?.teamId || "");
            setLocalStatus(selectedNode.data?.status || "Alive");
            setLocalNew(selectedNode.data?.new as boolean);
        }
    }, [selectedNode]);

    const handleSave = () => {
        if (!selectedNode) return; // Ensure selectedNode exists
        console.log(localNew);
        const newNode = {
            ...selectedNode,
            data: {
                ...selectedNode.data,
                imageSrc: localImageSrc,
                title: localTitle,
                content: localContent,
                team: localTeam,
                status: localStatus,
                new: localNew,
            },
        };
        updateNode(selectedNode, newNode);
    };

    return (
        <EditorCard>
            <h1 className="text-xl font-bold">Node editor</h1>
            <div>Id: {selectedNode?.id}</div>
            <div className="flex flex-row gap-2 items-center">
                <Checkbox
                    id="marker"
                    checked={localNew}
                    onCheckedChange={() => setLocalNew((prev) => !prev)}
                />
                <Label htmlFor="marker">New</Label>
            </div>
            <Select value={localTeam} onValueChange={setLocalTeam}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={localTeam || "Select a team"} />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(teams).map((key) => (
                        <SelectItem key={key} value={key}>
                            { teams[key].name }
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
            <Input
                placeholder="Status..."
                value={localStatus}
                onChange={(e) => setLocalStatus(e.target.value)}
            />
            <MDEditor
                value={localContent}
                onChange={(e) => setLocalContent(e || "")}
            />
            <div className="flex flex-row gap-4">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={deleteNode}>Delete</Button>
            </div>
        </EditorCard>
    );
}
