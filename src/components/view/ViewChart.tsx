"use client";

import { ChartData, CustomEdgeType, FitViewOperation, ImageNodeType, StringToBooleanObjectMap } from "@/lib/type";
import { ConnectionMode, FitViewOptions, ReactFlow, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { isMobile } from "react-device-detect";

import ViewCustomEdge from "@/components/view/ViewCustomEdge";
import ImageNodeView from "@/components/view/ViewImageNode";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReactFlowFitViewToEdge } from "@/hooks/useReactFlowFitViewToEdge";
import { usePreviousValue } from "@/hooks/usePreviousValue";

function findTopLeftNode(nodes: ImageNodeType[]) {
    let topLeftNode = nodes[0];
    for (const node of nodes) {
        if (
            node.position.x < topLeftNode.position.x || 
            (node.position.x === topLeftNode.position.x && node.position.y < topLeftNode.position.y)
        ) {
            topLeftNode = node;
        }
    }
    return topLeftNode;
}

function findBottomRightNode(nodes: ImageNodeType[]) {
    let bottomRightNode = nodes[0];
    for (const node of nodes) {
        if (
            node.position.x > bottomRightNode.position.x || 
            (node.position.x === bottomRightNode.position.x && node.position.y > bottomRightNode.position.y)
        ) {
            bottomRightNode = node;
        }
    }
    return bottomRightNode;
}

function getFlowRendererWidth(widthToShrink: number) {
    return isMobile ? '100%' : `calc(100% - ${widthToShrink}px)`;
}

const nodeTypes = {
    image: ImageNodeView,
};

const edgeTypes = {
    fixed: ViewCustomEdge,
};

// On mobile it's harder to zoom out, so we set a lower min zoom
const minZoom = isMobile ? 0.3 : 0.5;
// To limit the area where the user can pan
const areaOffset = 1000;

interface Props {
    nodes: ImageNodeType[];
    edges: CustomEdgeType[];
    edgeVisibility: StringToBooleanObjectMap;
    teamVisibility: StringToBooleanObjectMap;
    characterVisibility: StringToBooleanObjectMap;
    dayData: ChartData;
    focusOnClickedEdge?: boolean;
    focusOnClickedNode?: boolean;
    selectedNode: ImageNodeType | null;
    selectedEdge: CustomEdgeType | null;
    focusOnSelectedEdge?: boolean;
    focusOnSelectedNode?: boolean;
    widthToShrink: number;
    isCardOpen: boolean;
    fitViewOperation: FitViewOperation;
    onNodeClick: (node: ImageNodeType) => void;
    onEdgeClick: (edge: CustomEdgeType) => void;
    onPaneClick: () => void;
}

function ViewChart({
    nodes,
    edges,
    edgeVisibility,
    teamVisibility,
    characterVisibility,
    dayData,
    selectedNode,
    selectedEdge,
    widthToShrink,
    isCardOpen,
    fitViewOperation,
    onNodeClick,
    onEdgeClick,
    onPaneClick
}: Props) {
    const [ hoveredEdgeId, setHoveredEdgeId ] = useState<string | null>(null);
    const topLeftNode = useMemo(() => findTopLeftNode(nodes), [nodes]);
    const bottomRightNode = useMemo(() => findBottomRightNode(nodes), [nodes]);

    const { fitView } = useReactFlow<ImageNodeType, CustomEdgeType>();
    const { fitViewToEdge } = useReactFlowFitViewToEdge();
    const prevFitViewOperation = usePreviousValue(fitViewOperation);
    const prevSelectedNode = usePreviousValue<ImageNodeType | null>(selectedNode);
    const prevSelectedEdge = usePreviousValue<CustomEdgeType | null>(selectedEdge);
    const prevWidthToShrink = usePreviousValue(widthToShrink);
    const flowRendererSizer = useRef<HTMLDivElement>(null);

    const fitViewAsync = useCallback(async (fitViewOptions?: FitViewOptions) => {
        await fitView(fitViewOptions);
    }, [fitView]);

    const fitViewFunc = useCallback(() => {
        if(selectedNode && fitViewOperation === "fit-to-node") {
            fitViewAsync({
                nodes: [selectedNode],
                duration: 1000,
                maxZoom: 1.5,
            });
        }
        else if(selectedEdge && fitViewOperation === "fit-to-edge") {
            fitViewToEdge(selectedEdge.source, selectedEdge.target, selectedEdge);
        }
        else if(fitViewOperation === "fit-to-all") {
            fitViewAsync({ padding: 0.5, duration: 1000 });
        }
    }, [fitViewAsync, fitViewOperation, fitViewToEdge, selectedEdge, selectedNode]);

    useEffect(() => {
        if(widthToShrink !== prevWidthToShrink) {
            if(flowRendererSizer.current) {
                flowRendererSizer.current.style.width = getFlowRendererWidth(widthToShrink);
            }

            // Need a slight delay to make sure the width is updated before fitting the view
            setTimeout(fitViewFunc, 50);
        }
    }, [widthToShrink, prevWidthToShrink, fitViewFunc])

    // Filter and fill in render properties for nodes/edges before passing them to ReactFlow.
    const renderableNodes = nodes.filter(node => {
        // Compute node visibility based on related edge and viewstore settings
        let isVisible = true;

        if (node.data.team) {
            isVisible = isVisible && teamVisibility[node.data.team];
        } 
        if (node.data.title) {
            isVisible = isVisible && characterVisibility[node.data.title];
        }
        return isVisible;
    }).map(node => {
        // Set team icon image, if available.
        if(node.data.team) {
            node.data.renderTeamImageSrc = dayData.teams[node.data.team]?.imageSrc || "";
        }
        else {
            node.data.renderTeamImageSrc = "";
        }
        
        return node;
    });

    const renderableEdges = edges.filter(edge => {
        const nodeSrc = nodes.filter(node => node.id == edge.source)[0] as ImageNodeType;
        const nodeTarget = nodes.filter(node => node.id == edge.target)[0] as ImageNodeType;
        if(!nodeSrc || !nodeTarget) {
            return false;
        }

        let visibility = true;
        if (edge.data?.relationship) {
            visibility = visibility && edgeVisibility[edge.data.relationship];
        }
        /*
        if (edge.data?.new) {
            visibility = visibility && edgeVisibility["new"];
        }
        */
        if (nodeSrc?.data.team) {
            visibility = visibility && teamVisibility[nodeSrc.data.team];
        }
        if (nodeTarget?.data.team) {
            visibility = visibility && teamVisibility[nodeTarget.data.team];
        }
        if (nodeSrc?.data.title) {
            visibility = visibility && characterVisibility[nodeSrc.data.title];
        }
        if (nodeTarget?.data.title) {
            visibility = visibility && characterVisibility[nodeTarget.data.title];
        }
        
        return visibility;
    }).map(edge => {
        if(!edge.data) {
            return edge;
        }

        if(edge.data.relationship) {
            edge.data.renderEdgeStyle = dayData.relationships[edge.data.relationship] || {};
        }

        edge.data.renderIsHoveredEdge = edge.id === hoveredEdgeId; 

        return edge;
    });

    if(prevFitViewOperation !== fitViewOperation || 
        selectedNode !== prevSelectedNode || 
        selectedEdge !== prevSelectedEdge
    ) {
        fitViewFunc();
    }

    return (
        <div ref={flowRendererSizer} className="w-full h-full">
            <ReactFlow 
                connectionMode={ConnectionMode.Loose}
                nodes={renderableNodes}
                edges={renderableEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                fitViewOptions={{ padding: 0.5, duration: 1000 }}
                onNodeClick={(_, node) => {
                    onNodeClick(node);
                }}
                onEdgeClick={(_, edge) => {
                    // Disable edge selection on if is old edge and only show new is true
                    if (edge.data?.new === false && edgeVisibility["new"]) {
                        return;
                    }

                    onEdgeClick(edge);
                }}
                minZoom={minZoom}
                zoomOnDoubleClick={false}
                onPaneClick={() => {
                    if(isCardOpen) {
                        fitViewAsync({ padding: 0.5, duration: 1000 });
                    }
                    onPaneClick();
                }}
                onEdgeMouseEnter={(_, edge) => {
                    setHoveredEdgeId(edge.id);
                }}
                onEdgeMouseLeave={() => {
                    setHoveredEdgeId("");
                }}
                proOptions={{
                    hideAttribution: true,
                }}
                translateExtent={
                    topLeftNode &&
                    bottomRightNode && [
                        [
                            topLeftNode.position.x - areaOffset,
                            topLeftNode.position.y - areaOffset,
                        ],
                        [
                            bottomRightNode.position.x + areaOffset,
                            bottomRightNode.position.y + areaOffset,
                        ],
                    ]
                }
            />
        </div>
    );
}

export default memo(ViewChart);