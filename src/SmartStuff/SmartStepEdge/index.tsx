import { EdgeProps, StepEdge, useNodes } from "@xyflow/react";

import {
    pathfindingJumpPointNoDiagonal,
    svgDrawStraightLinePath,
} from "../functions";
import SmartEdge, { SmartEdgeOptions } from "../SmartEdge";

const StepConfiguration: SmartEdgeOptions = {
    drawEdge: svgDrawStraightLinePath,
    generatePath: pathfindingJumpPointNoDiagonal,
    fallback: StepEdge,
};

export default function SmartStepEdge<
    EdgeDataType = unknown,
    NodeDataType = unknown
>(props: EdgeProps<EdgeDataType>) {
    const nodes = useNodes<NodeDataType>();

    return (
        <SmartEdge<EdgeDataType, NodeDataType>
            {...props}
            options={StepConfiguration}
            nodes={nodes}
            interactionWidth={8}
        />
    );
}
