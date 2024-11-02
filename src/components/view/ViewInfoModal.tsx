import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewInfoCredit from "@/components/view/ViewInfoCredit";
import ViewInfoGeneral from "@/components/view/ViewInfoGeneral";
import ViewInfoGuide from "@/components/view/ViewInfoGuide";

interface ViewInfoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ViewInfoModal = ({ open, onOpenChange }: ViewInfoModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg h-[80vh] max-w-none md:w-[50vw]">
                <Tabs defaultValue="general">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="guide">Guide</TabsTrigger>
                        <TabsTrigger value="credit">Credit</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general">
                        <ViewInfoGeneral />
                    </TabsContent>
                    <TabsContent value="guide">
                        <ViewInfoGuide />
                    </TabsContent>
                    <TabsContent value="credit">
                        <ViewInfoCredit />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default ViewInfoModal;
