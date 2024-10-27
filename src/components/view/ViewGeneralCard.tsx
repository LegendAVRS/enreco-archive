import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const ViewGeneralCard = () => {
    return (
        <Card className="flex flex-col gap-4 p-4">
            <Button variant={"outline"}>Info</Button>
            <div className="flex flex-row gap-4">
                <Select>
                    <SelectTrigger className="grow">
                        <SelectValue placeholder={"Chapter..."} />
                    </SelectTrigger>
                </Select>
                <Select>
                    <SelectTrigger className="grow">
                        <SelectValue placeholder={"Day..."} />
                    </SelectTrigger>
                </Select>
            </div>
            <Separator />
        </Card>
    );
};

export default ViewGeneralCard;
