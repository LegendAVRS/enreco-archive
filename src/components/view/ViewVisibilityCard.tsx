import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Chapter, ImageNodeType, StringToBooleanObjectMap } from "@/lib/type";
import { extractImageSrcFromNodes, getLineSvg } from "@/lib/utils";
import { useMemo } from "react";

interface Props {
    edgeVisibility: StringToBooleanObjectMap;
    onEdgeVisibilityChange: (
        newEdgeVisibility: StringToBooleanObjectMap,
    ) => void;
    teamVisibility: StringToBooleanObjectMap;
    onTeamVisibilityChange: (
        newTeamVisibility: StringToBooleanObjectMap,
    ) => void;
    characterVisibility: { [key: string]: boolean };
    onCharacterVisibilityChange: (
        newCharacterVisibility: StringToBooleanObjectMap,
    ) => void;
    chapterData: Chapter;
    nodes: ImageNodeType[];
}

const ViewVisibilityCard = ({
    edgeVisibility,
    onEdgeVisibilityChange,
    teamVisibility,
    onTeamVisibilityChange,
    characterVisibility,
    onCharacterVisibilityChange,
    chapterData,
    nodes,
}: Props) => {
    // Extract image src from nodes
    const characterImagesMap = useMemo(() => {
        const charImgMap = extractImageSrcFromNodes(nodes);
        return charImgMap;
    }, [nodes]);

    return (
        <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
            <span className="font-bold text-xl">Visibility toggles</span>
            <div className="flex flex-row justify-between items-center">
                <Label htmlFor="edge-all">
                    <span className="font-bold">Edge visibility</span>
                </Label>

                <Checkbox
                    id="edge-all"
                    checked={Object.keys(edgeVisibility).every((key) => {
                        return key === "new" ? true : edgeVisibility[key];
                    })}
                    onCheckedChange={(checked) => {
                        const newEdgeVisibility = Object.keys(
                            edgeVisibility,
                        ).reduce(
                            (acc, key) => {
                                if (key === "new") {
                                    acc[key] = true;
                                } else {
                                    acc[key] = checked as boolean;
                                }
                                return acc;
                            },
                            {} as Record<string, boolean>,
                        );
                        onEdgeVisibilityChange(newEdgeVisibility);
                    }}
                />
            </div>
            <div className="flex flex-row justify-between items-center">
                <Label htmlFor="edge-new">Show new edges only</Label>
                <Checkbox
                    id="edge-new"
                    checked={edgeVisibility.new}
                    onCheckedChange={(checked) =>
                        onEdgeVisibilityChange({
                            ...edgeVisibility,
                            new: checked as boolean,
                        })
                    }
                />
            </div>
            {Object.keys(chapterData.relationships).map((key) => (
                <div
                    className="flex flex-row justify-between w-full items-center gap-10"
                    key={key}
                >
                    <Label htmlFor={`edge-${key.toLowerCase()}`}>
                        <div className="flex flex-row gap-2 items-center">
                            {getLineSvg(chapterData.relationships[key].style)}
                            <span className="capitalize">
                                {key.toLowerCase()}
                            </span>
                        </div>
                    </Label>

                    <Checkbox
                        id={`edge-${key.toLowerCase()}`}
                        checked={edgeVisibility[key]}
                        onCheckedChange={(checked) =>
                            onEdgeVisibilityChange({
                                ...edgeVisibility,
                                [key]: checked as boolean,
                            })
                        }
                    />
                </div>
            ))}
            <div className="flex flex-row justify-between items-center">
                <Label htmlFor="team-all">
                    <span className="font-bold">Team toggles</span>
                </Label>

                <Checkbox
                    id="team-all"
                    checked={Object.values(teamVisibility).every((v) => v)}
                    onCheckedChange={(checked) => {
                        const newTeamVisibility = Object.keys(
                            teamVisibility,
                        ).reduce(
                            (acc, key) => {
                                acc[key] = checked as boolean;
                                return acc;
                            },
                            {} as Record<string, boolean>,
                        );
                        onTeamVisibilityChange(newTeamVisibility);
                    }}
                />
            </div>
            {Object.keys(chapterData.teams).map((key) => (
                <div
                    className="flex flex-row justify-between w-full items-center gap-10"
                    key={key}
                >
                    <Label htmlFor={`team-${key.toLowerCase()}`}>
                        <div className="flex flex-row gap-2 items-center">
                            <img
                                src={chapterData.teams[key].teamIconSrc}
                                className="w-8 h-8"
                                alt={`${key} logo`}
                            />
                            <span className="capitalize">
                                {key.toLowerCase()}
                            </span>
                        </div>
                    </Label>

                    <Checkbox
                        id={`team-${key.toLowerCase()}`}
                        checked={teamVisibility[key]}
                        onCheckedChange={(checked) =>
                            onTeamVisibilityChange({
                                ...teamVisibility,
                                [key]: checked as boolean,
                            })
                        }
                    />
                </div>
            ))}
            <div className="flex flex-row justify-between items-center">
                <Label htmlFor="character-all">
                    <span className="font-bold">Character toggles</span>
                </Label>

                <Checkbox
                    id="character-all"
                    checked={Object.values(characterVisibility).every((v) => v)}
                    onCheckedChange={(checked) => {
                        const newCharacterVisibility = Object.keys(
                            characterVisibility,
                        ).reduce(
                            (acc, key) => {
                                acc[key] = checked as boolean;
                                return acc;
                            },
                            {} as Record<string, boolean>,
                        );
                        onCharacterVisibilityChange(newCharacterVisibility);
                    }}
                />
            </div>
            {Object.keys(characterVisibility).map((key) => (
                <div
                    className="flex flex-row justify-between w-full items-center gap-10"
                    key={key}
                >
                    <Label htmlFor={`character-${key.toLowerCase()}`}>
                        <div className="flex flex-row gap-2 items-center">
                            <img
                                src={characterImagesMap[key]}
                                className="w-8 h-8"
                                alt={`${key} logo`}
                            />
                            <span className="capitalize">{key}</span>
                        </div>
                    </Label>

                    <Checkbox
                        id={`character-${key.toLowerCase()}`}
                        checked={characterVisibility[key]}
                        onCheckedChange={(checked) =>
                            onCharacterVisibilityChange({
                                ...characterVisibility,
                                [key]: checked as boolean,
                            })
                        }
                    />
                </div>
            ))}
        </div>
    );
};

export default ViewVisibilityCard;
