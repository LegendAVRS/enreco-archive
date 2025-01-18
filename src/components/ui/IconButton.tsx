import * as Tooltip from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button"

interface IconButtonProps {
    tooltipText: string;
    imageSrc: string;
    enabled: boolean;
    onClick: () => void;
}

export function IconButton({
    tooltipText,
    imageSrc,
    enabled,
    onClick
}: IconButtonProps) {
    return (
        <Tooltip.Provider delayDuration={500}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button className="rounded-full" variant="outline" disabled={!enabled} onClick={() => onClick()}>
                        <img className="min-w-4 min-h-4" src={imageSrc} />
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
