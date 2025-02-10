import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ViewGamblingGame from "@/components/view/ViewGamblingGame";
import ViewMemoryGame from "@/components/view/ViewMemoryGame";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Info } from "lucide-react";
import { useState } from "react";

interface ViewMiniGameModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const GAMES: { [key: string]: { label: string } } = {
    gambling: {
        label: "Gambling Game (Chapter 1)",
    },
    memory: {
        label: "Memory Game (Chapter 1)",
    },
};

const ViewMiniGameModal = ({ open, onOpenChange }: ViewMiniGameModalProps) => {
    const [game, setGame] = useState("gambling");
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden>
                <DialogTitle>Minigame Modal</DialogTitle>
            </VisuallyHidden>
            <DialogContent className="rounded-lg flex flex-col justify-center max-w-none max-h-none md:w-[50vw] w-[70vw] md:h-[70vh] h-[95vh]">
                <Select value={game} onValueChange={(value) => setGame(value)}>
                    <SelectTrigger className="w-[400px] mx-auto">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(GAMES).map((game) => {
                            return (
                                <SelectItem key={game} value={game}>
                                    {GAMES[game].label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>

                <Info className="absolute bottom-4 right-4" />

                {/* Game container */}
                <div className="w-full h-full mt-4">
                    {game === "gambling" && <ViewGamblingGame />}
                    {game === "memory" && <ViewMemoryGame />}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewMiniGameModal;
