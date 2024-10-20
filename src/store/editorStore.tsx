import { ImageNodeData } from "@/lib/type";
import { create } from "zustand";

export type EditorMode = "edit" | "view" | "place" | "delete";
export type CardType = "node" | "edge" | "general" | null;

interface EditorState {
    mode: EditorMode;
    setMode: (mode: EditorMode) => void;
    showHandles: boolean;
    setShowHandles: (showHandles: boolean) => void;
    currentCard: CardType;
    setCurrentCard: (name: CardType) => void;
    edgePaths: { [key: string]: string };
    setEdgePaths: (edgePaths: { [key: string]: string }) => void;
    nodeHandles: { [key: string]: ImageNodeData["handles"] };
    setNodesHandles: (handles: {
        [key: string]: ImageNodeData["handles"];
    }) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    mode: "view", // default mode
    setMode: (mode: EditorMode) => set(() => ({ mode })),
    showHandles: true, // default value for showHandles
    setShowHandles: (showHandles: boolean) => set(() => ({ showHandles })),
    currentCard: null,
    setCurrentCard: (currentCard: CardType) => set(() => ({ currentCard })),
    edgePaths: {},
    setEdgePaths: (edgePaths: { [key: string]: string }) =>
        set(() => ({ edgePaths })),
    nodeHandles: {},
    setNodesHandles: (nodeHandles: {
        [key: string]: ImageNodeData["handles"];
    }) => set(() => ({ nodeHandles })),
}));
