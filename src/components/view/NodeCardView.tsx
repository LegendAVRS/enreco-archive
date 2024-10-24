import { Separator } from "@/components/ui/separator";
import ViewCard from "@/components/view/ViewCard";
import { useFlowStore } from "@/store/flowStore";
import Markdown from "react-markdown";

const NodeCardView = () => {
    const { selectedNode } = useFlowStore();

    return (
        <ViewCard className="flex flex-col items-center">
            <img
                src={selectedNode?.data.imageSrc}
                className="aspect-square w-[150px]"
            />
            <div className="font-semibold">{selectedNode?.data.title}</div>
            <Separator />
            <div className="flex flex-row justify-around w-full">
                <div className="flex flex-col">
                    <div className="font-semibold">Team</div>
                    <div>{selectedNode?.data.team}</div>
                </div>
                <div className="flex flex-col">
                    <div className="font-semibold">Status</div>
                    <div>{selectedNode?.data.status}</div>
                </div>
            </div>
            <Separator />
            <div className="overflow-auto max-h-[10%]">
                {/* <div className="font-semibold text-lg">Recap</div> */}
                {/* {selectedNode?.data.content} */}
                <Markdown>{selectedNode?.data.content}</Markdown>
            </div>
        </ViewCard>
    );
};

export default NodeCardView;
