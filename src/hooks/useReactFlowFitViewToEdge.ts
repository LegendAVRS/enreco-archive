'use client';

import { generatePath } from "@/lib/get-edge-svg-path";
import { FixedEdgeType, ImageNodeType } from "@/lib/type";
import { useReactFlow, useStoreApi } from "@xyflow/react";
import { getEdgePosition } from "@xyflow/system";
import { isMobile } from "react-device-detect";

// Get center point of svg path
function getCenterPoint(path: string): DOMPoint {
    const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    pathElement.setAttribute("d", path);
    const length = pathElement.getTotalLength();
    const center = pathElement.getPointAtLength(length / 2);
    return center;
};

export interface EdgeViewCenterArgs {
    centerPointX: number;
    centerPointY: number;
    duration: number;
    zoom: number;
}

// Function to fit edge to view, returns all values required to plug into setCenter
function findCenterViewOfEdge (
    nodeA: ImageNodeType,
    nodeB: ImageNodeType,
    isMobile: boolean,
    path: string
) : EdgeViewCenterArgs {
    const nodeAPosition = nodeA!.position;
    const nodeBPosition = nodeB!.position;
    const centerEdge = getCenterPoint(path);

    // Offset for desktop, since there's a card on the right
    let offsetX = 0;
    if (!isMobile) {
        offsetX = Math.min(
            500,
            Math.abs(nodeA!.position.x - nodeB!.position.x) / 2
        );
    }

    // Center point is the center of the two nodes + centerEdge
    const centerPoint = {
        x: (nodeAPosition.x + nodeBPosition.x + centerEdge.x) / 3 + offsetX,
        y: (nodeAPosition.y + nodeBPosition.y + centerEdge.y) / 3,
    };

    // Calculate zoom factor based on how far the nodes are from each other, in terms of euclidean distance
    // Further means less zoom, closer means more zoom
    let zoomFactor = Math.sqrt(
        Math.pow(nodeAPosition.x - nodeBPosition.x, 2) +
            Math.pow(nodeAPosition.y - nodeBPosition.y, 2)
    );

    // Normalize the zoom factor
    zoomFactor = zoomFactor / 1000;

    // Map the zoom factor to a value between minZoom and maxZoom
    let minZoom = 0.5;
    let maxZoom = 1.0;

    if (isMobile) {
        minZoom = 0.3;
        maxZoom = 0.5;
    }

    let zoomFactorMapped = minZoom + (maxZoom - minZoom) * (1 / zoomFactor);

    // Clamp the zoom factor
    zoomFactorMapped = Math.min(maxZoom, zoomFactorMapped);
    zoomFactorMapped = Math.max(minZoom, zoomFactorMapped);

    return {
        centerPointX: centerPoint.x,
        centerPointY: centerPoint.y,
        duration: 1000,
        zoom: zoomFactorMapped
    }
};

export function useReactFlowFitViewToEdge() {
    const { setCenter } = useReactFlow<ImageNodeType, FixedEdgeType>();
    const rfStore = useStoreApi<ImageNodeType, FixedEdgeType>();

    // Function to fit edge to view
    const fitViewToEdge = (nodeAID: string, nodeBID: string, edge: FixedEdgeType) => {
        const nodeA = rfStore.getState().nodeLookup.get(nodeAID);
        const nodeB = rfStore.getState().nodeLookup.get(nodeBID);
        if(!nodeA || !nodeB) {
            return;
        }

        const edgePos = getEdgePosition({
            id: edge.id,
            sourceNode: nodeA,
            targetNode: nodeB,
            sourceHandle: edge.sourceHandle || null,
            targetHandle: edge.targetHandle || null,
            connectionMode: rfStore.getState().connectionMode,
            onError: (id: string, message: string) => {
                throw new Error(`Failed to get edge position for edge ${id}: ${message}`)
            },
        });

        if(!edgePos) {
            throw new Error("edge position is undefined");
        }

        const {
            sourceX,
            sourceY,
            sourcePosition,
            targetX,
            targetY,
            targetPosition
        } = edgePos

        const path = generatePath(
            edge.data?.pathType, 
            edge.data?.offsets, 
            sourceX, 
            sourceY, 
            sourcePosition, 
            targetX, 
            targetY, 
            targetPosition
        );
        
        const {centerPointX, centerPointY, duration, zoom} = findCenterViewOfEdge(nodeA, nodeB, isMobile, path);

        // Pan to calculated center point
        (async () => (
            await setCenter(centerPointX, centerPointY, {
                duration: duration,
                zoom: zoom,
            })
        ))();
    };

    return { fitViewToEdge }; 
} 
