import { create } from "zustand";

export type CardType = "node" | "edge" | "setting" | null;

interface ViewState {
    currentCard: CardType;
    setCurrentCard: (name: CardType) => void;
    edgeVisibility: { [key: string]: boolean };
    setEdgeVisibility: (edgeVisibility: { [key: string]: boolean }) => void;
}

export const useViewStore = create<ViewState>((set) => ({
    currentCard: null,
    setCurrentCard: (currentCard: CardType) => set(() => ({ currentCard })),
    edgeVisibility: {},
    setEdgeVisibility: (edgeVisibility: { [key: string]: boolean }) =>
        set(() => ({ edgeVisibility })),
}));
