import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getLineSvg } from "@/components/view/EdgeCardView";
import { useChartStore } from "@/store/chartStore";
import { useViewStore } from "@/store/viewStore";

const VisibilityCard = () => {
    const { edgeVisibility, setEdgeVisibility } = useViewStore();
    const { data } = useChartStore();
    return (
        <Card className="flex flex-col gap-4 p-4">
            {Object.keys(data.relationships).map((key) => (
                <div
                    className="flex flex-row justify-between w-full items-center gap-10"
                    key={key}
                >
                    <div className="flex flex-row gap-2">
                        {getLineSvg(data.relationships[key], "none")}
                        <div>{key.toLowerCase()}</div>
                    </div>
                    <Checkbox
                        checked={edgeVisibility[key]}
                        onCheckedChange={(checked) =>
                            setEdgeVisibility({
                                ...edgeVisibility,
                                [key]: checked as boolean,
                            })
                        }
                    />
                </div>
            ))}
        </Card>
    );
};

export default VisibilityCard;
