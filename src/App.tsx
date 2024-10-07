import { useEditorContext } from "@/context/useEditorContext";
import useEditor from "@/hooks/useEditor";
import useKeyboard from "@/hooks/useKeyboard";
import {
    ConnectionMode,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ImageNode from "./components/ImageNode";
import Sidebar from "./components/Sidebar";
import DevTools from "./DevTool/DevTools";
import { dummyData } from "./lib/dummy";

const nodeTypes = {
    image: ImageNode,
};

const App = () => {
    const data = dummyData;
    const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);
    const { addNode, deleteElement, connectEdge } = useEditor(nodes, setNodes);
    const { mode } = useEditorContext();

    useKeyboard();

    const handleClick = (event: React.MouseEvent) => {
        if (mode === "place") {
            addNode(event.clientX, event.clientY);
            return;
        }
        if (mode === "delete") {
            deleteElement();
            return;
        }
        if (mode === "view") {
            return;
        }
        if (mode === "edit") {
            return;
        }
    };

    return (
        <div className="w-screen h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodesDraggable={mode === "edit"}
                onClick={(e) => {
                    handleClick(e);
                }}
                onConnect={(params) => {
                    connectEdge(params, setEdges);
                }}
                snapToGrid
                snapGrid={[100, 100]}
                connectionMode={ConnectionMode.Loose}
            >
                <DevTools></DevTools>
            </ReactFlow>
            <div className="top-10 right-5 absolute">{mode}</div>
            <Sidebar></Sidebar>
        </div>
    );
};

export default App;
