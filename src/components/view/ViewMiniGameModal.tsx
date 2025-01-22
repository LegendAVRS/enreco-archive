import { Dialog, DialogContent } from "@/components/ui/dialog";
import ViewGamblingGame from "@/components/view/ViewGamblingGame";

interface ViewMiniGameModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ViewMiniGameModal = ({ open, onOpenChange }: ViewMiniGameModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg  max-w-none md:w-[50vw]">
                <ViewGamblingGame />
            </DialogContent>
        </Dialog>
    );
};

export default ViewMiniGameModal;
