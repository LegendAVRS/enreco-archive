import { CustomEdgeType, CustomEdgeTypeNames, EditorChapter, EditorChartData, ImageNodeType } from "@/lib/type";
import { create, StateCreator } from "zustand";
import { immer } from 'zustand/middleware/immer';

export type EditorMode = "edit" | "view" | "place" | "delete";
export type CardType = "node" | "edge" | "general" | null;

function createBlankChapter(): EditorChapter {
    return {
        numberOfDays: 0,
        title: "",
        charts: [],
        relationships: {},
        teams: {}
    };
}

function createBlankDay(): EditorChartData {
    return {
        nodes: [],
        edges: [],
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

    edgeType: CustomEdgeTypeNames;
    setEdgeType: (edgeType: CustomEdgeTypeNames) => void;
}

interface EditorDataSlice {
    data: EditorChapter[];
    addChapter: () => void;
    insertChapter: (chapter: number) => void;
    deleteChapter: (chapter: number) => void;
    addDay: () => void;
    insertDay: (day: number) => void;
    deleteDay: (day: number) => void;
    cloneDay: (day: number) => void;
    moveDay: (dayToMove: number, newPos: number) => void;
    
    chapter: number | null;
    setChapter: (newChapter: number | null) => void;

    day: number | null;
    setDay: (newDay: number | null) => void;

    setNodes: (newNodes: ImageNodeType[]) => void;
    setEdges: (newEdges: CustomEdgeType[]) => void;
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
        setEdgeType: (edgeType: CustomEdgeTypeNames) => set({ edgeType: edgeType }),
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
                state.data.splice(chapter + 1, 0, createBlankChapter());
            });
        },
        deleteChapter: (chapter: number) => {
            if(get().chapter === null || chapter < 0) {
                return;
            }

            console.log("hi");

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
                state.data[get().chapter!].numberOfDays++;
            });
        },
        insertDay: (day: number) => {
            const ch = get().chapter;
            if(ch === null || day < 0 || day > get().data[ch].charts.length) {
                return;
            }

            set((state) => {
                state.data[ch].charts.splice(day + 1, 0, createBlankDay());
                state.data[ch].numberOfDays++;
            });
        },
        deleteDay: (day: number) => {
            const ch = get().chapter;
            if(ch === null || day < 0 || day > get().data[ch].charts.length) {
                return;
            }

            set((state) => {
                state.data[ch].charts.splice(day, 1);
                state.data[ch].numberOfDays--;
            });
        },
        cloneDay: (day: number) => {
            const ch = get().chapter;
            if(ch === null || day < 0 || day > get().data[ch].charts.length) {
                return;
            }

            set((state) => {
                const dayClone = structuredClone(get().data[ch].charts[day]);
                dayClone.nodes.forEach((value: ImageNodeType) => value.data.new = false);
                dayClone.edges.forEach((value: CustomEdgeType) => { 
                    if(value.data) {
                        value.data!.new = false;
                    }
                });
                state.data[ch].charts.splice(day + 1, 0, dayClone);
                state.data[ch].numberOfDays++;
            });
        },
        moveDay: (dayToMove: number, newPos: number) => {
            const ch = get().chapter;
            if(ch === null || dayToMove < 0 || dayToMove > get().data[ch].charts.length ||
                newPos < 0 || newPos > get().data[ch].charts.length) {
                return;
            }

            set((state) => {
                const elem = get().data[ch].charts[dayToMove];
                state.data[ch].charts.splice(dayToMove, 1);
                state.data[ch].charts.splice(newPos, 1, elem);
            });
        },

        chapter: null,
        setChapter: (newChapter: number | null) => {
            set({ chapter: newChapter });
        },

        day: null,
        setDay: (newDay: number | null) => {
            set({ day: newDay });
        },

        setNodes: (newNodes: ImageNodeType[]) => {
            const chapter = get().chapter!;
            const day = get().day!;

            set((state) => {
                state.data[chapter].charts[day].nodes = newNodes;
            })
        },

        setEdges: (newEdges) => {
            const chapter = get().chapter!;
            const day = get().day!;

            set((state) => {
                state.data[chapter].charts[day].edges = newEdges;
            })
        },
    });

export const useEditorStore = create<EditorState>()(immer((...a) => ({
    ...createEditorSlice(...a),
    ...createEditorDataSlice(...a),
})));