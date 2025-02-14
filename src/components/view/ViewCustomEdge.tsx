import { generatePath } from "@/lib/get-edge-svg-path";
import { FixedEdgeProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { memo, useEffect, useMemo, useRef } from "react";

const ViewCustomEdge = ({
    data,
    style,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
}: FixedEdgeProps) => {
    const isNewlyAdded = data?.isNewlyAdded || false;

    const pathRef = useRef<SVGPathElement>(null);

    const path = useMemo(
        () =>
            generatePath(
                data?.pathType,
                data?.offsets,
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
            ),
        [
            data?.offsets,
            data?.pathType,
            sourcePosition,
            sourceX,
            sourceY,
            targetPosition,
            targetX,
            targetY,
        ],
    );

    useEffect(() => {
        if (isNewlyAdded && pathRef.current) {
            const length = pathRef.current.getTotalLength();
            pathRef.current.style.strokeDasharray = `${length}`;
            pathRef.current.style.strokeDashoffset = `${length}`;
            pathRef.current.style.animation =
                "drawLine 1s ease-in-out forwards";
        } else {
            if (pathRef.current) {
                pathRef.current.style.strokeDasharray = "none";
                pathRef.current.style.strokeDashoffset = "none";
                pathRef.current.style.animation = "none";
            }
        }
    }, [isNewlyAdded]);

    return (
        <svg
            className={cn("transition-all fill-none duration-1000", {})}
            style={style}
        >
            <path
                ref={pathRef}
                d={path}
                style={{
                    transition: "opacity 1s, stroke-width .3s, stroke 1s",
                }}
            />
        </svg>
    );
};

export default memo(ViewCustomEdge);
