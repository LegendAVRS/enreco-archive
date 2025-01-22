import * as Tooltip from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button"
import { twMerge } from "tailwind-merge";

interface IconButtonProps {
    id?: string;
    tooltipText: string;
    imageSrc: string;
    enabled: boolean;
    className?: string;
    imageClassName?: string;
    tooltipSide?: "top" | "right" | "bottom" | "left"
    onClick: () => void;
}

export function IconButton({
    id,
    tooltipText,
    imageSrc,
    enabled,
    className,
    imageClassName,
    tooltipSide = "top",
    onClick
}: IconButtonProps) {
    return (
        <Tooltip.Provider delayDuration={500}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button id={id} className={twMerge("w-auto h-8 rounded-full aspect-square p-0", className || "")} variant="outline" disabled={!enabled} onClick={() => onClick()}>
                        <img className={twMerge("w-[90%] h-[90%]", imageClassName)} src={imageSrc} />
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className="bg-black rounded-md z-20" side={tooltipSide} sideOffset={5}>
                        <span className="mx-2 text-white">{ tooltipText }</span>
                        <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
