import useEdgeStyle from "@/hooks/useEdgeStyle";
import { OLD_EDGE_OPACITY } from "@/lib/constants";
import { CustomEdgeProps, ImageNodeType } from "@/lib/type";
import { useViewStore } from "@/store/viewStore";
import { BaseEdge, useReactFlow } from "@xyflow/react";

const getVisiblityStyle = (visible: boolean) => {
    return {
        opacity: visible ? 1 : 0.2,
    };
};

const ViewCustomEdge = ({ source, target, data }: CustomEdgeProps) => {
    const { edgeStyle } = useEdgeStyle(data?.relationship);
    const { edgeVisibility, teamVisibility, characterVisibility } =
        useViewStore();
    const { getNode } = useReactFlow();

    const nodeSrc = getNode(source) as ImageNodeType;
    const nodeTarget = getNode(target) as ImageNodeType;

    let isVisible = true;
    const isNew = data?.new || !edgeVisibility.new || false;
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
            <BaseEdge
                // markerEnd={data?.marker ? `url(#arrow-${id})` : ""}
                path={data?.path || ""}
                className="transition-all "
                style={{
                    strokeWidth: 4,
                    ...edgeStyle,
                    ...edgeVisibilityStyle,
                    opacity: isNew ? 1 : OLD_EDGE_OPACITY,
                }}
            />
        </>
    );
};

export default ViewCustomEdge;
