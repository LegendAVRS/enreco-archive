import { Dialog, DialogContent } from "@/components/ui/dialog";

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
    const urlToEmbedUrl = (url: string | null): string => {
        if (!url) return "";

        // Youtube share by default uses /live (cause these are from streams), so they might not have v= in the url
        let slug = url.split("v=")[1];
        if (!slug) {
            slug = url.split("live/")[1];
        }

        // Replace t= with start= in slug cause embeds only work with start for some reason
        if (slug.includes("t=")) {
            const time = slug.split("t=")[1];
            slug = slug.replace(`t=${time}`, `start=${time}`);
        }

        return `https://www.youtube.com/embed/${slug}`;
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg  max-w-none md:w-[50vw]">
                <iframe
                    src={urlToEmbedUrl(videoUrl)}
                    className="w-full h-[50vh]"
                />
            </DialogContent>
        </Dialog>
    );
};

export default ViewVideoModal;
