import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogFooter,
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
import { TimestampOption, useSettingStore } from "@/store/settingStore";

interface ViewSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ViewSettingsModal = ({ open, onOpenChange }: ViewSettingsModalProps) => {
    const settingStore = useSettingStore();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden.Root>
                <DialogTitle>Settings</DialogTitle>
            </VisuallyHidden.Root>
            <DialogContent className="rounded-lg h-max max-w-none md:w-[25vw] space-y-2">
                <div className="flex flex-col items-start justify-between flex-1">
                    <div className="flex flex-row justify-between items-center w-full">
                        <Label className="text-lg" htmlFor="enable-bgm">
                            Background Music
                        </Label>
                        <Checkbox
                            className="mr-1"
                            id="enable-bgm"
                            checked={settingStore.bgmEnabled}
                            onCheckedChange={() =>
                                settingStore.setBgmEnabled(
                                    !settingStore.bgmEnabled
                                )
                            }
                        />
                    </div>

                    <div className="flex flex-row justify-between items-center w-full">
                        <Label className="text-lg" htmlFor="timestamp-option">
                            Timestamp
                        </Label>
                        <Select
                            onValueChange={(value) =>
                                settingStore.setTimestampOption(
                                    value as TimestampOption
                                )
                            }
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue
                                    placeholder={settingStore.timestampOption}
                                />
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
