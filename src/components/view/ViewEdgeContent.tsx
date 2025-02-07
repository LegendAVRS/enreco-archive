import { Separator } from "@/components/ui/separator";
import EdgeCardDeco from "@/components/view/EdgeCardDeco";
import { FixedEdgeType, ImageNodeType, Relationship } from "@/lib/type";
import { getLighterOrDarkerColor, getLineSvg } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { SCROLL_THRESHOLD } from "@/lib/constants";
import {
    EdgeLinkClickHandler,
    NodeLinkClickHandler,
    ViewMarkdown,
} from "./ViewMarkdown";

interface ViewEdgeContentProps {
    selectedEdge: FixedEdgeType;
    edgeRelationship: Relationship;
    nodeA: ImageNodeType;
    nodeB: ImageNodeType;
    onNodeLinkClicked: NodeLinkClickHandler;
    onEdgeLinkClicked: EdgeLinkClickHandler;
}

const ViewEdgeContent = ({
    selectedEdge,
    edgeRelationship,
    nodeA,
    nodeB,
    onNodeLinkClicked,
    onEdgeLinkClicked,
}: ViewEdgeContentProps) => {
    const edgeStyle = edgeRelationship.style;
    const backgroundColor = getLighterOrDarkerColor(
        edgeStyle?.stroke || "",
        30,
    );

    const contentRef = useRef<HTMLDivElement>(null); // Ref for scrollable content
    const [isHeaderVisible, setIsHeaderVisible] = useState(true); // Track header visibility
    const headerRef = useRef<HTMLDivElement>(null);

    // Handle scroll event to toggle header visibility
    const handleScroll = () => {
        if (contentRef.current) {
            const threshold =
                contentRef.current.scrollHeight * SCROLL_THRESHOLD;
            setIsHeaderVisible(contentRef.current.scrollTop <= threshold);
        }
    };

    // Reset scroll position and header visibility when selectedEdge changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0; // Reset scroll position to top
        }
        setIsHeaderVisible(true); // Show header when new edge is selected
    }, [selectedEdge]);

    return (
        <div className="h-full flex flex-col w-full">
            {/* Header */}
            <div
                ref={headerRef}
                className="flex flex-col items-center transition-all duration-300 gap-2"
                style={{
                    opacity: isHeaderVisible ? 1 : 0,
                    height: isHeaderVisible ? "236px" : 0,
                    visibility: isHeaderVisible ? "visible" : "hidden",
                    transform: isHeaderVisible ? "scale(1)" : "scale(0)",
                }}
            >
                <div className="z-10 flex flex-row gap-4 items-center justify-between">
                    <img
                        className="aspect-square w-[150px] object-cover"
                        src={nodeA.data.imageSrc}
                        alt="Node A"
                    />
                    {getLineSvg(edgeStyle!, selectedEdge.data?.marker)}
                    <img
                        className="aspect-square w-[150px] object-cover"
                        src={nodeB.data.imageSrc}
                        alt="Node B"
                    />
                </div>
                <EdgeCardDeco color={backgroundColor} />

                {selectedEdge.data?.title && (
                    <span className="font-semibold text-lg">
                        {selectedEdge.data.title}
                    </span>
                )}
                <Separator />

                <div className="flex flex-col items-center">
                    <span className="">
                        Relationship:{" "}
                        <span className="underline underline-offset-2">
                            {edgeRelationship.name}
                        </span>
                    </span>
                </div>
                <Separator />
            </div>

            {/* Content */}
            <div
                ref={contentRef} // Add ref to the scrollable container
                className="overflow-auto mt-2"
                onScroll={handleScroll} // Track scroll position
            >
                <ViewMarkdown
                    onEdgeLinkClicked={onEdgeLinkClicked}
                    onNodeLinkClicked={onNodeLinkClicked}
                >
                    {selectedEdge.data?.content || "No content available"}
                </ViewMarkdown>
            </div>
        </div>
    );
};

export default ViewEdgeContent;
