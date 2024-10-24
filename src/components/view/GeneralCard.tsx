import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const GeneralCard = () => {
    return (
        <Card className="flex flex-col gap-4 w-full">
            <Button>Info</Button>
            <div className="flex flex-row gap-4">
                <Select>
                    <SelectTrigger className="grow" />
                </Select>
            </div>
            <Separator />
        </Card>
    );
};

export default GeneralCard;
