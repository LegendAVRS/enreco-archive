import { ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DevTools from "./DevTool/DevTools";
import ImageNode from "./ImageNode";
import { dummyData } from "./libs/dummy";

const nodeTypes = {
    image: ImageNode,
};

const App = () => {
    const data = dummyData;
    const [nodes, , onNodesChange] = useNodesState(data.nodes);
    const [edges, , onEdgesChange] = useEdgesState(data.edges);
    return (
        <div className="w-screen h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                snapGrid={[15, 15]}
                snapToGrid={true}
                fitView
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
            >
                <DevTools></DevTools>
            </ReactFlow>
        </div>
    );
};

export default App;
