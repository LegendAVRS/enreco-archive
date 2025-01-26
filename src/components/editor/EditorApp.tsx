"use client";
import EdgeEditorCard from "@/components/editor/EditorEdgeCard";
import EditorGeneralCard from "@/components/editor/EditorGeneralCard";
import EditorNodeCard from "@/components/editor/EditorNodeCard";

import useKeyboard from "@/hooks/useKeyboard";

import { EditorMode, useEditorStore } from "@/store/editorStore";
import { useFlowStore } from "@/store/flowStore";
import {
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MouseEventHandler } from "react";

import { EditorChart } from "./EditorChart";
import { CustomEdgeType, CustomEdgeTypeNames, ImageNodeType } from "@/lib/type";

import * as Toolbar from "@radix-ui/react-toolbar";
import * as Toggle from "@radix-ui/react-toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { EditorTransportControls } from "./EditorTransportControls";


const EditorApp = () => {
    const { screenToFlowPosition, deleteElements } = useReactFlow();
    const {
        mode,
        setMode,
        data,
        chapter,
        setChapter,
        day,
        setDay,
        currentCard,
        setCurrentCard,
        edgeType,
        setEdgeType,
        setNodes,
        onNodesChange,
        setEdges,
        onEdgesChange,
        showHandles,
        setShowHandles
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
            
            <Toolbar.Root id="main-toolbar" className="flex flex-row fixed top-5 left-[2.5%] right-[2.5%] w-[95%] mx-auto p-2 px-5 bg-neutral-100 rounded-lg">
                <div className="w-1/12 flex flex-col gap-y-2">
                    <span className="text-md font-bold">Editor Mode</span>
                    <Select
                        value={mode}
                        onValueChange={(value: EditorMode) => setMode(value)}
                    >
                        <Toolbar.Button asChild>
                            <SelectTrigger className="h-8" useUpChevron={false}>
                                <SelectValue />
                            </SelectTrigger>
                        </Toolbar.Button>
                        
                        <SelectContent side={"bottom"}>
                            <SelectItem value={"view"}>View</SelectItem>
                            <SelectItem value={"edit"}>Edit</SelectItem>
                            <SelectItem value={"place"}>Place</SelectItem>
                            <SelectItem value={"delete"}>Delete</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Toolbar.Separator className="mx-2.5 w-px bg-black" />
                <div className="w-2/12 flex flex-col gap-y-2">
                    <span className="text-md font-bold">Edge Type</span>
                    <Select
                        value={edgeType}
                        onValueChange={(value: CustomEdgeTypeNames) => setEdgeType(value)}
                    >
                        <Toolbar.Button asChild>
                            <SelectTrigger className="h-8" useUpChevron={false}>
                                <SelectValue />
                            </SelectTrigger>
                        </Toolbar.Button>
                        
                        <SelectContent side={"bottom"}>
                            <SelectItem value={"custom"}>Custom</SelectItem>
                            <SelectItem value={"customSmooth"}>Custom (Smooth)</SelectItem>
                            <SelectItem value={"customStraight"}>Custom (Straight)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Toolbar.Separator className="mx-2.5 w-px bg-black" />
                <EditorTransportControls
                    className="w-4/12"
                    chapter={chapter}
                    chapters={data}
                    day={day}
                    onChapterChange={(newChapter: number) => setChapter(newChapter)}
                    onDayChange={(newDay: number) => setDay(newDay)}
                    onChapterAdd={() => console.log("add chapter")}
                    onChapterDelete={() => console.log("delete chapter")}
                    onDayAdd={() => console.log("add day")}
                    onDayDelete={() => console.log("delete day")}
                />
                <Toolbar.Separator className="mx-2.5 w-px bg-black" />
                <div className="w-1/12 flex flex-col gap-y-2">
                    <Toggle.Root 
                        disabled={chapter === null}
                        pressed={currentCard !== null} 
                        onPressedChange={
                            (pressed: boolean) => {
                                if(pressed) {
                                    setCurrentCard("general");
                                    setSelectedNode(null);
                                    setSelectedEdge(null);
                                }
                                else {
                                    setCurrentCard(null);
                                }
                            }
                        }
                        className="disabled:opacity-50 outline-none disabled:outline-none hover:outline hover:outline-black hover:outline-2 p-2 bg-white rounded-lg data-[state=on]:bg-neutral-300"
                    >
                        <span className="text-lg">Show Chapter Info Card</span>
                    </Toggle.Root>
                </div>
                <Toolbar.Separator className="mx-2.5 w-px bg-black" />
                <div className="w-1/12 flex flex-col gap-y-2">
                    <span className="text-md font-bold">Settings</span>
                    <div className="flex content-center h-fit gap-2">
                        <Checkbox 
                            id="toggleHandles" 
                            className="my-auto" 
                            checked={showHandles} 
                            onCheckedChange={ 
                                (checked) => checked && checked !== "indeterminate" ? setShowHandles(true) : setShowHandles(false)
                            }
                        />
                        <label htmlFor="toggleHandles">Show Handles</label>
                    </div>
                </div>
            </Toolbar.Root>

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
