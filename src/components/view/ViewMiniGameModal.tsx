import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ViewGamblingGame from "@/components/view/ViewGamblingGame";
import { ViewMarkdown } from "@/components/view/ViewMarkdown";
import ViewMemoryGame from "@/components/view/ViewMemoryGame";
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
    const [game, setGame] = useState("memory");
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg max-w-none md:w-[50vw] w-[85vw] md:h-[50vh] h-[80vh] transition-all">
                <DialogHeader>
                    <DialogTitle>Minigames</DialogTitle>
                </DialogHeader>
                <div className="rounded-lg grid h-full w-full">
                    <Select
                        value={game}
                        onValueChange={(value) => setGame(value)}
                    >
                        <SelectTrigger className="mx-auto">
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
                    <Dialog>
                        <DialogTrigger>
                            <Info className="absolute bottom-4 right-4" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{GAMES[game].label}</DialogTitle>
                            </DialogHeader>
                            <ViewMarkdown
                                onEdgeLinkClicked={() => {}}
                                onNodeLinkClicked={() => {}}
                            >
                                Minigames info here
                            </ViewMarkdown>
                        </DialogContent>
                    </Dialog>

                    {/* Game container */}
                    <div className="w-full h-full">
                        {game === "gambling" && <ViewGamblingGame />}
                        {game === "memory" && <ViewMemoryGame />}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewMiniGameModal;
