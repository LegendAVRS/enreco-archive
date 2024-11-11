import useEdgeStyle from "@/hooks/useEdgeStyle";
import { OLD_EDGE_OPACITY } from "@/lib/constants";
import { CustomEdgeProps, ImageNodeType } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/viewStore";
import { BaseEdge, useReactFlow } from "@xyflow/react";
import { useMemo } from "react";

const getVisibilityStyle = (visible: boolean) => ({
    opacity: visible ? 1 : 0.2,
});

const ViewCustomEdge = ({ source, target, data, id }: CustomEdgeProps) => {
    const { edgeStyle } = useEdgeStyle(data?.relationship);
    const {
        edgeVisibility,
        teamVisibility,
        characterVisibility,
        hoveredEdgeId,
    } = useViewStore();
    const { getNode } = useReactFlow();

    const nodeSrc = getNode(source) as ImageNodeType;
    const nodeTarget = getNode(target) as ImageNodeType;

    // Memoize visibility calculations for performance
    const isVisible = useMemo(() => {
        let visibility = true;
        if (data?.relationship) {
            visibility = visibility && edgeVisibility[data.relationship];
        }
        if (nodeSrc?.data.team) {
            visibility = visibility && teamVisibility[nodeSrc.data.team];
        }
        if (nodeTarget?.data.team) {
            visibility = visibility && teamVisibility[nodeTarget.data.team];
        }
        if (nodeSrc?.data.title) {
            visibility = visibility && characterVisibility[nodeSrc.data.title];
        }
        if (nodeTarget?.data.title) {
            visibility =
                visibility && characterVisibility[nodeTarget.data.title];
        }
        return visibility;
    }, [
        data?.relationship,
        edgeVisibility,
        teamVisibility,
        characterVisibility,
        nodeSrc?.data.team,
        nodeSrc?.data.title,
        nodeTarget?.data.team,
        nodeTarget?.data.title,
    ]);

    const edgeVisibilityStyle = useMemo(
        () => getVisibilityStyle(isVisible),
        [isVisible]
    );
    console.log(hoveredEdgeId);
    const isNew = data?.new || !edgeVisibility.new || false;

    return (
        <BaseEdge
            path={data?.path || ""}
            className={cn("transition-all", {})}
            style={{
                strokeWidth: id === hoveredEdgeId ? 6 : 4,
                ...edgeStyle,
                ...edgeVisibilityStyle,
                opacity: isNew ? 1 : OLD_EDGE_OPACITY,
            }}
        />
    );
};

export default ViewCustomEdge;
