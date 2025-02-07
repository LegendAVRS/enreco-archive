import { Separator } from "@/components/ui/separator";
import NodeCardDeco from "@/components/view/NodeCardDeco";
import { ImageNodeType, Team } from "@/lib/type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
    EdgeLinkClickHandler,
    NodeLinkClickHandler,
    ViewMarkdown,
} from "./ViewMarkdown";
import { isMobile } from "react-device-detect";

interface ViewNodeContentProps {
    selectedNode: ImageNodeType;
    team: Team;
    onNodeLinkClicked: NodeLinkClickHandler;
    onEdgeLinkClicked: EdgeLinkClickHandler;
}

const ViewNodeContent = ({
    selectedNode,
    team,
    onNodeLinkClicked,
    onEdgeLinkClicked,
}: ViewNodeContentProps) => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    const characterImageRef = useRef<HTMLImageElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Handle scroll event to toggle header visibility
    const handleScroll = () => {
        if (contentRef.current && cardRef.current) {
            if (
                cardRef.current.clientHeight >
                    contentRef.current.scrollHeight ||
                isMobile
            ) {
                return;
            }
            setIsHeaderVisible(contentRef.current.scrollTop === 0);
        }
    };

    // Reset scroll position when selectedNode changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
            console.log("hll");
        }
        setIsHeaderVisible(true);
    }, [selectedNode]);

    if (!selectedNode) {
        return;
    }

    return (
        <div className="h-full flex flex-col w-full" ref={cardRef}>
            {/* Header */}
            <div
                className={cn(
                    "flex flex-col items-center transition-all duration-300 ",
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

                <NodeCardDeco color={selectedNode.data.bgCardColor} />

                <div className="font-semibold text-center text-lg my-1">
                    {selectedNode?.data.title}
                </div>
                <Separator />
                <div className="flex flex-row justify-around w-full">
                    <div className="flex flex-col items-center">
                        <div className="font-semibold">Team</div>
                        <div>{team?.name}</div>
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
                ref={contentRef}
                className="overflow-auto mt-2"
                onScroll={handleScroll}
            >
                <ViewMarkdown
                    onEdgeLinkClicked={onEdgeLinkClicked}
                    onNodeLinkClicked={onNodeLinkClicked}
                >
                    {selectedNode?.data.content || "No content available"}
                </ViewMarkdown>
            </div>
        </div>
    );
};

export default ViewNodeContent;
