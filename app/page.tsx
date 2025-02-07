import EditorApp from "@/components/editor/EditorApp";
import { ViewAppWrapper } from "@/ViewAppWrapper";
import { ReactFlowProvider } from "@xyflow/react";

const USE_EDITOR = false;
const inDevEnvironment = !!process && process.env.NODE_ENV === "development";

const Page = () => {
    if (USE_EDITOR && inDevEnvironment) {
        return (
            <ReactFlowProvider>
                <EditorApp />
            </ReactFlowProvider>
        );
    }

    return (
        <ReactFlowProvider>
            <ViewAppWrapper />
        </ReactFlowProvider>
    );
};

export default Page;
