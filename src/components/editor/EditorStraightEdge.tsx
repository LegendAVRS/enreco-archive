import useEdgeStyle from "@/hooks/useEdgeStyle";
import { CustomEdgeProps } from "@/lib/type";
import { useEditorStore } from "@/store/editorStore";
import { BaseEdge, getStraightPath } from "@xyflow/react";
import { useEffect } from "react";

const EditorStraightEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
}: CustomEdgeProps) => {
    const { edgeStyle } = useEdgeStyle(data?.relationship);
    const { setEdgePaths, edgePaths } = useEditorStore();
    let [path] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });
    const strokeColor = edgeStyle?.stroke || "#000";
    useEffect(() => {
        setEdgePaths({ ...edgePaths, [id]: path });
    }, [path]);
    if (data?.path) {
        path = data?.path;
    }
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
                path={path}
                style={{ strokeWidth: 4, ...edgeStyle }}
                className="z-10"
                // markerEnd={data?.marker ? `url(#arrow-${id})` : ""}
            />
        </>
    );
};

export default EditorStraightEdge;
