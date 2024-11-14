import React from "react";
import ViewApp from "@/ViewApp";
import EditorApp from "@/components/editor/EditorApp";
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
