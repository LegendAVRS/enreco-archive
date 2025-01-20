import * as Tooltip from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button"
import { twMerge } from "tailwind-merge";

interface IconButtonProps {
    tooltipText: string;
    imageSrc: string;
    enabled: boolean;
    className?: string;
    imageClassName?: string;
    onClick: () => void;
}

export function IconButton({
    tooltipText,
    imageSrc,
    enabled,
    className,
    imageClassName,
    onClick
}: IconButtonProps) {
    return (
        <Tooltip.Provider delayDuration={500}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button className={twMerge("w-fit rounded-full", className || "")} variant="outline" disabled={!enabled} onClick={() => onClick()}>
                        <img className={twMerge("min-w-4 min-h-4 w-4 h-4", imageClassName)} src={imageSrc} />
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className="bg-black rounded-md" sideOffset={5}>
                        <span className="mx-2 text-white">{ tooltipText }</span>
                        <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
