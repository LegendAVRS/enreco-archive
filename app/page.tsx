import { ViewAppWrapper } from "@/ViewAppWrapper";
import { ReactFlowProvider } from "@xyflow/react";

const Page = () => {
    return (
        <ReactFlowProvider>
            {/* <EditorApp /> */}
            <ViewAppWrapper />
        </ReactFlowProvider>
    );
};

export default Page;
