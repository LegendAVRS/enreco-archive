import { Separator } from "@/components/ui/separator";
import NodeCardDeco from "@/components/view/NodeCardDeco";
import { SCROLL_THRESHOLD } from "@/lib/constants";
import { ChartData, ImageNodeType } from "@/lib/type";
import { cn, getLighterOrDarkerColor } from "@/lib/utils";
import { extractColors } from "extract-colors";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { EdgeLinkClickHandler, NodeLinkClickHandler, ViewMarkdown } from "./ViewMarkdown";

interface ViewNodeContentProps {
    selectedNode: ImageNodeType | null;
    data: ChartData;
    onNodeLinkClicked: NodeLinkClickHandler;
    onEdgeLinkClicked: EdgeLinkClickHandler;
}

const ViewNodeContent = ({ selectedNode, onNodeLinkClicked, onEdgeLinkClicked }: ViewNodeContentProps) => {
    const [color, setColor] = useState<string | null>(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true); // Track header visibility

    const characterImageRef = useRef<HTMLImageElement>(null);
    const contentRef = useRef<HTMLDivElement>(null); // Ref for the scrollable container

    // Extract the dominant color from the character image and set it as the background color
    useEffect(() => {
        const extractAndSetColor = async () => {
            if (characterImageRef.current) {
                const extractedColors = await extractColors(characterImageRef.current);
                const dominantColor = extractedColors.reduce(
                    (prev, current) => prev.area > current.area ? prev : current
                );
                setColor(getLighterOrDarkerColor(dominantColor.hex, 50));
            }
        };

        extractAndSetColor();
    }, [selectedNode]);

    // Handle scroll event to toggle header visibility
    const handleScroll = () => {
        if (contentRef.current) {
            const threshold =
                contentRef.current.scrollHeight * SCROLL_THRESHOLD; // 5% of scrollable height
            setIsHeaderVisible(contentRef.current.scrollTop <= threshold);
        }
    };

    if(!selectedNode) {
        return;
    }

    return (
        <div className="h-full flex flex-col w-full">
            {/* Header */}
            <div
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

                <div className="font-semibold text-center">
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
                <ViewMarkdown onEdgeLinkClicked={onEdgeLinkClicked} onNodeLinkClicked={onNodeLinkClicked} >
                    {selectedNode?.data.content || "No content available"}
                </ViewMarkdown>
            </div>
        </div>
    );
};

export default ViewNodeContent;
