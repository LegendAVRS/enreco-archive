import { CustomEdgeProps } from "@/lib/type";
import { BaseEdge } from "@xyflow/react";

const CustomEdgeView = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
    markerEnd,
    selected,
}: CustomEdgeProps) => {
    console.log(data?.path);
    return <BaseEdge path={data?.path} />;
};

export default CustomEdgeView;
