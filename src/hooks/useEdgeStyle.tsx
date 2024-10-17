import { useChartStore } from "@/store/chartStore";

const useEdgeStyle = (type: string | undefined) => {
    const { relationships } = useChartStore();
    if (!type) {
        return {};
    }
    return {
        edgeStyle: relationships[type],
    };
};

export default useEdgeStyle;
