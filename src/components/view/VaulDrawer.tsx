import { cn } from "@/lib/utils";
import { useState } from "react";
import { Drawer } from "vaul";

interface VaulDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: React.ReactNode;
}

export default function VaulDrawer({
    open,
    setOpen,
    children,
}: VaulDrawerProps) {
    const [isScrollable, setIsScrollable] = useState(false);
    return (
        <Drawer.Root
            open={open}
            onOpenChange={setOpen}
            snapPoints={[0.5, 1]}
            setActiveSnapPoint={(index) => {
                if (index === 1) {
                    setIsScrollable(true);
                }
                if (index === 0.5) {
                    setIsScrollable(false);
                }
            }}
            fadeFromIndex={0}
        >
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] mt-24 max-h-[80vh] fixed bottom-0 left-0 right-0 outline-none overflow-hidden">
                    {/* The max-h-[80vh] limits the drawer height to 80% of viewport height */}
                    <div
                        className={cn("p-4 bg-white max-h-full", {
                            "overflow-auto": isScrollable,
                        })}
                    >
                        {children}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
