import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ViewCard from "@/components/view/ViewCard";
import useEdgeStyle from "@/hooks/useEdgeStyle";
import { ImageNodeType } from "@/lib/type";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useReactFlow } from "@xyflow/react";
import React from "react";
import Markdown from "react-markdown";

export const getLineSvg = (style: React.CSSProperties, showMarker = false) => {
    const width = 60;
    const height = 20;
    const strokeColor = style?.stroke || "black";
    return (
        <svg width={width} height={height}>
            <defs>
                <marker
                    id={`markerArrow`}
                    viewBox="0 0 10 10"
                    refX="9" // Adjust reference point for correct positioning
                    refY="5" // Adjust to center the arrow on the line
                    markerWidth="4"
                    markerHeight="4"
                    className="stroke-[1]"
                    orient="auto-start-reverse" // Automatically orient the marker based on line direction
                >
                    <path d="M0,0 L10,5 L0,10 z" fill={strokeColor} />
                </marker>
            </defs>
            <line
                x1="0"
                y1="10"
                x2={width}
                y2="10"
                stroke={strokeColor}
                style={style}
                strokeWidth={4}
                markerEnd={showMarker ? "url(#markerArrow)" : ""}
            />
        </svg>
    );
};

const ViewEdgeCard = () => {
    const { selectedEdge } = useFlowStore();
    const { getNode } = useReactFlow();
    const { edgeStyle } = useEdgeStyle(selectedEdge?.data?.relationship);
    if (!selectedEdge) return null;

    // An edge always has a source and target node
    const nodeA: ImageNodeType = getNode(selectedEdge.source)! as ImageNodeType;
    const nodeB: ImageNodeType = getNode(selectedEdge.target)! as ImageNodeType;

    return (
        <ViewCard>
            <div className="flex flex-row gap-4 items-center justify-between">
                <img
                    className="aspect-square w-[100px] object-cover"
                    src={nodeA.data.imageSrc}
                />
                {getLineSvg(edgeStyle!, selectedEdge.data?.marker)}
                <img
                    className="aspect-square w-[100px] object-cover"
                    src={nodeB.data.imageSrc}
                />
            </div>
            <span className="font-semibold">{selectedEdge.data.title}</span>
            <Separator />

            <div className="flex flex-col items-center">
                <span className="text-sm underline underline-offset-2">
                    Relationship: {selectedEdge.data?.relationship}
                </span>
            </div>
            <Separator />
            <div className="overflow-y-auto">
                <Markdown>
                    {selectedEdge.data.content + selectedEdge.data.content}
                </Markdown>
                <figure>
                    <iframe
                        src={selectedEdge.data?.timestampUrl}
                        width={"100%"}
                    />
                    <figcaption className="text-center italic">
                        Timestamp for event
                    </figcaption>
                </figure>
            </div>
        </ViewCard>
    );
};

export default ViewEdgeCard;
