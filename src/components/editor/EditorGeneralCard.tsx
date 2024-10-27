import EditorCard from "@/components/editor/EditorCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChartData } from "@/lib/type";
import { useChartStore } from "@/store/chartStore";
import { useEditorStore } from "@/store/editorStore";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
const EditorGeneralCard = () => {
    const { showHandles, setShowHandles } = useEditorStore();
    const { data, setData } = useChartStore();
    const [localRecap, setLocalRecap] = useState("");

    useEffect(() => {
        setLocalRecap(data.dayRecap || "");
    }, [data.dayRecap]);

    const handleSave = () => {
        // Save the description
        const newData: ChartData = { ...data, dayRecap: localRecap };
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
