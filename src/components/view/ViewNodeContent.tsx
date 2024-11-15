import { Separator } from "@/components/ui/separator";
import NodeCardDeco from "@/components/view/NodeCardDeco";
import { ChartData, ImageNodeType } from "@/lib/type";
import { getLighterOrDarkerColor } from "@/lib/utils";
import { useChartStore } from "@/store/chartStore";
import { extractColors } from "extract-colors";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ViewNodeContentProps {
    selectedNode: ImageNodeType | null;
    data: ChartData;
}

const ViewNodeContent = ({ selectedNode }: ViewNodeContentProps) => {
    const characterImageRef = useRef<HTMLImageElement>(null);
    const [color, setColor] = useState<string | null>(null);
    const { data: chartData } = useChartStore();

    // Extract the dominant color from the character image and set it as the background color
    // (Might not do this cause it's a bit slow)
    useEffect(() => {
        if (characterImageRef.current) {
            extractColors(characterImageRef.current).then((colors) => {
                const dominantColor = colors.reduce((prev, current) =>
                    prev.area > current.area ? prev : current
                );
                setColor(getLighterOrDarkerColor(dominantColor.hex, 50));
            });
        }
    }, [selectedNode]);

    return (
        <>
            <img
                src={
                    selectedNode?.data.team &&
                    chartData.teams[selectedNode.data.team].imageSrc
                }
                className="aspect-square w-[50px] top-5 left-5 z-10 absolute"
            />

            <img
                src={selectedNode?.data.imageSrc}
                className="aspect-square w-[150px] z-10"
                ref={characterImageRef}
            />

            <NodeCardDeco color={color} />

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
            <div className="overflow-auto">
                <Markdown rehypePlugins={[rehypeRaw]}>
                    {/* {selectedNode?.data.content} */}
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Deleniti inventore fugiat necessitatibus repudiandae
                    reprehenderit. Quos libero porro cum odit aperiam similique,
                    neque illo cupiditate ea aliquid aut voluptatibus debitis.
                    Quos! Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit. Deleniti inventore fugiat necessitatibus repudiandae
                    reprehenderit. Quos libero porro cum odit aperiam similique,
                    neque illo cupiditate ea aliquid aut voluptatibus debitis.
                    Quos! Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit. Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit. Deleniti inventore fugiat necessitatibus repudiandae
                    reprehenderit. Quos libero porro cum odit aperiam similique,
                    neque illo cupiditate ea aliquid aut voluptatibus debitis.
                    Quos! Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit. Deleniti inventore fugiat necessitatibus repudiandae
                    reprehenderit. Quos libero porro cum odit aperiam similique,
                    neque illo cupiditate ea aliquid aut voluptatibus debitis.
                    Quos! Lorem ipsum dolor sit amet, consectetur adipisicing
                    elit.
                </Markdown>
            </div>
        </>
    );
};

export default ViewNodeContent;
