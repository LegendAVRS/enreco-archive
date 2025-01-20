import { IconButton } from "../ui/IconButton";

interface ViewOtherControlButtonsProps {
    onSettingsClick: () => void;
    onInfoClick: () => void;
}

export function ViewOtherControlButtons({onInfoClick, onSettingsClick}: ViewOtherControlButtonsProps) {
    return (
        <div className="flex flex-row gap-2 bg-transparent">
            <IconButton
                className="flex-1"
                tooltipText={"Info"}
                imageSrc={"/ui/circle-info-solid.svg"}
                enabled={true}
                onClick={onInfoClick}
            />

            <IconButton
                className="flex-1"
                tooltipText={"Settings"}
                imageSrc={"/ui/gear-solid.svg"}
                enabled={true}
                onClick={onSettingsClick}
            />
        </div>
    );
}