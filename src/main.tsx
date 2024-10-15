import { ChartProvider } from "@/context/ChartProvider.tsx";
import { EditorProvider } from "@/context/EditorProvider.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <ReactFlowProvider>
        <ChartProvider>
            <EditorProvider>
                <App />
            </EditorProvider>
        </ChartProvider>
    </ReactFlowProvider>
    // </StrictMode>
);
