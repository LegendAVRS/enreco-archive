import {
    EdgeMouseHandler,
    NodeMouseHandler,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback } from "react";
import DevTools from "./DevTool/DevTools";
import { dummyData } from "./libs/dummy";
import ImageNode from "./ImageNode";

const nodeTypes = {
    image: ImageNode,
};

const App = () => {
    const data = dummyData;
    const [nodes, , onNodesChange] = useNodesState(data.nodes);
    const [edges, , onEdgesChange] = useEdgesState(data.edges);
    const { fitView, setCenter, getNode } = useReactFlow();

    const handleNodeClick = useCallback<NodeMouseHandler>(
        (_, node) => {
            fitView({ nodes: [node], duration: 500 });
        },
        [fitView]
    );

    const handleEdgeClick = useCallback<EdgeMouseHandler>(
        (_, edge) => {
            const nodeA = getNode(edge.source);
            const nodeB = getNode(edge.target);
            if (nodeA && nodeB) {
                setCenter(
                    (nodeA.position.x + nodeB.position.x) / 2,
                    (nodeA.position.y + nodeB.position.y) / 2,
                    {
                        duration: 500,
                    }
                );
            }
        },
        [setCenter, getNode]
    );

    return (
        <div className="w-screen h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                onEdgeClick={handleEdgeClick}
            >
                <DevTools></DevTools>
            </ReactFlow>
        </div>
    );
};

export default App;
