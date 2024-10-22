import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { getLineSvg } from "@/components/view/EdgeCardView";
import { useChartStore } from "@/store/chartStore";
import { useViewStore } from "@/store/viewStore";

const SettingCard = () => {
    const { edgeVisibility, setEdgeVisibility } = useViewStore();
    const { data } = useChartStore();
    return (
        <Card className="flex flex-col shadow-xl bg-white items-center gap-4 absolute right-10 px-4 py-4 top-1/2 -translate-y-1/2 max-w-[300px] max-h-[500px]">
            <h1 className="font-bold text-xl">Settings</h1>
            <Separator />
            <div className="font-semibold">Edge Visibility</div>
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
                                [key]: checked,
                            })
                        }
                    />
                </div>
            ))}
        </Card>
    );
};

export default SettingCard;
