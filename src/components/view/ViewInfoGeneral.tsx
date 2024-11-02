import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const ViewInfoGeneral = () => {
    return (
        <div>
            <div className="">
                Before we start, consider turning on the BGM to furhter immerse
                yourself
            </div>
            <div className="flex items-center flex-row justify-between">
                <div>Allow Background Music</div>
                <Checkbox />
            </div>
            <Separator />
            <div>
                Welcome to{" "}
                <span className="font-semibold">ENReco Archive!</span> A
                fan-made project created with the goal to recollect, archive all
                the events that transpired in Hololive English's long running
                project Enigmatic Recollection
            </div>
        </div>
    );
};

export default ViewInfoGeneral;
