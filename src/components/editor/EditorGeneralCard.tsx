import EditorCard from "@/components/editor/EditorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChartData } from "@/lib/type";
import { useChartStore } from "@/store/chartStore";
import { useEditorStore } from "@/store/editorStore";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
const EditorGeneralCard = () => {
    const { showHandles, setShowHandles } = useEditorStore();
    const { data, setData } = useChartStore();
    const [localRecap, setLocalRecap] = useState("");
    const [chapter, setChapter] = useState("");
    const [day, setDay] = useState("");

    useEffect(() => {
        setLocalRecap(data.dayRecap || "");
        setChapter(data.chapter || "");
        setDay(data.day || "");
    }, [data.dayRecap, data.chapter, data.day]);

    const handleSave = () => {
        // Save the description
        const newData: ChartData = {
            ...data,
            dayRecap: localRecap,
            chapter,
            day,
        };

        setData(newData);
    };

    return (
        <EditorCard>
            <h1 className="text-2xl font-bold">General Settings</h1>
            <div className="flex flex-col items-center mt-4">
                <div className="flex flex-rowitems-center w-full gap-4">
                    <Label htmlFor="handles">Show handles</Label>
                    <Checkbox
                        id="handles"
                        checked={showHandles}
                        onCheckedChange={() => setShowHandles(!showHandles)}
                    />
                </div>
            </div>
            <Select value={chapter} onValueChange={setChapter}>
                <SelectTrigger className="grow">
                    <SelectValue
                        placeholder={
                            chapter ? `Chapter ${chapter}` : "Chapter..."
                        }
                    />
                </SelectTrigger>
                {/* 4 chapters */}
                <SelectContent>
                    {Array.from({ length: 4 }, (_, i) => (
                        <SelectItem key={i} value={`${i + 1}`}>{`Chapter ${
                            i + 1
                        }`}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={day} onValueChange={setDay}>
                <SelectTrigger className="grow">
                    <SelectValue placeholder={day ? `Day ${day}` : "Day..."} />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({ length: 7 }, (_, i) => (
                        <SelectItem key={i} value={`${i + 1}`}>{`Day ${
                            i + 1
                        }`}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div>Day Recap</div>
            <MDEditor
                value={localRecap}
                onChange={(e) => setLocalRecap(e?.valueOf() || "")}
                preview="edit"
            />
            <Button onClick={handleSave}>Save</Button>
        </EditorCard>
    );
};

export default EditorGeneralCard;
