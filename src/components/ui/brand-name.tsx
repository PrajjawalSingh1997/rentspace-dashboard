import { cn } from "@/lib/utils";

interface BrandNameProps {
    className?: string;
    text?: string;
}

export function BrandName({ className, text = "Rentlyf" }: BrandNameProps) {
    return (
        <span className={cn("font-scrib font-normal", className)}>
            {text}
        </span>
    );
}
