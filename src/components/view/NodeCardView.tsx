import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFlowStore } from "@/store/flowStore";

const NodeCardView = () => {
    const { selectedNode } = useFlowStore();

    return (
        <Card className="flex flex-col shadow-xl bg-white items-center gap-4 absolute right-10 px-4 py-4 top-1/2 -translate-y-1/2 max-w-[300px] max-h-[500px] ">
            <img
                src={selectedNode?.data.imageSrc}
                className="aspect-square w-[150px]"
            />
            <div className="font-semibold">{selectedNode?.data.title}</div>
            <Separator />

            <div className="overflow-auto">
                <div className="font-semibold text-lg">Recap</div>
                {selectedNode?.data.content}
            </div>
        </Card>
    );
};

export default NodeCardView;
