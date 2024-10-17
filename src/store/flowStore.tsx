import { CustomEdgeProps, CustomEdgeType, ImageNodeType } from "@/lib/type";
import { create } from "zustand";

interface FlowState {
    selectedNode: ImageNodeType | null;
    setSelectedNode: (node: ImageNodeType | null) => void;
    selectedEdge: CustomEdgeType | null;
    setSelectedEdge: (edge: CustomEdgeType | null) => void;
}

export const useFlowStore = create<FlowState>((set) => ({
    selectedNode: null,
    setSelectedNode: (node: ImageNodeType | null) =>
        set(() => ({ selectedNode: node })),
    selectedEdge: null,
    setSelectedEdge: (edge: CustomEdgeType | null) =>
        set(() => ({ selectedEdge: edge })),
}));
