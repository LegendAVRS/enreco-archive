import { useChartStore } from "@/store/chartStore";

const useEdgeStyle = (type: string | undefined) => {
    const { data } = useChartStore();
    if (!type) {
        return {};
    }
    return {
        edgeStyle: data.relationships[type],
    };
};

export default useEdgeStyle;
