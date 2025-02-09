"use client";

import {
    Chapter,
    CustomEdgeType,
    FitViewOperation,
    FixedEdgeType,
    ImageNodeType,
    StringToBooleanObjectMap,
} from "@/lib/type";
import {
    ConnectionMode,
    FitViewOptions,
    ReactFlow,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { isMobile } from "react-device-detect";

import ViewCustomEdge from "@/components/view/ViewCustomEdge";
import ImageNodeView from "@/components/view/ViewImageNode";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReactFlowFitViewToEdge } from "@/hooks/useReactFlowFitViewToEdge";
import { usePreviousValue } from "@/hooks/usePreviousValue";
import { EDGE_WIDTH, OLD_EDGE_OPACITY } from "@/lib/constants";

function findTopLeftNode(nodes: ImageNodeType[]) {
    let topLeftNode = nodes[0];
    for (const node of nodes) {
        if (
            node.position.x < topLeftNode.position.x ||
            (node.position.x === topLeftNode.position.x &&
                node.position.y < topLeftNode.position.y)
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
            (node.position.x === bottomRightNode.position.x &&
                node.position.y > bottomRightNode.position.y)
        ) {
            bottomRightNode = node;
        }
    }
    return bottomRightNode;
}

function getFlowRendererWidth(widthToShrink: number) {
    return isMobile ? "100%" : `calc(100% - ${widthToShrink}px)`;
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
    edges: FixedEdgeType[];
    edgeVisibility: StringToBooleanObjectMap;
    teamVisibility: StringToBooleanObjectMap;
    characterVisibility: StringToBooleanObjectMap;
    chapterData: Chapter;
    focusOnClickedEdge?: boolean;
    focusOnClickedNode?: boolean;
    selectedNode: ImageNodeType | null;
    selectedEdge: FixedEdgeType | null;
    focusOnSelectedEdge?: boolean;
    focusOnSelectedNode?: boolean;
    widthToShrink: number;
    isCardOpen: boolean;
    /**
     * A change in this prop will cause the chart to try and fit the viewport to show
     * certain elements on the screen, depending on fitViewOperation.
     */
    doFitView: boolean;
    fitViewOperation: FitViewOperation;
    onNodeClick: (node: ImageNodeType) => void;
    onEdgeClick: (edge: FixedEdgeType) => void;
    onPaneClick: () => void;
    day: number;
}

function ViewChart({
    nodes,
    edges,
    edgeVisibility,
    teamVisibility,
    characterVisibility,
    chapterData,
    selectedNode,
    selectedEdge,
    widthToShrink,
    isCardOpen,
    doFitView,
    fitViewOperation,
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    day,
}: Props) {
    const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
    const topLeftNode = useMemo(() => findTopLeftNode(nodes), [nodes]);
    const bottomRightNode = useMemo(() => findBottomRightNode(nodes), [nodes]);

    const { fitView } = useReactFlow<ImageNodeType, CustomEdgeType>();
    const { fitViewToEdge } = useReactFlowFitViewToEdge();
    const prevDoFitView = usePreviousValue(doFitView);
    const prevWidthToShrink = usePreviousValue(widthToShrink);
    const flowRendererSizer = useRef<HTMLDivElement>(null);

    const fitViewAsync = useCallback(
        async (fitViewOptions?: FitViewOptions) => {
            await fitView(fitViewOptions);
        },
        [fitView],
    );

    const fitViewFunc = useCallback(() => {
        if (selectedNode && fitViewOperation === "fit-to-node") {
            fitViewAsync({
                nodes: [selectedNode],
                duration: 1000,
                maxZoom: 1.5,
            });
        } else if (selectedEdge && fitViewOperation === "fit-to-edge") {
            fitViewToEdge(
                selectedEdge.source,
                selectedEdge.target,
                selectedEdge,
            );
        } else if (fitViewOperation === "fit-to-all") {
            fitViewAsync({ padding: 0.5, duration: 1000 });
        }
    }, [
        fitViewAsync,
        fitViewOperation,
        fitViewToEdge,
        selectedEdge,
        selectedNode,
    ]);

    useEffect(() => {
        if (widthToShrink !== prevWidthToShrink) {
            if (flowRendererSizer.current) {
                flowRendererSizer.current.style.width =
                    getFlowRendererWidth(widthToShrink);
            }

            // Need a slight delay to make sure the width is updated before fitting the view
            setTimeout(fitViewFunc, 20);
        }
    }, [widthToShrink, prevWidthToShrink, fitViewFunc]);

    useEffect(() => {
        if (prevDoFitView !== doFitView) {
            // Like a above, need a slight delay to make sure that nodes/edges
            // get updated in React Flow internally when new nodes/edges are
            // passed in.
            setTimeout(fitViewFunc, 20);
        }
    }, [doFitView, fitViewFunc, prevDoFitView]);

    // Filter and fill in render properties for nodes/edges before passing them to ReactFlow.

    const renderableNodes = nodes
        .filter(
            (node) =>
                // Compute node visibility based on related edge and viewstore settings
                (!node.data.teamId ||
                    teamVisibility[node.data.teamId || "null"]) &&
                characterVisibility[node.id],
        )
        .map((node) => {
            // Set team icon image, if available.

            if (node.data.teamId) {
                node.data.renderTeamImageSrc =
                    chapterData.teams[node.data.teamId].teamIconSrc || "";
            } else {
                node.data.renderTeamImageSrc = "";
            }

            return node;
        });

    const renderableEdges = edges
        .filter((edge) => {
            const nodeSrc = nodes.filter(
                (node) => node.id == edge.source,
            )[0] as ImageNodeType;
            const nodeTarget = nodes.filter(
                (node) => node.id == edge.target,
            )[0] as ImageNodeType;
            if (!nodeSrc || !nodeTarget) {
                return false;
            }

            const edgeData = edge.data;
            if (!edgeData) {
                return false;
            }

            return (
                edgeVisibility[edgeData.relationshipId] &&
                (!nodeSrc.data.teamId ||
                    teamVisibility[nodeSrc.data.teamId || "null"]) &&
                (!nodeTarget.data.teamId ||
                    teamVisibility[nodeTarget.data.teamId || "null"]) &&
                characterVisibility[nodeSrc.id] &&
                characterVisibility[nodeTarget.id]
            );
        })
        .map((edge) => {
            const edgeData = edge.data;
            if (!edgeData) {
                return edge;
            }

            const edgeStyle =
                chapterData.relationships[edgeData.relationshipId].style || {};
            const isNew = edgeData.day === day;
            if (edgeVisibility["new"]) {
                edge.style = {
                    ...edgeStyle,
                    opacity: isNew ? 1 : OLD_EDGE_OPACITY,
                    strokeWidth: edgeData.renderIsHoveredEdge
                        ? EDGE_WIDTH + 2
                        : EDGE_WIDTH,
                    pointerEvents: isNew ? "auto" : "none",
                };
            } else {
                edge.style = {
                    ...edgeStyle,
                    opacity: 1,
                    strokeWidth: EDGE_WIDTH,
                };
            }

            edgeData.renderIsHoveredEdge = edge.id === hoveredEdgeId;

            return edge;
        });

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
                    if (edge.data?.day !== day && edgeVisibility["new"]) {
                        return;
                    }

                    onEdgeClick(edge);
                }}
                minZoom={minZoom}
                zoomOnDoubleClick={false}
                onPaneClick={() => {
                    if (isCardOpen) {
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
