import { Separator } from "@/components/ui/separator";
import { ChartData, ImageNodeType } from "@/lib/type";
import { getLighterOrDarkerColor } from "@/lib/utils";
import { extractColors } from "extract-colors";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ViewNodeContentProps {
    selectedNode: ImageNodeType | null;
    data: ChartData;
}

const ViewNodeContent = ({ selectedNode, data }: ViewNodeContentProps) => {
    const characterImageRef = useRef<HTMLImageElement>(null);
    const [color, setColor] = useState<string | null>(null);
    useEffect(() => {
        if (characterImageRef.current) {
            extractColors(characterImageRef.current).then((colors) => {
                const dominantColor = colors.reduce((prev, current) =>
                    prev.area > current.area ? prev : current
                );
                setColor(getLighterOrDarkerColor(dominantColor.hex, 40));
            });
        }
    }, [selectedNode]);

    return (
        <>
            <div
                className="absolute top-0 w-full h-[100px] -z-10"
                style={{ backgroundColor: color || "" }}
            />
            <div
                className="absolute top-[110px]  w-full h-[5px] -z-10"
                style={{ backgroundColor: color || "" }}
            />

            {selectedNode?.data.team && (
                <img
                    src={data.teams[selectedNode?.data.team].imgSrc}
                    className="absolute top-2 right-2 z-10"
                />
            )}

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
                <Markdown rehypePlugins={[rehypeRaw]}>
                    {selectedNode?.data.content}
                </Markdown>
            </div>
        </>
    );
};

export default ViewNodeContent;
