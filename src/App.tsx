import { useEditorContext } from "@/context/useEditorContext";
import useEditor from "@/hooks/useEditor";
import useKeyboard from "@/hooks/useKeyboard";
import { ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
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
    const [edges, , onEdgesChange] = useEdgesState(data.edges);
    const { addNode, deleteElement } = useEditor(nodes, setNodes);
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
            console.log("view");
            return;
        }
        if (mode === "edit") {
            console.log("edit");
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
                snapToGrid
                snapGrid={[100, 100]}
            >
                <DevTools></DevTools>
            </ReactFlow>
            <div className="top-10 right-5 absolute">{mode}</div>
            <Sidebar></Sidebar>
        </div>
    );
};

export default App;
