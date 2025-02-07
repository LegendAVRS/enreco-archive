import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { urlToEmbedUrl } from "@/lib/utils";
import { YouTubeEmbed } from "@next/third-parties/google";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ViewVideoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoUrl: string | null;
}

const ViewVideoModal = ({
    open,
    onOpenChange,
    videoUrl,
}: ViewVideoModalProps) => {
    const { videoid, params } = urlToEmbedUrl(videoUrl);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden>
                <DialogTitle>Video modal for ${videoUrl}</DialogTitle>
            </VisuallyHidden>
            <DialogContent className="rounded-lg  max-w-none md:w-[50vw]">
                <YouTubeEmbed videoid={videoid} params={params} />
            </DialogContent>
        </Dialog>
    );
};

export default ViewVideoModal;
