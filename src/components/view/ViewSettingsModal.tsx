import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface ViewSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bgmEnabled: boolean;
    onBgmEnabledChange: (newBgmEnabled: boolean) => void;
}

const ViewSettingsModal = ({ 
    open, 
    onOpenChange,
    bgmEnabled,
    onBgmEnabledChange
}: ViewSettingsModalProps) => {
    if(!open) {
        return <></>;
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden.Root>
                <DialogTitle>Settings</DialogTitle>
            </VisuallyHidden.Root>
            <DialogContent className="rounded-lg h-max max-w-none md:w-[25vw] space-y-2">
                <span className="font-bold text-3xl">Settings</span>
                <div className="flex flex-col items-start justify-between">
                    <div className="flex flex-row items-center">
                        <Checkbox className="mr-1" id="enable-bgm" checked={bgmEnabled} onCheckedChange={onBgmEnabledChange} />
                        <label className="text-lg" htmlFor="enable-bgm">Background Music</label>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="self-end"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ViewSettingsModal;
