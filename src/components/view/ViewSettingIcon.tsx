import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/viewStore";
import { Settings } from "lucide-react";

interface ViewSettingIconProps {
    className?: string;
}

const ViewSettingIcon = ({ className }: ViewSettingIconProps) => {
    const { currentCard, setCurrentCard } = useViewStore();
    return (
        <div
            className={cn("p-4  cursor-pointer hover:opacity-80", className)}
            onClick={() =>
                setCurrentCard(currentCard === "setting" ? null : "setting")
            }
        >
            <Settings size={24} />
        </div>
    );
};

export default ViewSettingIcon;
