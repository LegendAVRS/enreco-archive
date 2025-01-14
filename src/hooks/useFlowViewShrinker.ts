import { useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

export function useFlowViewShrinker() {
    const [ widthToShrink, setWidthToShrink ] = useState(0);
    const { fitView } = useReactFlow();

    useEffect(() => {
        const reactFlowRenderer = document.querySelector<HTMLDivElement>(
            ".react-flow__renderer"
        );
        if (reactFlowRenderer && !isMobile) {
            reactFlowRenderer.style.width = `calc(100% - ${widthToShrink}px)`;
        }

        // Need a slight delay to make sure the width is updated before fitting the view
        setTimeout(() => {
            fitView({ padding: 0.5, duration: 1000 });
        }, 50);
    }, [fitView, widthToShrink]);

    const shrinkFlowView = (newWidthToShrink: number) => {
        setWidthToShrink(newWidthToShrink);
    };

    const resetFlowView = () => {
        setWidthToShrink(0);
    };

    return { shrinkFlowView, resetFlowView };
}