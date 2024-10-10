import { useChartContext } from "@/context/useChartContext";

const useEdgeStyle = (type: string | undefined) => {
    const { relationships } = useChartContext();
    if (!type) {
        return {};
    }
    return {
        edgeStyle: relationships[type],
    };
};

export default useEdgeStyle;
