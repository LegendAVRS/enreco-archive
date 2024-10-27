import EditorCard from "@/components/editor/EditorCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/store/editorStore";
const EditorGeneralCard = () => {
    const { showHandles, setShowHandles } = useEditorStore();
    return (
        <EditorCard>
            <h1 className="text-2xl font-bold">General Settings</h1>
            <div className="flex flex-col items-center mt-4">
                <div className="flex flex-row justify-between items-center w-full">
                    <Label htmlFor="handles">Show handles</Label>
                    <Checkbox
                        id="handles"
                        checked={showHandles}
                        onCheckedChange={() => setShowHandles(!showHandles)}
                    />
                </div>
            </div>
        </EditorCard>
    );
};

export default EditorGeneralCard;
