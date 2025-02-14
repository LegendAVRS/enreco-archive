import { EDGE_WIDTH, OLD_EDGE_OPACITY } from "@/lib/constants";
import { generatePath } from "@/lib/get-edge-svg-path";
import { FixedEdgeProps } from "@/lib/type";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/viewStore";
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
    const { day: currentDay } = useViewStore();
    const isCurrentDay = data?.day === currentDay || false;
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
            className={cn("transition-all fill-none duration-1000", {
                "pointer-events-none": isCurrentDay === false,
            })}
            style={style}
        >
            <path
                ref={pathRef}
                d={path}
                style={{
                    strokeWidth:
                        data?.renderIsHoveredEdge && isCurrentDay
                            ? EDGE_WIDTH + 2
                            : EDGE_WIDTH,
                    opacity: isCurrentDay ? 1 : OLD_EDGE_OPACITY,
                    transition: "stroke-width 0.15s",
                }}
            />
        </svg>
    );
};

export default memo(ViewCustomEdge);
