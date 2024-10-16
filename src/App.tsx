import EditorCard from "@/components/EditorCard";
import { useEditorContext } from "@/context/useEditorContext";
import useEditor from "@/hooks/useEditor";
import useKeyboard from "@/hooks/useKeyboard";
import { ConnectionLineType, ConnectionMode, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ImageNode from "./components/ImageNode";
import DevTools from "./DevTool/DevTools";
import NewCustomEdge from "@/components/AnotherCustomEdge";
import EdgeEditorCard from "@/components/EdgeEditorCard";

const nodeTypes = {
    image: ImageNode,
};

const edgeTypes = {
    custom: NewCustomEdge,
};

const App = () => {
    const {
        addNode,
        deleteElement,
        connectEdge,
        nodes,
        onNodesChange,
        edges,
        onEdgesChange,
    } = useEditor();
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
    console.log(edges);

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
            <div className="top-10 right-5 absolute">{mode}</div>
            {/* <Sidebar></Sidebar> */}
            {/* <EdgeEditorCard /> */}
            <EditorCard />
        </div>
    );
};

export default App;
