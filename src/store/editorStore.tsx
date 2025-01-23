import { Chapter, ChartData, CustomEdgeType, ImageNodeType } from "@/lib/type";
import { applyNodeChanges, applyEdgeChanges, EdgeChange, NodeChange } from "@xyflow/react";
import { create, StateCreator } from "zustand";
import { immer } from 'zustand/middleware/immer';

export type EditorMode = "edit" | "view" | "place" | "delete";
export type CardType = "node" | "edge" | "general" | null;

function createBlankChapter(): Chapter {
    return {
        numberOfDays: 0,
        title: "",
        charts: []
    };
}

function createBlankDay(): ChartData {
    return {
        nodes: [],
        edges: [],
        relationships: {},
        teams: {},
        dayRecap: "",
        title: ""
    };
}

type EditorState = EditorSlice & EditorDataSlice;

interface EditorSlice {
    mode: EditorMode;
    setMode: (mode: EditorMode) => void;

    showHandles: boolean;
    setShowHandles: (showHandles: boolean) => void;

    currentCard: CardType;
    setCurrentCard: (name: CardType) => void;

    edgePaths: { [key: string]: string };
    setEdgePaths: (edgePaths: { [key: string]: string }) => void;

    edgeType: string;
    setEdgeType: (edgeType: string) => void;
}

interface EditorDataSlice {
    data: Chapter[];
    addChapter: () => void;
    insertChapter: (chapter: number) => void;
    deleteChapter: (chapter: number) => void;
    addDay: () => void;
    insertDay: (day: number) => void;
    deleteDay: (day: number) => void;
    
    chapter: number | null;
    setChapter: (newChapter: number) => void;

    day: number | null;
    setDay: (newDay: number) => void;

    setNodes: (newNodes: ImageNodeType[]) => void;
    onNodesChange: (changes: NodeChange<ImageNodeType>[]) => void;

    setEdges: (newEdges: CustomEdgeType[]) => void;
    onEdgesChange: (changes: EdgeChange<CustomEdgeType>[]) => void;
}

const createEditorSlice: StateCreator<EditorState, [["zustand/immer", never]], [["zustand/immer", never]], EditorSlice> = 
    (set) => ({
        mode: "view", // default mode
        setMode: (mode: EditorMode) => set({ mode: mode }),

        showHandles: true, // default value for showHandles
        setShowHandles: (showHandles: boolean) => set({ showHandles: showHandles }),

        currentCard: null,
        setCurrentCard: (currentCard: CardType) => set({ currentCard: currentCard }),

        edgePaths: {},
        setEdgePaths: (edgePaths: { [key: string]: string }) => set({ edgePaths: edgePaths }),

        edgeType: "custom",
        setEdgeType: (edgeType: string) => set({ edgeType: edgeType }),
    });

const createEditorDataSlice: StateCreator<EditorState, [["zustand/immer", never]], [["zustand/immer", never]], EditorDataSlice> = 
    (set, get) => ({
        data: [],
        addChapter: () => 
            set((state) => {
                state.data.push(createBlankChapter());
            })
        ,
        insertChapter: (chapter: number) => {
            if(get().chapter === null || chapter < 0) {
                return;
            }

            set((state) => {
                state.data.splice(chapter, 0, createBlankChapter());
            });
        },
        deleteChapter: (chapter: number) => {
            if(get().chapter === null || chapter < 0) {
                return;
            }

            set((state) => {
                state.data.splice(chapter, 1);
            });
        },
        addDay: () => {
            if(get().chapter === null) {
                return;
            }

            set((state) => {
                state.data[get().chapter!].charts.push(createBlankDay());
            });
        },
        insertDay: (day: number) => {
            if(get().chapter === null || day < 0 || day > get().data.length) {
                return;
            }

            set((state) => {
                state.data[get().chapter!].charts.splice(day, 0, createBlankDay());
            });
        },
        deleteDay: (day: number) => {
            if(get().chapter === null || day < 0 || day > get().data.length) {
                return;
            }

            set((state) => {
                state.data[get().chapter!].charts.splice(day, 1);
            });
        },

        chapter: null,
        setChapter: (newChapter: number) => {
            set({ chapter: newChapter });
        },

        day: null,
        setDay: (newDay: number) => {
            set({ day: newDay });
        },

        setNodes: (newNodes: ImageNodeType[]) => {
            const chapter = get().chapter!;
            const day = get().day!;

            set((state) => {
                state.data[chapter].charts[day].nodes = newNodes;
            })
        },
        onNodesChange: (changes) => {
            const chapter = get().chapter!;
            const day = get().day!;
            const nodes = get().data[chapter].charts[day].nodes;

            set((state) => {
                state.data[chapter].charts[day].nodes = applyNodeChanges(changes, nodes);
            })
        },

        setEdges: (newEdges) => {
            const chapter = get().chapter!;
            const day = get().day!;

            set((state) => {
                state.data[chapter].charts[day].edges = newEdges;
            })
        },
        onEdgesChange: (changes) => {
            const chapter = get().chapter!;
            const day = get().day!;
            const edges = get().data[chapter].charts[day].edges;

            set((state) => {
                state.data[chapter].charts[day].edges = applyEdgeChanges(changes, edges);
            })
        },
    });

export const useEditorStore = create<EditorState>()(immer((...a) => ({
    ...createEditorSlice(...a),
    ...createEditorDataSlice(...a),
})));