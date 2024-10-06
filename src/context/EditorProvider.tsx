import React, { createContext, useState, ReactNode } from "react";

export type EditorMode = "edit" | "view" | "place" | "delete";

export interface EditorContextProps {
    mode: EditorMode;
    setMode: (mode: EditorMode) => void;
}

export const EditorContext = createContext<EditorContextProps | undefined>(
    undefined
);

export interface EditorProviderProps {
    children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<EditorMode>("view");
    return (
        <EditorContext.Provider value={{ mode, setMode }}>
            {children}
        </EditorContext.Provider>
    );
};
