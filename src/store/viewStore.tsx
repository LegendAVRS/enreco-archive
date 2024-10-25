import { create } from "zustand";

export type CardType = "node" | "edge" | "setting" | null;

interface ViewState {
    chapter: number;
    setChapter: (chapter: number) => void;
    day: number;
    setDay: (day: number) => void;
    currentCard: CardType;
    setCurrentCard: (name: CardType) => void;
    edgeVisibility: { [key: string]: boolean };
    setEdgeVisibility: (edgeVisibility: { [key: string]: boolean }) => void;
}

export const useViewStore = create<ViewState>((set) => ({
    chapter: 1,
    setChapter: (chapter: number) => set(() => ({ chapter })),
    day: 1,
    setDay: (day: number) => set(() => ({ day })),
    currentCard: null,
    setCurrentCard: (currentCard: CardType) => set(() => ({ currentCard })),
    edgeVisibility: {},
    setEdgeVisibility: (edgeVisibility: { [key: string]: boolean }) =>
        set(() => ({ edgeVisibility })),
}));
