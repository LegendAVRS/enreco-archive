import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import VisibilityToggle from "@/components/VisibilityToggle";
import { useChartContext } from "@/context/useChartContext";
import { getEdgeStyle } from "@/lib/helper";
import { RelationshipType, relationshipTypes } from "@/lib/type";

const getEdgeSvg = (type: string, relationshipTypes: RelationshipType) => {
    const style = getEdgeStyle(type, relationshipTypes);
    const width = 30,
        height = 2;
    return (
        <svg width={width} height={height}>
            <path
                fill="none"
                strokeWidth={height}
                d={`M0 0 L${width} 0`}
                {...style}
            />
        </svg>
    );
};

function TemporaryCard() {
    const { edgeVisibilities, setEdgeVisibilities } = useChartContext();
    return (
        <Card className="flex-col gap-4 p-4 absolute right-5 top-1/2 -translate-y-1/2">
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="day-1">Day 1</SelectItem>
                    <SelectItem value="day-2">Day 2</SelectItem>
                    <SelectItem value="day-3">Day 3</SelectItem>
                </SelectContent>
            </Select>
            <div className="">
                <span className="font-bold text-2xl">Relationships</span>
                <div className="flex-col">
                    <VisibilityToggle
                        onClick={() => {
                            setEdgeVisibilities({
                                ...edgeVisibilities,
                                romantic: !edgeVisibilities["romantic"],
                            });
                        }}
                        checked={edgeVisibilities["romantic"]}
                    >
                        {/* <img
                            className="aspect-square"
                            width={20}
                            src="https://png.pngtree.com/png-vector/20240310/ourmid/pngtree-fallen-green-leaf-element-png-image_11926275.png"
                        /> */}
                        {getEdgeSvg("romantic", relationshipTypes)}
                        <span>Romantic</span>
                    </VisibilityToggle>
                </div>
            </div>
        </Card>
    );
}

export default TemporaryCard;
