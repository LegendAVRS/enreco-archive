import React from "react";
import ViewApp from "@/ViewApp";
import { ReactFlowProvider } from "@xyflow/react";

const Page = () => {
    return (
        <ReactFlowProvider>
            <ViewApp />
        </ReactFlowProvider>
    );
};

export default Page;
