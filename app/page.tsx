import ViewApp from "@/ViewApp";
import { ReactFlowProvider } from "@xyflow/react";

const Page = () => {
    return (
        <ReactFlowProvider>
            {/* <EditorApp /> */}
            <ViewApp />
        </ReactFlowProvider>
    );
};

export default Page;
