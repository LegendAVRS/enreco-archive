import { useChartStore } from "@/store/chartStore";

import { CSSProperties } from "react";

const useEdgeStyle = (
    type: string | undefined
): { edgeStyle: CSSProperties } => {
    const { data } = useChartStore();
    if (!type) {
        return {
            edgeStyle: {},
        };
    }
    return {
        edgeStyle: data.relationships[type],
    };
};

export default useEdgeStyle;
