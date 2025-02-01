import { BaseEdge, EdgeLabelRenderer, useReactFlow } from "@xyflow/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { CustomEdgeProps } from "@/lib/type";
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
    onDrag: (dx: number, dy: number) => void,
    onFinishedDrag: () => void
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
        onFinishedDrag();
    }

    element.addEventListener("mousedown", dragMouseDown);

    return () => element.removeEventListener("mousedown", dragMouseDown);
}

interface DragPointProps {
    isSelected: boolean | undefined;
    direction: "horizontal" | "vertical";
    x: number,
    y: number,
    onDrag: (newXPos: number, newYPos: number) => void
    onFinishedDrag: () => void;
}

const DRAG_POINT_WIDTH = 10;
const DRAG_POINT_HEIGHT = 10;
function DragPoint({
    isSelected = false,
    direction,
    x,
    y,
    onDrag,
    onFinishedDrag
}: DragPointProps) {
    const pointRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(pointRef.current) {
            return drag(pointRef.current, 
                direction === "vertical", 
                direction === "horizontal",
                onDrag,
                onFinishedDrag
            );
        }
    }, [direction, onDrag, onFinishedDrag])

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

    // TODO: Move this to edge data.
    const [hlOffset, setHLOffset] = useState(data?.customEdgeHLOffset || 0);
    const [vlOffset, setVLOffset] = useState(data?.customEdgeVLOffset || 0);
    const [hcOffset, setHCOffset] = useState(data?.customEdgeHCOffset || 0);
    const [vrOffset, setVROffset] = useState(data?.customEdgeVROffset || 0);
    const [hrOffset, setHROffset] = useState(data?.customEdgeHROffset || 0);
    
    const { getZoom, setEdges, updateEdge } = useReactFlow();

    const zoom = getZoom();

    function onDragged(offset: number, setter: Dispatch<SetStateAction<number>>) {
        setEdges((prev) => {
            return prev.map((edge) =>
                edge.id === id
                    ? { ...edge, selected: true }
                    : { ...edge, selected: false }
            );
        });

        setter((prev) => prev + offset);
    }

    function onFinishedDragging() {
        updateEdge(id, {
            data: {
                ...data,
                customEdgeHLOffset: hlOffset,
                customEdgeVLOffset: vlOffset,
                customEdgeHCOffset: hcOffset,
                customEdgeVROffset: vrOffset,
                customEdgeHROffset: hrOffset
            }
        });
    }

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
                        onDrag={(_, newDY) => onDragged(-newDY / zoom, setHLOffset)}
                        onFinishedDrag={onFinishedDragging}                  
                    />
                }
                <DragPoint 
                    isSelected={selected} 
                    direction={"vertical"} 
                    x={sourceX + vlOffset} 
                    y={getTopBottomPointsY(true)} 
                    onDrag={(newDX) => onDragged(-(newDX / zoom), setVLOffset)}
                    onFinishedDrag={onFinishedDragging}                   
                />
                <DragPoint 
                    isSelected={selected} 
                    direction={"horizontal"} 
                    x={centerX + (vlOffset + vrOffset) / 2} 
                    y={centerY - hcOffset} 
                    onDrag={(_, newDY) => onDragged(newDY / zoom, setHCOffset)}
                    onFinishedDrag={onFinishedDragging}                  
                />
                <DragPoint 
                    isSelected={selected} 
                    direction={"vertical"} 
                    x={targetX + vrOffset} 
                    y={getTopBottomPointsY(false)} 
                    onDrag={(newDX) => onDragged(-(newDX / zoom), setVROffset)}
                    onFinishedDrag={onFinishedDragging}     
                />
                { 
                    vrOffset !== 0 &&
                    <DragPoint 
                        isSelected={selected} 
                        direction={"horizontal"} 
                        x={targetX + (vrOffset / 2)} 
                        y={targetY + hrOffset} 
                        onDrag={(_, newDY) => onDragged(-newDY / zoom, setHROffset)} 
                        onFinishedDrag={onFinishedDragging}                  
                    />
                }
            </EdgeLabelRenderer>
        </>
    );
};

export default EditorCustomEdge;
