import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ReactFlowProvider } from "@xyflow/react";
import { ChartProvider } from "@/context/ChartProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ReactFlowProvider>
            <ChartProvider>
                <App />
            </ChartProvider>
        </ReactFlowProvider>
    </StrictMode>
);
