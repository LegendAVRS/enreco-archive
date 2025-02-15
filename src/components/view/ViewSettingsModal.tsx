import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TimestampOption, useSettingStore } from "@/store/settingStore";

interface ViewSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ViewSettingsModal = ({ open, onOpenChange }: ViewSettingsModalProps) => {
    const settingStore = useSettingStore();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-lg h-max max-w-none md:w-[25vw] space-y-2">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-start justify-between flex-1">
                    <div className="flex flex-row justify-between items-center w-full">
                        <Label className="text-lg" htmlFor="enable-bgm">
                            Background Music
                        </Label>
                        <Slider
                            defaultValue={[settingStore.bgmVolume]}
                            max={1}
                            step={0.01}
                            onValueChange={(value) =>
                                settingStore.setBgmVolume(value[0])
                            }
                        />
                    </div>

                    <div className="flex flex-row justify-between items-center w-full">
                        <Label className="text-lg" htmlFor="timestamp-option">
                            Timestamp Option
                        </Label>
                        <Select
                            onValueChange={(value) =>
                                settingStore.setTimestampOption(
                                    value as TimestampOption,
                                )
                            }
                            value={settingStore.timestampOption}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="modal">Card</SelectItem>
                                <SelectItem value="tab">Tab</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
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

export default ViewSettingsModal;
