import { Separator } from "@/components/ui/separator";
import ViewCard from "@/components/view/ViewCard";
import { getLighterOrDarkerColor } from "@/lib/utils";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { extractColors } from "extract-colors";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const ViewNodeCard = () => {
    const { selectedNode } = useFlowStore();
    const { data } = useChartStore();

    const characterImageRef = useRef<HTMLImageElement>(null);
    const [color, setColor] = useState<string | null>(null);
    useEffect(() => {
        if (!characterImageRef.current) return;
        extractColors(characterImageRef.current).then((colors) => {
            const dominantColor = colors.reduce((prev, current) =>
                prev.area > current.area ? prev : current
            );
            setColor(getLighterOrDarkerColor(dominantColor.hex, 40));
        });
    }, [selectedNode]);

    return (
        <ViewCard className="flex flex-col items-center">
            <div
                className="absolute top-0 w-full h-[100px] -z-10"
                style={{ backgroundColor: color || "" }}
            />
            <div
                className="absolute top-[110px]  w-full h-[5px] -z-10"
                style={{ backgroundColor: color || "" }}
            />

            <img
                src={data.teams[selectedNode?.data.team]}
                className="absolute top-2 right-2 z-10"
            />

            <img
                src={selectedNode?.data.imageSrc}
                className="aspect-square w-[150px]"
                ref={characterImageRef}
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

export default ViewNodeCard;
