import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewInfoCredit from "@/components/view/ViewInfoCredit";
import ViewInfoGuide from "@/components/view/ViewInfoGuide";

interface ViewInfoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ViewInfoModal = ({ open, onOpenChange }: ViewInfoModalProps) => {
    if(!open) {
        return <></>;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden.Root>
                <DialogTitle>Info Modal</DialogTitle>
            </VisuallyHidden.Root>
            <DialogContent className="grid rounded-lg h-[80vh] max-w-none md:w-[50vw]">
                <Tabs defaultValue="general">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="guide">Guide</TabsTrigger>
                        <TabsTrigger value="credit">Credits</TabsTrigger>
                    </TabsList>
                    <TabsContent value="guide">
                        <ViewInfoGuide />
                    </TabsContent>
                    <TabsContent value="credit">
                        <ViewInfoCredit />
                    </TabsContent>
                </Tabs>
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

export default ViewInfoModal;
