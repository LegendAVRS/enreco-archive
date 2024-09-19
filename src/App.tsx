import { SmartStepEdge } from "@tisoap/react-flow-smart-edge";
import { useEffect, useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import DevTools from "./DevTool/DevTools";
import ImageNode from "./ImageNode";
import { dummyData } from "./libs/dummy";
import { calculateHandles, calculatePositions } from "./libs/helper";

const nodeTypes = {
    imageNode: ImageNode,
};

const edgeTypes = {
    smart: SmartStepEdge,
};

const App = () => {
    const data = dummyData;
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        calculateHandles(data);
        calculatePositions(data);
        setLoading(false);
    }, [data]);
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-screen h-screen">
            <ReactFlow
                nodes={data.nodes}
                edges={data.edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                draggable={false}
                fitView
            >
                <DevTools></DevTools>
            </ReactFlow>
        </div>
    );
};

export default App;
