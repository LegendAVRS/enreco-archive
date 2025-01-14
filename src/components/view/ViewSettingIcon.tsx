import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/viewStore";
import Image from "next/image";

interface ViewSettingIconProps {
    className?: string;
}

const ViewSettingIcon = ({ className }: ViewSettingIconProps) => {
    const { currentCard, setCurrentCard } = useViewStore();
    return (
        <div
            className={cn(
                "p-4 transition-all cursor-pointer hover:opacity-80 hover:scale-110",
                className
            )}
            onClick={() =>
                setCurrentCard(currentCard === "setting" ? null : "setting")
            }
        >
            <Image
                src="https://cdn.holoen.fans/hefw/media/emblem.webp"
                alt="Settings"
                width={24}
                height={24}
            />
        </div>
    );
};

export default ViewSettingIcon;
