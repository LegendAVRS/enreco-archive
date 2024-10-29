import useEdgeStyle from "@/hooks/useEdgeStyle";
import { CustomEdgeProps, ImageNodeType } from "@/lib/type";
import { useViewStore } from "@/store/viewStore";
import { BaseEdge, useReactFlow } from "@xyflow/react";

const getVisiblityStyle = (visible: boolean) => {
    return {
        opacity: visible ? 1 : 0.2,
    };
};

const ViewCustomEdge = ({ id, source, target, data }: CustomEdgeProps) => {
    const { edgeStyle } = useEdgeStyle(data?.relationship);
    const { edgeVisibility, teamVisibility, characterVisibility } =
        useViewStore();
    const strokeColor = edgeStyle?.stroke || "black";
    const { getNode } = useReactFlow();

    const nodeSrc = getNode(source) as ImageNodeType;
    const nodeTarget = getNode(target) as ImageNodeType;

    let isVisible = true;
    if (data?.relationship) {
        isVisible = isVisible && edgeVisibility[data?.relationship];
    }
    if (nodeSrc?.data.team) {
        isVisible = isVisible && teamVisibility[nodeSrc?.data.team];
    }
    if (nodeTarget.data.team) {
        isVisible = isVisible && teamVisibility[nodeTarget.data.team];
    }
    if (nodeSrc.data.title) {
        isVisible = isVisible && characterVisibility[nodeSrc.data.title];
    }
    if (nodeTarget.data.title) {
        isVisible = isVisible && characterVisibility[nodeTarget.data.title];
    }

    const edgeVisibilityStyle = getVisiblityStyle(isVisible);
    return (
        <>
            <svg width="0" height="0">
                <defs>
                    <marker
                        id={`arrow-${id}`}
                        viewBox="0 0 10 10"
                        refX="10" // Adjust reference point for correct positioning
                        refY="5" // Adjust to center the arrow on the line
                        markerWidth="4"
                        markerHeight="4"
                        className="stroke-[1]"
                        orient="auto-start-reverse" // Automatically orient the marker based on line direction
                    >
                        <path d="M0,0 L10,5 L0,10 z" fill={strokeColor} />
                    </marker>
                </defs>
            </svg>
            <BaseEdge
                markerEnd={data?.marker ? `url(#arrow-${id})` : ""}
                path={data?.path || ""}
                className="transition-all "
                style={{ strokeWidth: 4, ...edgeStyle, ...edgeVisibilityStyle }}
            />
        </>
    );
};

export default ViewCustomEdge;
