import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ReactFlowProvider } from "@xyflow/react";
import { EditorProvider } from "@/context/EditorProvider.tsx";
import { ChartProvider } from "@/context/chartProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ReactFlowProvider>
            <ChartProvider>
                <EditorProvider>
                    <App />
                </EditorProvider>
            </ChartProvider>
        </ReactFlowProvider>
    </StrictMode>
);
