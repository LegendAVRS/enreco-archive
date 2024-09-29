import { Checkbox } from "@/components/ui/checkbox";

interface VisibilityToggleProps {
    children?: React.ReactNode;
    onCheckedChange?: (checked: boolean) => void;
    checked?: boolean;
}

function VisibilityToggle({
    children,
    onCheckedChange,
    checked,
}: VisibilityToggleProps) {
    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">{children}</div>
            <Checkbox
                onCheckedChange={() => onCheckedChange}
                checked={checked}
            />
        </div>
    );
}

export default VisibilityToggle;
