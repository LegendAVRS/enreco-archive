import { Separator } from "@/components/ui/separator";
import NodeCardDeco from "@/components/view/NodeCardDeco";
import { SCROLL_THRESHOLD } from "@/lib/constants";
import { ChartData, ImageNodeType } from "@/lib/type";
import { cn, getLighterOrDarkerColor } from "@/lib/utils";
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
    const contentRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container
    const [color, setColor] = useState<string | null>(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true); // Track header visibility
    const headerRef = useRef<HTMLDivElement>(null);

    // Extract the dominant color from the character image and set it as the background color
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

    // Reset scroll position and header visibility when selectedNode changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0; // Reset scroll position to top
        }
        setIsHeaderVisible(true); // Show header when new node is selected
    }, [selectedNode]);

    // Handle scroll event to toggle header visibility
    const handleScroll = () => {
        if (contentRef.current) {
            const threshold =
                contentRef.current.scrollHeight * SCROLL_THRESHOLD; // 5% of scrollable height
            setIsHeaderVisible(contentRef.current.scrollTop <= threshold);
        }
    };

    return (
        <div className="h-full flex flex-col w-full">
            {/* Header */}
            <div
                ref={headerRef}
                className={cn(
                    "flex flex-col items-center transition-all duration-300 "
                )}
                style={{
                    opacity: isHeaderVisible ? 1 : 0,
                    height: isHeaderVisible ? "244px" : 0,
                    visibility: isHeaderVisible ? "visible" : "hidden",
                    transform: isHeaderVisible ? "scale(1)" : "scale(0)",
                }}
            >
                {selectedNode?.data.imageSrc && (
                    <Image
                        alt="character image"
                        className="aspect-square w-[150px] z-10"
                        src={selectedNode?.data.imageSrc}
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
            </div>

            {/* Content */}
            <div
                ref={contentRef} // Add ref to the scrollable container
                className="overflow-auto mt-2 pb-20"
                onScroll={handleScroll} // Track scroll position
            >
                <Markdown rehypePlugins={[rehypeRaw]}>
                    {selectedNode?.data.content}
                </Markdown>
            </div>
        </div>
    );
};

export default ViewNodeContent;
