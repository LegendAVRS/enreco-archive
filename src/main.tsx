import { ReactFlowProvider } from "@xyflow/react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ViewApp from "@/ViewApp.tsx";

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
    <ReactFlowProvider>
        {/* <App /> */}
        <ViewApp />
    </ReactFlowProvider>
    // </StrictMode>
);
