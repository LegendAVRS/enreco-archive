import { ReactFlowProvider } from "@xyflow/react";
import { createRoot } from "react-dom/client";
import EditorApp from "./EditorApp.tsx";
import "./index.css";
import ViewApp from "@/ViewApp.tsx";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <ReactFlowProvider>
        <EditorApp />
        {/* <ViewApp /> */}
    </ReactFlowProvider>
    // </StrictMode>
);
