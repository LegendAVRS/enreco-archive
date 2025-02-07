import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ViewGamblingGame from "@/components/view/ViewGamblingGame";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ViewMiniGameModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ViewMiniGameModal = ({ open, onOpenChange }: ViewMiniGameModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden>
                <DialogTitle>Minigame Modal</DialogTitle>
            </VisuallyHidden>
            <DialogContent className="rounded-lg  max-w-none md:w-[50vw]">
                <ViewGamblingGame />
            </DialogContent>
        </Dialog>
    );
};

export default ViewMiniGameModal;
