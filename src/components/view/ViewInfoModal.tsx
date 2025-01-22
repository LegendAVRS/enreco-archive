import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
            <DialogContent className="rounded-lg h-[80vh] max-w-none md:w-[50vw] flex flex-col justify-end">
                <Tabs defaultValue="general" className="h-[80%] max-h-[100%] flex-1 flex flex-col">
                    <TabsList className="flex-none w-full grid grid-cols-2">
                        <TabsTrigger value="guide">Guide</TabsTrigger>
                        <TabsTrigger value="credit">Credits</TabsTrigger>
                    </TabsList>
                    <TabsContent value="guide" className="flex-1 min-h-0 overflow-auto">
                        <ViewInfoGuide />
                    </TabsContent>
                    <TabsContent value="credit" className="flex-1 min-h-0 overflow-auto">
                        <ViewInfoCredit />
                    </TabsContent>
                </Tabs>
                <DialogClose asChild className="flex-none w-full p-2 mt-2">
                    <Button className="self-end">
                        Close
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default ViewInfoModal;
