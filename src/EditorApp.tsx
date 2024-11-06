import EditorCustomEdge from "@/components/editor/EditorCustomEdge";
import EdgeEditorCard from "@/components/editor/EditorEdgeCard";
import EditorGeneralCard from "@/components/editor/EditorGeneralCard";
import EditorNodeCard from "@/components/editor/EditorNodeCard";
import EditorSmoothEdge from "@/components/editor/EditorSmoothEdge";
import { Button } from "@/components/ui/button";
import useKeyboard from "@/hooks/useKeyboard";
import { ChartData, CustomEdgeType } from "@/lib/type";
import { useChartStore } from "@/store/chartStore";
import { useEditorStore } from "@/store/editorStore";
import { useFlowStore } from "@/store/flowStore";
import {
    addEdge,
    ConnectionLineType,
    ConnectionMode,
    ReactFlow,
    ReactFlowInstance,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";
import EditorImageNode from "./components/editor/EditorImageNode";

import EditorFixedEdge from "@/components/editor/EditorFixedEdge";
import EditorStraightEdge from "@/components/editor/EditorStraightEdge";
import chartData from "@/data/day8.json";

const nodeTypes = {
    image: EditorImageNode,
};

const edgeTypes = {
    custom: EditorCustomEdge,
    customSmooth: EditorSmoothEdge,
    customStraight: EditorStraightEdge,
    fixed: EditorFixedEdge,
};

const loadFlow = () => {
    return chartData; // Load JSON data from chart.json
};

const EditorApp = () => {
    const { setData } = useChartStore();

    const { screenToFlowPosition, deleteElements } = useReactFlow();
    const {
        mode,
        currentCard,
        setCurrentCard,
        edgePaths,
        edgeType,
        setEdgeType,
    } = useEditorStore();
    const { selectedEdge, selectedNode, setSelectedEdge, setSelectedNode } =
        useFlowStore();
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { data } = useChartStore();
    useKeyboard();

    useEffect(() => {
        const chartData = loadFlow();
        setData(chartData);
        setNodes(chartData.nodes);
        setEdges(chartData.edges);
        for (const edge of chartData.edges) {
            edgePaths[edge.id] = edge.data.path;
        }
    }, [setNodes, setEdges, setData]);

    const addNode = (x: number, y: number) => {
        const newNode = {
            id: `node-${nodes.length + 1}`,
            type: "image",
            position: screenToFlowPosition({ x, y }),
            data: {
                imageSrc: "",
            },
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const connectEdge = (params: CustomEdgeType) => {
        params.type = edgeType;
        params.data = {
            relationship: undefined,
            title: "",
            content: "",
            timestampUrl: "",
            marker: true,
        };
        params.id = `${params.source}-${params.target}-${params.sourceHandle}-${params.targetHandle}`;
        setEdges((eds) => addEdge(params, eds));
    };

    const updateEdge = (params) => {
        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === params.id ? { ...edge, ...params } : edge
            )
        );
    };

    const updateNode = (params) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === params.id ? { ...node, ...params } : node
            )
        );
    };

    const deleteEdge = () => {
        if (selectedEdge) {
            deleteElements({
                edges: [selectedEdge],
            });
        }
        setSelectedEdge(null);
        setCurrentCard(null);
    };

    const deleteNode = () => {
        if (selectedNode) {
            deleteElements({
                nodes: [selectedNode],
            });
        }
        setSelectedNode(null);
        setCurrentCard(null);
    };

    const handleClick = (event) => {
        if (mode === "place") {
            addNode(event.clientX, event.clientY);
        }
    };

    const handleExport = () => {
        if (!rfInstance) return;
        const exportData: ChartData = data;
        const flow = rfInstance.toObject();
        flow.edges.forEach((edge) => {
            edge.data.path = edgePaths[edge.id];
            edge.type = "fixed";
        });
        // exportData.relationships = relationshipData;
        exportData.edges = flow.edges;
        exportData.nodes = flow.nodes;
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
            dataStr
        )}`;
        const exportFileDefaultName = "flow.json";
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="w-screen h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodesDraggable={mode === "edit"}
                onClick={handleClick}
                onNodeClick={(_, node) => {
                    setCurrentCard("node");
                    setSelectedNode(node);
                    setSelectedEdge(null);
                }}
                onEdgeClick={(_, edge) => {
                    setCurrentCard("edge");
                    setSelectedEdge(edge);
                    setSelectedNode(null);
                }}
                onConnect={connectEdge}
                snapToGrid
                snapGrid={[25, 25]}
                connectionMode={ConnectionMode.Loose}
                connectionLineType={ConnectionLineType.SmoothStep}
                zoomOnDoubleClick={false}
                onInit={setRfInstance}
            ></ReactFlow>
            <div className="absolute top-5 right-5 flex flex-row gap-4">
                <Button
                    onClick={() => {
                        setCurrentCard(null);
                    }}
                >
                    Close cards
                </Button>
                <Button
                    onClick={() => {
                        setCurrentCard("general");
                        setSelectedNode(null);
                        setSelectedEdge(null);
                    }}
                >
                    General
                </Button>
                <Button
                    onClick={() => {
                        if (edgeType === "custom") {
                            setEdgeType("customSmooth");
                        } else if (edgeType === "customSmooth") {
                            setEdgeType("customStraight");
                        } else {
                            setEdgeType("custom");
                        }
                    }}
                >
                    {edgeType}
                </Button>

                <Button onClick={handleExport}>Export</Button>
                <Button variant={"outline"} disabled>
                    {mode}
                </Button>
            </div>
            {currentCard === "node" && (
                <EditorNodeCard
                    updateNode={updateNode}
                    deleteNode={deleteNode}
                />
            )}
            {currentCard === "edge" && (
                <EdgeEditorCard
                    deleteEdge={deleteEdge}
                    updateEdge={updateEdge}
                />
            )}
            {currentCard === "general" && <EditorGeneralCard />}
        </div>
    );
};

export default EditorApp;
