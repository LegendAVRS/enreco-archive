import { Separator } from "@/components/ui/separator";
import NodeCardDeco from "@/components/view/NodeCardDeco";
import { ChartData, ImageNodeType } from "@/lib/type";
import { getLighterOrDarkerColor } from "@/lib/utils";
// import { useChartStore } from "@/store/chartStore";
import { extractColors } from "extract-colors";
import Image from "next/image";
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
    // const { data: chartData } = useChartStore();

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
            {/* <Image
                src={
                    selectedNode?.data.team &&
                    chartData.teams[selectedNode.data.team].imageSrc
                }
                className="aspect-square w-[50px] top-5 left-5 z-10 absolute"
            /> */}

            {selectedNode?.data.imageSrc && (
                <Image
                    alt="character image"
                    src={selectedNode?.data.imageSrc}
                    className="aspect-square w-[150px] z-10"
                    ref={characterImageRef}
                    width={150}
                    height={150}
                />
            )}

            <NodeCardDeco color={color} />

            <div className="font-semibold text-lg">
                {selectedNode?.data.title}
            </div>
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
                    {selectedNode?.data.content}
                </Markdown>
            </div>
        </>
    );
};

export default ViewNodeContent;
