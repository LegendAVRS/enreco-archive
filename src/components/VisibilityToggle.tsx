import { Checkbox } from "@/components/ui/checkbox";

interface VisibilityToggleProps {
    children?: React.ReactNode;
    onClick?: () => void;
    checked?: boolean;
}

function VisibilityToggle({
    children,
    onClick,
    checked,
}: VisibilityToggleProps) {
    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">{children}</div>
            <Checkbox onClick={onClick} checked={checked} />
        </div>
    );
}

export default VisibilityToggle;
