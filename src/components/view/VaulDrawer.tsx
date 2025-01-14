import { cn } from "@/lib/utils";
import { useViewStore } from "@/store/viewStore";
import { useState } from "react";
import { Drawer } from "vaul";

interface VaulDrawerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    children: React.ReactNode;
    onClose?: () => void;
}

export default function VaulDrawer({
    open,
    setOpen,
    onClose,
    children,
}: VaulDrawerProps) {
    const { currentCard, setCurrentCard } = useViewStore();
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
                    console.log(true);
                    setIsScrollable(false);
                }
            }}
            snapToSequentialPoint
            onAnimationEnd={(isOpen) => {
                if (!isOpen) {
                    onClose?.();
                }
                setCurrentCard(null);
            }}
            fadeFromIndex={0}
        >
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] mt-24 h-[80vh] fixed bottom-0 left-0 right-0 outline-none overflow-hidden">
                    {/* Setting min-h to the containter's height makes it shows children that have less content, idk why this works */}
                    <div
                        className={cn("p-4 bg-white h-[80vh] max-h-full", {
                            "overflow-auto":
                                isScrollable && currentCard !== "setting",
                        })}
                    >
                        {children}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
