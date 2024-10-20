import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useEdgeStyle from "@/hooks/useEdgeStyle";
import { ImageNodeType } from "@/lib/type";
import { useChartStore } from "@/store/chartStore";
import { useFlowStore } from "@/store/flowStore";
import { useReactFlow } from "@xyflow/react";
import React from "react";

export const getLineSvg = (
    style: React.CSSProperties,
    markerDirection: "ltr" | "rtl" | "both" | "none"
) => {
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
                markerEnd={
                    markerDirection === "ltr" || markerDirection === "both"
                        ? "url(#markerArrow)"
                        : ""
                }
                markerStart={
                    markerDirection === "rtl" || markerDirection === "both"
                        ? "url(#markerArrow)"
                        : ""
                }
            />
        </svg>
    );
};

const EdgeCardView = () => {
    const { selectedEdge } = useFlowStore();
    const { getNode } = useReactFlow();
    const { edgeStyle } = useEdgeStyle(selectedEdge?.data?.relationship);
    if (!selectedEdge) return null;
    const nodeA: ImageNodeType = getNode(selectedEdge.source);
    const nodeB: ImageNodeType = getNode(selectedEdge.target);

    return (
        <Card className="flex flex-col shadow-xl bg-white items-center gap-4 absolute right-10 px-4 py-4 top-1/2 -translate-y-1/2 max-w-[300px] max-h-[600px]">
            <div className="flex flex-row gap-4 items-center justify-between">
                <img
                    className="aspect-square w-[100px] object-cover"
                    src={nodeA.data.imageSrc}
                />
                {getLineSvg(edgeStyle!, "ltr")}
                <img
                    className="aspect-square w-[100px] object-cover"
                    src={nodeB.data.imageSrc}
                />
            </div>
            <div className="font-semibold">{selectedEdge.data.title}</div>
            <Separator />
            <div className="overflow-y-auto">
                <div>{selectedEdge.data.content}</div>
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
        </Card>
    );
};

export default EdgeCardView;
