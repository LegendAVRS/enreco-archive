"use client";
import EdgeEditorCard from "@/components/editor/EditorEdgeCard";
import EditorGeneralCard from "@/components/editor/EditorGeneralCard";
import EditorNodeCard from "@/components/editor/EditorNodeCard";

import { Button } from "@/components/ui/button";
import useKeyboard from "@/hooks/useKeyboard";

import { useEditorStore } from "@/store/editorStore";
import { useFlowStore } from "@/store/flowStore";
import {
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MouseEventHandler } from "react";

import { EditorChart } from "./EditorChart";
import { CustomEdgeType, ImageNodeType } from "@/lib/type";


const EditorApp = () => {
    const { screenToFlowPosition, deleteElements } = useReactFlow();
    const {
        mode,
        data,
        chapter,
        day,
        currentCard,
        setCurrentCard,
        edgeType,
        setEdgeType,
        setNodes,
        onNodesChange,
        setEdges,
        onEdgesChange,
    } = useEditorStore();
    const { selectedEdge, selectedNode, setSelectedEdge, setSelectedNode } =
        useFlowStore();
    useKeyboard();
    

    const nodes = chapter && chapter !== -1 && day && day !== -1 && data ? data[chapter].charts[day].nodes : [];
    const edges = chapter && chapter !== -1 && day && day !== -1 && data ? data[chapter].charts[day].edges : [];
    const teams = chapter && chapter !== -1 && data ? data[chapter].teams : {};
    const relationships = chapter && chapter !== -1 && data ? data[chapter].relationships : {};

    const addNode = (x: number, y: number) => {
        const newNode: ImageNodeType = {
            id: `node-${nodes.length + 1}`,
            type: "image",
            position: screenToFlowPosition({ x, y }),
            data: {
                title: "",
                content: "",
                imageSrc: "",
                teamId: "",
                status: "",
                new: true,
                bgCardColor: ""
            },
        };

        setNodes([...nodes, newNode]);
    };

    const updateEdge = (oldEdge: CustomEdgeType, newEdge: CustomEdgeType) => {
        const newEdgeArray = edges.filter(e => e.id !== oldEdge.id);
        newEdgeArray.push(newEdge);
        setEdges(newEdgeArray);
    };

    const updateNode = (oldNode: ImageNodeType, newNode: ImageNodeType) => {
        const newNodeArray = nodes.filter(e => e.id !== oldNode.id);
        newNodeArray.push(newNode);
        setNodes(newNodeArray);
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

    const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
        if (mode === "place") {
            addNode(event.clientX, event.clientY);
        }
    };

    return (
        <>
            <div className="w-screen h-screen">
                <EditorChart
                    nodes={nodes}
                    edges={edges}
                    edgeType={edgeType}
                    areNodesDraggable={mode === "edit"}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onClick={handleClick}
                    onNodeClick={(node: ImageNodeType) => {
                        setCurrentCard("node");
                        setSelectedNode(node);
                        setSelectedEdge(null);
                    }}
                    onEdgeClick={(edge: CustomEdgeType) => {
                        setCurrentCard("edge");
                        setSelectedEdge(edge);
                        setSelectedNode(null);
                    }}
                />
            </div>
            <div className="fixed top-5 right-5 flex flex-row gap-4">
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
                <Button variant={"outline"} disabled>
                    {mode}
                </Button>
            </div>

            {currentCard === "node" && (
                <EditorNodeCard
                    selectedNode={selectedNode}
                    teams={teams}
                    updateNode={updateNode}
                    deleteNode={deleteNode}
                />
            )}
            {currentCard === "edge" && (
                <EdgeEditorCard
                    selectedEdge={selectedEdge}
                    relationships={relationships}
                    deleteEdge={deleteEdge}
                    updateEdge={updateEdge}
                />
            )}
            {currentCard === "general" && <EditorGeneralCard />}
        </>
    );
};

export default EditorApp;
