import { EDGE_WIDTH, OLD_EDGE_OPACITY } from "@/lib/constants";
import { CustomEdgeProps } from "@/lib/type";
import { BaseEdge } from "@xyflow/react";

const EditorFixedEdge = ({ data, style }: CustomEdgeProps) => {
    const isNew = data?.new || false;

    return (
        <>
            <BaseEdge
                path={data?.path || ""}
                className="transition-all "
                style={{
                    strokeWidth: EDGE_WIDTH,
                    ...style,
                    opacity: isNew ? 1 : OLD_EDGE_OPACITY,
                }}
            />
        </>
    );
};

export default EditorFixedEdge;
