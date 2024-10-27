import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getLineSvg } from "@/components/view/ViewEdgeCard";
import { useChartStore } from "@/store/chartStore";
import { useViewStore } from "@/store/viewStore";

const ViewVisibilityCard = () => {
    const {
        edgeVisibility,
        setEdgeVisibility,
        teamVisibility,
        setTeamVisibility,
        characterVisibility,
        setCharacterVisibility,
    } = useViewStore();
    const { data } = useChartStore();
    return (
        <Card className="flex flex-col gap-4 p-4 h-[500px] overflow-y-auto">
            <span className="font-bold">Edge visibility</span>
            {Object.keys(data.relationships).map((key) => (
                <div
                    className="flex flex-row justify-between w-full items-center gap-10"
                    key={key}
                >
                    <div className="flex flex-row gap-2">
                        {getLineSvg(data.relationships[key])}
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
            <span>Team toggles</span>
            {Object.keys(data.teams).map((key) => (
                <div
                    className="flex flex-row justify-between w-full items-center gap-10"
                    key={key}
                >
                    <div className="flex flex-row gap-2">
                        <img src={data.teams[key].imgSrc} className="w-8 h-8" />
                        <div>{key.toLowerCase()}</div>
                    </div>
                    <Checkbox
                        checked={teamVisibility[key]}
                        onCheckedChange={(checked) =>
                            setTeamVisibility({
                                ...teamVisibility,
                                [key]: checked as boolean,
                            })
                        }
                    />
                </div>
            ))}
            <span>Character toggles</span>
            {Object.keys(characterVisibility).map((key) => (
                <div
                    className="flex flex-row justify-between w-full items-center gap-10"
                    key={key}
                >
                    <div>{key}</div>
                    <Checkbox
                        checked={characterVisibility[key]}
                        onCheckedChange={(checked) =>
                            setCharacterVisibility({
                                ...characterVisibility,
                                [key]: checked as boolean,
                            })
                        }
                    />
                </div>
            ))}
        </Card>
    );
};

export default ViewVisibilityCard;
