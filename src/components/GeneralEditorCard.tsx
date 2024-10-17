import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/store/editorStore";
const GeneralEditorCard = () => {
    const { showHandles, setShowHandles } = useEditorStore();
    return (
        <Card className="absolute right-5 top-1/2 -translate-y-1/2 px-4 py-2">
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
        </Card>
    );
};

export default GeneralEditorCard;
