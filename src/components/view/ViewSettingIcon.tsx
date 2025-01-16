import { cn } from "@/lib/utils";
import Image from "next/image";

interface ViewSettingIconProps {
    className?: string;
    onIconClick: () => void
}

const ViewSettingIcon = ({ className, onIconClick }: ViewSettingIconProps) => {
    return (
        <div
            className={cn(
                "p-4 transition-all cursor-pointer hover:opacity-80 hover:scale-110",
                className
            )}
            onClick={onIconClick}
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
