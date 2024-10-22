import NewCustomEdge from "@/components/editor/EditorCustomEdge";
import EdgeEditorCard from "@/components/editor/EdgeEditorCard";
import GeneralEditorCard from "@/components/editor/GeneralEditorCard";
import NodeEditorCard from "@/components/editor/NodeEditorCard";
import { Button } from "@/components/ui/button";
import useEditor from "@/hooks/useEditor";
import useKeyboard from "@/hooks/useKeyboard";
import { dummyRelationships } from "@/lib/dummy";
import { useEditorStore } from "@/store/editorStore";
import { useFlowStore } from "@/store/flowStore";
import {
    ConnectionLineType,
    ConnectionMode,
    ReactFlow,
    ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState } from "react";
import ImageNode from "./components/editor/ImageNode";
import DevTools from "./DevTool/DevTools";
import EditorCustomEdge from "@/components/editor/EditorCustomEdge";

const nodeTypes = {
    image: ImageNode,
};

const edgeTypes = {
    custom: EditorCustomEdge,
};

const App = () => {
    const { addNode, connectEdge, nodes, onNodesChange, edges, onEdgesChange } =
        useEditor();
    const { mode, currentCard, setCurrentCard, edgePaths } = useEditorStore();
    const { setSelectedNode, setSelectedEdge } = useFlowStore();
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
    useKeyboard();

    const handleClick = (event: React.MouseEvent) => {
        if (mode === "place") {
            addNode(event.clientX, event.clientY);
            return;
        }
    };

    // Export the chart data (nodes and edges) to a json file
    const handleExport = () => {
        if (!rfInstance) {
            return;
        }
        const flow = rfInstance.toObject();
        // in flow's edges, set each edge's path data to the corresponding edge in edgePaths
        flow.edges.forEach((edge) => {
            edge.data.path = edgePaths[edge.id];
        });
        flow.relationships = dummyRelationships;
        // export
        const dataStr = JSON.stringify(flow, null, 2);
        const dataUri =
            "data:application/json;charset=utf-8," +
            encodeURIComponent(dataStr);
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
                onClick={(e) => {
                    handleClick(e);
                }}
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
                onConnect={(params) => {
                    connectEdge(params);
                }}
                snapToGrid
                snapGrid={[50, 50]}
                connectionMode={ConnectionMode.Loose}
                connectionLineType={ConnectionLineType.SmoothStep}
                zoomOnDoubleClick={false}
                onInit={setRfInstance}
            >
                <DevTools></DevTools>
            </ReactFlow>
            {/* <div className="top-10 right-5 absolute">{mode}</div> */}
            <div className="absolute top-5 right-5 flex flex-row gap-4">
                <Button
                    onClick={() => {
                        setCurrentCard("general");
                        setSelectedNode(null);
                        setSelectedEdge(null);
                    }}
                >
                    General
                </Button>
                <Button onClick={handleExport}>Export</Button>
                <Button>{mode}</Button>
            </div>
            {currentCard === "node" && <NodeEditorCard />}
            {currentCard === "edge" && <EdgeEditorCard />}
            {currentCard === "general" && <GeneralEditorCard />}
        </div>
    );
};

export default App;
