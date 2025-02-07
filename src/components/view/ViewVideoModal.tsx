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
            <DialogContent className="rounded-lg md:w-[50vw] max-w-none w-[95vw] h-auto aspect-video md:p-6 p-2">
                <YouTubeEmbed
                    videoid={videoid}
                    params={params}
                    style="max-width: 100%; max-height: 100%;"
                />
            </DialogContent>
        </Dialog>
    );
};

export default ViewVideoModal;
