import { BaseEdge, EdgeLabelRenderer, useReactFlow } from "@xyflow/react";
import { useEffect, useRef } from "react";

import { CustomEdgeProps, CustomEdgeType, EditorImageNodeType } from "@/lib/type";
import { EDGE_WIDTH, OLD_EDGE_OPACITY } from "@/lib/constants";

//copied from reactflow lib - probably you can import this util directly from
function getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
}: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
}) {
    const xOffset = Math.abs(targetX - sourceX) / 2;
    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

    return { centerX, centerY, xOffset, yOffset };
}

// Function that generates the SVG path given start/end coords of the edges and all the offsets.
function generateOrthogonalEdgePath(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    padding: number,
    HCoffset = 0,
    VRoffset = 0,
    VLoffset = 0,
    HLoffset = 0,
    HRoffset = 0,
) {
    // Calculate horizontal and vertical distances
    const dy = endY - startY;

    // Calculate the position for the horizontal line
    const horizontalY = startY + dy / 2 - HCoffset;

    // Calculate the position for the vertical line
    const verticalX = endX - padding + VRoffset ;
    const verticalXT = startX - padding + VLoffset;

    // Create a path string, draw the line all at once from left to right.
    // Do it like this to get a nice smooth line.
    let path = `M${startX},${startY} `;

    // Part of the line that gets drawn if HL and its line segment exists.
    if (VLoffset !== 0) {
        path += `V${startY + HLoffset} `
        path += `H${verticalXT} `;
    }

    // Main part of the line
    path += `V${horizontalY} `;
    path += `H${verticalX} `;
    path += `V${endY + HRoffset} `;

    // Part of the line that gets drawn if HR and its line segment exists.
    if (VRoffset !== 0) {
        path += `H${endX} `;
        path += `V${endY} `;
    }

    return path.trim();
}

function drag(
    element: HTMLElement,
    allowHorizontalDragging: boolean,
    allowVerticalDragging: boolean,
    onDrag: (dx: number, dy: number) => void
) {
    const prevClient = { x: 0, y: 0 };

    function dragMouseDown(event: MouseEvent) {
        event.preventDefault();
        prevClient.x = event.clientX;
        prevClient.y = event.clientY;
        document.addEventListener("mousemove", dragMouseMove);
        document.addEventListener("mouseup", dragMouseUp);
    }

    function dragMouseMove(event: MouseEvent) {
        event.preventDefault();

        const newX = event.clientX;
        const newY = event.clientY;
        let dx = 0, dy = 0;

        if(allowHorizontalDragging) {
            dx = prevClient.x - newX;
        }

        if(allowVerticalDragging) {
            dy = prevClient.y - newY;
        }

        prevClient.x = newX;
        prevClient.y = newY;

        onDrag(dx, dy);
    }

    function dragMouseUp(event: MouseEvent) {
        event.preventDefault();
        document.removeEventListener("mousemove", dragMouseMove);
        document.removeEventListener("mouseup", dragMouseUp);
    }

    element.addEventListener("mousedown", dragMouseDown);

    return () => element.removeEventListener("mousedown", dragMouseDown);
}

interface DragPointProps {
    isSelected: boolean | undefined;
    direction: "horizontal" | "vertical";
    x: number;
    y: number;
    onDrag: (newXPos: number, newYPos: number) => void;
}

const DRAG_POINT_WIDTH = 10;
const DRAG_POINT_HEIGHT = 10;
function DragPoint({
    isSelected = false,
    direction,
    x,
    y,
    onDrag,
}: DragPointProps) {
    const pointRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(pointRef.current) {
            return drag(pointRef.current, 
                direction === "vertical", 
                direction === "horizontal",
                onDrag
            );
        }
    }, [direction, onDrag])

    return (
        <div
            ref={pointRef}
            className="custom_point nodrag nopan"
            style={{
                position: "absolute",
                left: `${x - DRAG_POINT_WIDTH / 2}px`,
                top: `${y - DRAG_POINT_HEIGHT / 2}px`,
                opacity: isSelected ? 1 : 0.3,
                width: `${DRAG_POINT_WIDTH}px`,
                height: `${DRAG_POINT_HEIGHT}px`,
                pointerEvents: "all",
                borderRadius: "50%",
                background: "black",
                cursor: direction === "horizontal" ? "row-resize" : "col-resize",
            }}
        />
    );
}

/*
Anatomy of a custom edge
    
    |                              | 
    |--[HL]--|            |--[HR]--|
            [VL]        [VR]
              |---[HC]---|

[HL]/[HC]/[HR] are points that can adjust the Y position of the horizontal line segments.
[VL]/[VR] are points that can adjust the X position of the vertical line segments. Moving these points will cause
[HL]/[HR] and their line segments to spawn as well.

[HL]/[HR] only appear if [VL]/[VR] have been moved to spawn the other horizontal edges.
*/
const EditorCustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
    selected
}: CustomEdgeProps) => {
    const edgeStyle = data?.renderEdgeStyle || {};
    const { centerX, centerY, yOffset } = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });
    
    const { getZoom, setEdges, updateEdgeData } = useReactFlow<EditorImageNodeType, CustomEdgeType>();

    const zoom = getZoom();

    function onDraggedCommon() {
        setEdges((prev) => {
            return prev.map((edge) =>
                edge.id === id
                    ? { ...edge, selected: true }
                    : { ...edge, selected: false }
            );
        });
    }

    function onHLDragged(offset: number) {
        onDraggedCommon();

        updateEdgeData(id, (prevEdge) => {
            return {
                customEdgeHLOffset: 
                    prevEdge.data?.customEdgeHLOffset === undefined ? 
                        0 + offset : 
                        prevEdge.data?.customEdgeHLOffset + offset
            };
        });
    }

    function onVLDragged(offset: number) {
        onDraggedCommon();

        updateEdgeData(id, (prevEdge) => {
            return {
                customEdgeVLOffset: 
                    prevEdge.data?.customEdgeVLOffset === undefined ? 
                        0 + offset : 
                        prevEdge.data?.customEdgeVLOffset + offset
            };
        });
    }

    function onHCDragged(offset: number) {
        onDraggedCommon();
        
        updateEdgeData(id, (prevEdge) => {
            return {
                customEdgeHCOffset: 
                    prevEdge.data?.customEdgeHCOffset === undefined ? 
                        0 + offset : 
                        prevEdge.data?.customEdgeHCOffset + offset
            };
        });
    }

    function onVRDragged(offset: number) {
        onDraggedCommon();
    
        updateEdgeData(id, (prevEdge) => {
            return {
                customEdgeVROffset: 
                    prevEdge.data?.customEdgeVROffset === undefined ? 
                        0 + offset : 
                        prevEdge.data?.customEdgeVROffset + offset
            };
        });
    }

    function onHRDragged(offset: number) {
        onDraggedCommon();

        updateEdgeData(id, (prevEdge) => {
            return {
                customEdgeHROffset: 
                    prevEdge.data?.customEdgeHROffset === undefined ? 
                        0 + offset : 
                        prevEdge.data?.customEdgeHROffset + offset
            };
        });
    }

    const hlOffset = data?.customEdgeHLOffset !== undefined ? data.customEdgeHLOffset : 0;
    const vlOffset = data?.customEdgeVLOffset !== undefined ? data.customEdgeVLOffset : 0;
    const hcOffset = data?.customEdgeHCOffset !== undefined ? data.customEdgeHCOffset : 0;
    const vrOffset = data?.customEdgeVROffset !== undefined ? data.customEdgeVROffset : 0;
    const hrOffset = data?.customEdgeHROffset !== undefined ? data.customEdgeHROffset : 0;

    // generating the path
    const path = generateOrthogonalEdgePath(
        sourceX,
        sourceY,
        targetX,
        targetY,
        0,
        hcOffset,
        vrOffset,
        vlOffset,
        hlOffset,
        hrOffset
    );

    const getTopBottomPointsY = (top: boolean) => {
        if (targetY < sourceY) {
            if (top) {
                return (centerY - hcOffset + (yOffset + hcOffset + hlOffset) / 2);
            } else {
                return (centerY - hcOffset - (yOffset - hcOffset - hrOffset) / 2);
            }
        } else {
            if (top) {
                return (centerY - hcOffset - (yOffset - hcOffset - hlOffset) / 2);
            } else {
                return (centerY - hcOffset + (yOffset + hcOffset + hrOffset) / 2);
            }
        }
    };

    const isNew = data?.new || false;

    return (
        <>
            <BaseEdge
                key={id}
                path={path}
                style={{
                    strokeWidth: EDGE_WIDTH,
                    ...edgeStyle,
                    opacity: isNew ? 1 : OLD_EDGE_OPACITY,
                }}
                className="z-10"
            />
            <EdgeLabelRenderer>
                {
                    vlOffset !== 0 &&
                    <DragPoint 
                        isSelected={selected} 
                        direction={"horizontal"} 
                        x={sourceX + (vlOffset / 2)} 
                        y={sourceY + hlOffset} 
                        onDrag={(_, newDY) => onHLDragged(-newDY / zoom)}
                    />
                }
                <DragPoint 
                    isSelected={selected} 
                    direction={"vertical"} 
                    x={sourceX + vlOffset} 
                    y={getTopBottomPointsY(true)} 
                    onDrag={(newDX) => onVLDragged(-(newDX / zoom))}                 
                />
                <DragPoint 
                    isSelected={selected} 
                    direction={"horizontal"} 
                    x={centerX + (vlOffset + vrOffset) / 2} 
                    y={centerY - hcOffset} 
                    onDrag={(_, newDY) => onHCDragged(newDY / zoom)}
                />
                <DragPoint 
                    isSelected={selected} 
                    direction={"vertical"} 
                    x={targetX + vrOffset} 
                    y={getTopBottomPointsY(false)} 
                    onDrag={(newDX) => onVRDragged(-(newDX / zoom))}
                />
                { 
                    vrOffset !== 0 &&
                    <DragPoint 
                        isSelected={selected} 
                        direction={"horizontal"} 
                        x={targetX + (vrOffset / 2)} 
                        y={targetY + hrOffset} 
                        onDrag={(_, newDY) => onHRDragged(-newDY / zoom)}              
                    />
                }
            </EdgeLabelRenderer>
        </>
    );
};

export default EditorCustomEdge;
