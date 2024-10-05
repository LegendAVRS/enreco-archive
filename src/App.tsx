import { useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import DevTools from "./DevTool/DevTools";
import ImageNode from "@/components/ImageNode";
import SmartStepEdge from "@/SmartStuff/SmartStepEdge";
import { dummyData } from "@/lib/dummy";
import { calculateHandles, calculatePositions } from "@/lib/helper";
import { ReactFlow } from "@xyflow/react";

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
                maxZoom={3}
            >
                <DevTools></DevTools>
            </ReactFlow>
        </div>
    );
};

export default App;
