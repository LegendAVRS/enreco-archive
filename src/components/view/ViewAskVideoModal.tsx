import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alertdialog";
import { useSettingStore } from "@/store/settingStore";

interface ViewAskVideoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ViewAskVideoModal = ({ open, onOpenChange }: ViewAskVideoModalProps) => {
    const settingStore = useSettingStore();
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        About opening timestamps
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Would you like to open the video in a card (stay on
                        site) or in a new tab? You can change this later in the
                        settings.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={() => settingStore.setTimestampOption("modal")}
                    >
                        Open in card
                    </AlertDialogAction>
                    <AlertDialogCancel
                        onClick={() => settingStore.setTimestampOption("tab")}
                    >
                        Open a new tab
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ViewAskVideoModal;
