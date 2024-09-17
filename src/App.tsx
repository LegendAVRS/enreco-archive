import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DevTools from "./DevTool/DevTools";
import { dummyData } from "./libs/dummy";
import ImageNode from "./ImageNode";
import { useEffect } from "react";
import { calculateHandlers } from "./libs/helper";

const nodeTypes = {
    imageNode: ImageNode,
};

const App = () => {
    const data = dummyData;
    useEffect(() => {
        calculateHandlers(data);
        console.log(data);
    }, [data]);
    return (
        <div className="w-screen h-screen">
            <ReactFlow
                nodes={data.nodes}
                edges={data.edges}
                nodeTypes={nodeTypes}
                snapGrid={[15, 15]}
                snapToGrid={true}
                fitView
            >
                <DevTools></DevTools>
            </ReactFlow>
        </div>
    );
};

export default App;
