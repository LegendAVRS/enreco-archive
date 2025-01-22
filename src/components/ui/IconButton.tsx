import * as Tooltip from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import clsx from "clsx";

interface IconButtonProps {
    id?: string;
    tooltipText: string;
    icon: ReactNode;
    enabled: boolean;
    className?: string;
    tooltipSide?: "top" | "right" | "bottom" | "left";
    onClick: () => void;
}

export function IconButton({
    id,
    tooltipText,
    icon,
    enabled,
    className,
    tooltipSide = "top",
    onClick,
}: IconButtonProps) {
    return (
        <Tooltip.Provider delayDuration={500}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button
                        id={id}
                        className={clsx("h-8 rounded-full p-2", className)}
                        variant="outline"
                        disabled={!enabled}
                        onClick={() => onClick()}
                    >
                        {icon}
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="bg-black rounded-md z-20"
                        side={tooltipSide}
                        sideOffset={5}
                    >
                        <span className="mx-2 text-white">{tooltipText}</span>
                        <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
