"use client";

import * as Toggle from "@radix-ui/react-toggle";
import * as Toolbar from "@radix-ui/react-toolbar";
import { useReactFlow } from "@xyflow/react";

import { EditorChart } from "@/components/editor/EditorChart";
import EdgeEditorCard from "@/components/editor/EditorEdgeCard";
import EditorGeneralCard from "@/components/editor/EditorGeneralCard";
import EditorNodeCard from "@/components/editor/EditorNodeCard";
import { EditorTransportControls } from "@/components/editor/EditorTransportControls";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useKeyboard from "@/hooks/useKeyboard";
import { CustomEdgeType, CustomEdgeTypeNames, EditorImageNodeType, RelationshipMap, TeamMap } from "@/lib/type";
import { EditorMode, useEditorStore } from "@/store/editorStore";
import EditorTeamsCard from "./EditorTeamsCard";
import EditorRelationshipsCard from "./EditorRelationshipsCard";

const EMPTY_NODE: EditorImageNodeType = {
    id: "",
    type: "editorImage",
    position: { x: 0, y: 0 },
    data: {
        title: "",
        content: "",
        imageSrc: "/default-node-image.png",
        teamId: "",
        status: "",
        new: true,
        bgCardColor: "",
        renderShowHandles: true
    },
};

const EMPTY_EDGE: CustomEdgeType = {
    id: "",
    type: "custom",
    source: "",
    target: "",
    data: {
        relationshipId: "",
        title: "",
        content: "",
        timestampUrl: "",
        new: true,
        path: "",
        marker: false,
        renderEdgeStyle: {},
        customEdgeHLOffset: 0,
        customEdgeVLOffset: 0,
        customEdgeHCOffset: 0,
        customEdgeVROffset: 0,
        customEdgeHROffset: 0
    }
};

const EditorApp = () => {
    const { deleteElements } = useReactFlow();
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
        setEdges,
        showHandles,
        setShowHandles,
        addChapter,
        insertChapter,
        deleteChapter,
        addDay,
        insertDay,
        deleteDay,
        cloneDay,
        moveDay,
        setChapterTitle,
        setChapterTeams,
        setChapterRelationships,
        setDayRecap,
        selectedEdge,
        setSelectedEdge,
        selectedNode,
        setSelectedNode
    } = useEditorStore();
    useKeyboard();
    
    const numChapters = data.length;
    const numDays = chapter !== null && data ? data[chapter].numberOfDays : 0;
    const teams = chapter !== null && data ? data[chapter].teams : {};
    const relationships = chapter !== null && data ? data[chapter].relationships : {};

    const rawNodes = chapter !== null && day !== null && data ? data[chapter].charts[day]?.nodes : [];
    const nodes = rawNodes.map(node => {
        const newNode = structuredClone(node);
        newNode.data.renderShowHandles = showHandles;
        return newNode;
    });

    const rawEdges = chapter !== null && day !== null && data ? data[chapter].charts[day]?.edges : [];
    const edges = rawEdges.map(edge => {
        const newEdge = structuredClone(edge);
        if(newEdge.data && newEdge.data.relationshipId) {
            newEdge.data.renderEdgeStyle = relationships[newEdge.data.relationshipId].style || {};
        }
        else {
            newEdge.data!.renderEdgeStyle = {};
        }
        return newEdge;
    });

    const updateEdge = (oldEdge: CustomEdgeType, newEdge: CustomEdgeType) => {
        const newEdgeArray = edges.filter(e => e.id !== oldEdge.id);
        newEdgeArray.push(newEdge);
        setEdges(newEdgeArray);
    };

    const updateNode = (oldNode: EditorImageNodeType, newNode: EditorImageNodeType) => {
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

    const addChapterEH = () => {
        if(chapter === null) {
            setChapter(0);
            addChapter();
        }
        else {
            insertChapter(chapter);
            setChapter(chapter + 1);
        }
        setDay(null);
    };

    const deleteChapterEH = () => {
        if(chapter === 0) {
            deleteChapter(0);
            setChapter(numChapters === 1 ? null : 0); 
        }
        else if(chapter === numChapters - 1) {
            deleteChapter(chapter);
            setChapter(chapter - 1);
        }
        else if(chapter !== null) {
            deleteChapter(chapter);
        }
    };

    const addDayEH = () => {
        if(day === null) {
            setDay(0);
            addDay();
        }
        else {
            insertDay(day);
            setDay(day + 1);
        }
    };

    const deleteDayEH = () => {
        if(day === 0) {
            deleteDay(0);
            setDay(numDays === 1 ? null : 0);
        }
        else if(day === numDays - 1) {
            deleteDay(day);
            setDay(day - 1);
        }
        else if(day !== null) {
            deleteDay(day);
        }
    };

    return (
        <>
            <div className="w-screen h-screen">
                <EditorChart
                    nodes={nodes}
                    setNodes={setNodes}
                    edges={edges}
                    setEdges={setEdges}
                    edgeType={edgeType}
                    areNodesDraggable={mode === "edit"}
                    canPlaceNewNode={mode === "place"}
                    onNodeClick={(node: EditorImageNodeType) => {
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
                <div className="w-2/12 flex flex-col gap-y-0.5">
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
                    onChapterChange={(newChapter: number) => { 
                        setChapter(newChapter);
                        setDay(data[newChapter].numberOfDays === 0 ? null : 0);
                    }}
                    onDayChange={(newDay: number) => setDay(newDay)}
                    onChapterAdd={addChapterEH}
                    onChapterDelete={deleteChapterEH}
                    onDayAdd={addDayEH}
                    onDayDelete={deleteDayEH}
                    onDayClone={cloneDay}
                    onDayMove={moveDay}
                />
                <Toolbar.Separator className="mx-2.5 w-px bg-black" />
                <div className="w-2/12 flex flex-col gap-y-2">
                    <Toggle.Root 
                        disabled={chapter === null}
                        pressed={currentCard === "general"} 
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
                        className="h-8 disabled:opacity-50 outline-none disabled:outline-none hover:outline hover:outline-black hover:outline-2 bg-white rounded-lg data-[state=on]:bg-neutral-300"
                    >
                        <span className="text-md">Chapter Title / Day Recap</span>
                    </Toggle.Root>
                    <Toggle.Root 
                        disabled={chapter === null}
                        pressed={currentCard === "teams"} 
                        onPressedChange={
                            (pressed: boolean) => {
                                if(pressed) {
                                    setCurrentCard("teams");
                                }
                                else {
                                    setCurrentCard(null);
                                }
                            }
                        }
                        className="h-8 disabled:opacity-50 outline-none disabled:outline-none hover:outline hover:outline-black hover:outline-2 bg-white rounded-lg data-[state=on]:bg-neutral-300"
                    >
                        <span className="text-md">Chapter Teams</span>
                    </Toggle.Root>
                    <Toggle.Root 
                        disabled={chapter === null}
                        pressed={currentCard === "relationships"}
                        onPressedChange={
                            (pressed: boolean) => {
                                if(pressed) {
                                    setCurrentCard("relationships");
                                }
                                else {
                                    setCurrentCard(null);
                                }
                            }
                        }
                        className="h-8 disabled:opacity-50 outline-none disabled:outline-none hover:outline hover:outline-black hover:outline-2 bg-white rounded-lg data-[state=on]:bg-neutral-300"
                    >
                        <span className="text-md">Chapter Relationships</span>
                    </Toggle.Root>
                </div>
                <Toolbar.Separator className="mx-2.5 w-px bg-black" />
                <div className="w-1/12 flex flex-col gap-y-0.5">
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

            <EditorNodeCard
                key={selectedNode ? selectedNode.id : ""}
                isVisible={currentCard === "node"}
                selectedNode={selectedNode || EMPTY_NODE}
                teams={teams}
                nodes={nodes}
                updateNode={updateNode}
                deleteNode={deleteNode}
                onCardClose={() => setCurrentCard(null)}
            />
        
            <EdgeEditorCard
                key={selectedEdge ? selectedEdge.id : ""}
                isVisible={currentCard === "edge"}
                selectedEdge={selectedEdge || EMPTY_EDGE}
                relationships={relationships}
                deleteEdge={deleteEdge}
                updateEdge={updateEdge}
                onCardClose={() => setCurrentCard(null)}
            />
            
            <EditorGeneralCard
                key={`${chapter}/${day}`}
                isVisible={currentCard === "general"}
                chapterData={chapter !== null ? data[chapter] : null}
                dayData={chapter !== null && day !== null ? data[chapter].charts[day] : null}
                onChapterTitleChange={setChapterTitle}
                onDayRecapChange={setDayRecap}
                onCardClose={() => setCurrentCard(null)}
            />

            <EditorTeamsCard
                key={`${chapter}-teams-card`}
                isVisible={currentCard === "teams"}
                teamData={chapter !== null ? data[chapter].teams : {}}
                onTeamsChange={(teams: TeamMap) => { setChapterTeams(teams); }}
                onCardClose={() => setCurrentCard(null)}
            />

            <EditorRelationshipsCard
                key={`${chapter}-relationships-card`}
                isVisible={currentCard === "relationships"}
                relationshipData={chapter !== null ? data[chapter].relationships : {}}
                onRelationshipsChange={(relationships: RelationshipMap) => { setChapterRelationships(relationships); }}
                onCardClose={() => setCurrentCard(null)}
            />
        </>
    );
};

export default EditorApp;
