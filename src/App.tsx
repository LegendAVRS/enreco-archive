import GeneralEditorCard from "@/components/GeneralEditorCard";
import useEditor from "@/hooks/useEditor";
import useKeyboard from "@/hooks/useKeyboard";
import { ConnectionLineType, ConnectionMode, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ImageNode from "./components/ImageNode";
import DevTools from "./DevTool/DevTools";
import NewCustomEdge from "@/components/AnotherCustomEdge";
import EdgeEditorCard from "@/components/EdgeEditorCard";
import { useEditorStore } from "@/store/editorStore";
import NodeEditorCard from "@/components/NodeEditorCard";
import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/store/flowStore";

const nodeTypes = {
    image: ImageNode,
};

const edgeTypes = {
    custom: NewCustomEdge,
};

const App = () => {
    const { addNode, connectEdge, nodes, onNodesChange, edges, onEdgesChange } =
        useEditor();
    const { mode, currentCard, setCurrentCard } = useEditorStore();
    const { setSelectedNode, setSelectedEdge } = useFlowStore();

    useKeyboard();

    const handleClick = (event: React.MouseEvent) => {
        if (mode === "place") {
            addNode(event.clientX, event.clientY);
            return;
        }
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
                onNodeClick={(e, node) => {
                    setCurrentCard("node");
                    setSelectedNode(node);
                    setSelectedEdge(null);
                }}
                onEdgeClick={(e, edge) => {
                    setCurrentCard("edge");
                    console.log(edge);
                    setSelectedEdge(edge);
                    setSelectedNode(null);
                }}
                onConnect={(params) => {
                    connectEdge(params);
                }}
                snapToGrid
                snapGrid={[100, 100]}
                connectionMode={ConnectionMode.Loose}
                connectionLineType={ConnectionLineType.SmoothStep}
            >
                <DevTools></DevTools>
            </ReactFlow>
            {/* <div className="top-10 right-5 absolute">{mode}</div> */}
            <Button
                className="absolute top-5 right-5"
                onClick={() => {
                    setCurrentCard("general");
                    setSelectedNode(null);
                    setSelectedEdge(null);
                }}
            >
                General
            </Button>
            {currentCard === "node" && <NodeEditorCard />}
            {currentCard === "edge" && <EdgeEditorCard />}
            {currentCard === "general" && <GeneralEditorCard />}
        </div>
    );
};

export default App;
