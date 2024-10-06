import { EditorContext, EditorContextProps } from "@/context/EditorProvider";
import { useContext } from "react";

export const useEditorContext = (): EditorContextProps => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error(
            "useEditorContext must be used within an EditorProvider"
        );
    }
    return context;
};
