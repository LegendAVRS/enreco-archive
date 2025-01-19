import { IconButton } from "../ui/IconButton";

interface ViewSideButtonsProps {
    onSettingsClick: () => void;
    onInfoClick: () => void;
}

export function ViewSideButtons({onInfoClick, onSettingsClick}: ViewSideButtonsProps) {
    return (
        <div className="fixed bottom-0 right-0 m-4 flex flex-col gap-2 bg-transparent opacity-50 hover:opacity-100">
            <IconButton 
                tooltipText={"Info"}
                imageSrc={"/ui/circle-info-solid.svg"}
                enabled={true}
                onClick={onInfoClick}
            />
            <IconButton 
                tooltipText={"Settings"}
                imageSrc={"/ui/gear-solid.svg"}
                enabled={true}
                onClick={onSettingsClick}
            />
        </div>
    );
}