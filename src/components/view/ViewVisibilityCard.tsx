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
            <div className="flex flex-row justify-between items-center">
                <Label htmlFor="edge-new">Show new edges only</Label>
                <Checkbox
                    id="edge-new"
                    checked={edgeVisibility.new}
                    onCheckedChange={(checked) =>
                        setEdgeVisibility({
                            ...edgeVisibility,
                            new: checked as boolean,
                        })
                    }
                />
            </div>
            <div className="flex flex-row justify-between items-center">
                <span className="font-bold">Edge visibility</span>
                <Checkbox
                    id="edge-all"
                    checked={Object.values(edgeVisibility).every((v) => v)}
                    onCheckedChange={(checked) => {
                        const newEdgeVisibility = Object.keys(
                            edgeVisibility
                        ).reduce((acc, key) => {
                            acc[key] = checked as boolean;
                            return acc;
                        }, {} as Record<string, boolean>);
                        setEdgeVisibility(newEdgeVisibility);
                    }}
                />
            </div>
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
            <div className="flex flex-row justify-between">
                <span>Team toggles</span>
                <Checkbox
                    id="team-all"
                    checked={Object.values(teamVisibility).every((v) => v)}
                    onCheckedChange={(checked) => {
                        const newTeamVisibility = Object.keys(
                            teamVisibility
                        ).reduce((acc, key) => {
                            acc[key] = checked as boolean;
                            return acc;
                        }, {} as Record<string, boolean>);
                        setTeamVisibility(newTeamVisibility);
                    }}
                />
            </div>
            {Object.keys(data.teams).map((key) => (
                <div
                    className="flex flex-row justify-between w-full items-center gap-10"
                    key={key}
                >
                    <div className="flex flex-row gap-2 items-center">
                        <img
                            src={data.teams[key].imageSrc}
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
            <div className="flex flex-row justify-between">
                <span>Character toggles</span>
                <Checkbox
                    id="character-all"
                    checked={Object.values(characterVisibility).every((v) => v)}
                    onCheckedChange={(checked) => {
                        const newCharacterVisibility = Object.keys(
                            characterVisibility
                        ).reduce((acc, key) => {
                            acc[key] = checked as boolean;
                            return acc;
                        }, {} as Record<string, boolean>);
                        setCharacterVisibility(newCharacterVisibility);
                    }}
                />
            </div>
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
