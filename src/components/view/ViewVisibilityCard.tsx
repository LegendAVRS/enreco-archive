import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { extractImageSrcFromNodes, getLineSvg } from "@/lib/utils";
import { useChartStore } from "@/store/chartStore";
import { useViewStore } from "@/store/viewStore";
import { useMemo } from "react";

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
    const characterImagesMap = useMemo(() => {
        const charImgMap = extractImageSrcFromNodes(data.nodes);
        return charImgMap;
    }, [data.nodes]);

    return (
        <Card className="flex flex-col gap-4 p-4 max-h-full overflow-y-auto">
            <span className="font-bold">Edge visibility</span>
            {Object.keys(data.relationships).map((key) => (
                <div
                    className="flex flex-row justify-between w-full items-center gap-10"
                    key={key}
                >
                    <div className="flex flex-row gap-2 items-center">
                        {getLineSvg(data.relationships[key])}
                        <Label
                            htmlFor={`edge-${key.toLowerCase()}`}
                            className="capitalize"
                        >
                            {key.toLowerCase()}
                        </Label>
                    </div>
                    <Checkbox
                        id={`edge-${key.toLowerCase()}`}
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
                    <div className="flex flex-row gap-2 items-center">
                        <img
                            src={data.teams[key].imgSrc}
                            className="w-8 h-8"
                            alt={`${key} logo`}
                        />
                        <Label
                            htmlFor={`team-${key.toLowerCase()}`}
                            className="capitalize"
                        >
                            {key.toLowerCase()}
                        </Label>
                    </div>
                    <Checkbox
                        id={`team-${key.toLowerCase()}`}
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
                    <div className="flex flex-row gap-2 items-center">
                        <img
                            src={characterImagesMap[key]}
                            className="w-8 h-8"
                            alt={`${key} logo`}
                        />
                        <Label
                            htmlFor={`character-${key.toLowerCase()}`}
                            className="capitalize"
                        >
                            {key}
                        </Label>
                    </div>
                    <Checkbox
                        id={`character-${key.toLowerCase()}`}
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
