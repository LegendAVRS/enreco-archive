import { Separator } from "@/components/ui/separator";
import ViewCard from "@/components/view/ViewCard";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import Markdown from "react-markdown";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeRaw from "rehype-raw";

const NodeCardView = () => {
    const { selectedNode } = useFlowStore();
    const { data } = useChartStore();

    return (
        <ViewCard className="flex flex-col items-center">
            <div className="absolute top-0 bg-green-300 w-full h-[100px] -z-10"></div>
            <div className="absolute top-[110px] bg-green-300 w-full h-[5px] -z-10"></div>

            <img
                src={data.teams[selectedNode?.data.team]}
                className="absolute top-2 right-2 z-10"
            />

            <img
                src={selectedNode?.data.imageSrc}
                className="aspect-square w-[150px]"
            />
            <div className="font-semibold">{selectedNode?.data.title}</div>
            <Separator />
            <div className="flex flex-row justify-around w-full">
                <div className="flex flex-col items-center">
                    <div className="font-semibold">Team</div>
                    <div>{selectedNode?.data.team}</div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-semibold">Status</div>
                    <div>Alive</div>
                </div>
            </div>
            <Separator />
            <div className="overflow-auto max-h-[10%]">
                {/* <div className="font-semibold text-lg">Recap</div> */}
                {/* {selectedNode?.data.content} */}
                {/* <MarkdownPreview
                    source={selectedNode?.data.content}
                ></MarkdownPreview> */}
                <Markdown rehypePlugins={[rehypeRaw]}>
                    {selectedNode?.data.content}
                </Markdown>
            </div>
        </ViewCard>
    );
};

export default NodeCardView;
