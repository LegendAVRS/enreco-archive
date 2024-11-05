import ViewApp from "@/ViewApp.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EditorApp from "@/EditorApp";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <ReactFlowProvider>
        <EditorApp />
        {/* <ViewApp /> */}
    </ReactFlowProvider>
    // </StrictMode>
);
