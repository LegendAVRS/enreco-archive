import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ReactFlowProvider } from "@xyflow/react";
import { EditorProvider } from "@/context/EditorProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ReactFlowProvider>
            <EditorProvider>
                <App />
            </EditorProvider>
        </ReactFlowProvider>
    </StrictMode>
);
