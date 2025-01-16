'use client';

import { CustomEdgeType, ImageNodeType } from "@/lib/type";
import { useReactFlow } from "@xyflow/react";
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
export function findCenterViewOfEdge (
    nodeA: ImageNodeType,
    nodeB: ImageNodeType,
    edge: CustomEdgeType,
    isMobile: boolean
) : EdgeViewCenterArgs {
    const nodeAPosition = nodeA!.position;
    const nodeBPosition = nodeB!.position;
    const centerEdge = getCenterPoint(edge.data?.path || "");

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
    let maxZoom = 1;

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
    const { getNode, setCenter } = useReactFlow<ImageNodeType, CustomEdgeType>();

    // Function to fit edge to view
    const fitViewToEdge = (nodeAID: string, nodeBID: string, edge: CustomEdgeType) => {
        const nodeA = getNode(nodeAID);
        const nodeB = getNode(nodeBID);
        if(!nodeA || !nodeB) {
            return;
        }
        
        const {centerPointX, centerPointY, duration, zoom} = findCenterViewOfEdge(nodeA, nodeB, edge, isMobile);

        // Pan to calculated center point
        setCenter(centerPointX, centerPointY, {
            duration: duration,
            zoom: zoom,
        });
    };

    return { fitViewToEdge }; 
} 
