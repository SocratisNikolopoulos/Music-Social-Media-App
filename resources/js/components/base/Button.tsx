import { ReactNode } from "react";

export type ButtonColor = "orange" | "white";
export type ButtonSize = "small" | "normal";

const COLORS: Record<ButtonColor, string> = {
    white: "border hover:bg-gray-100 text-black",
    orange: "bg-orange-400 hover:bg-orange-500 text-white",
};

const SIZES: Record<ButtonSize, string> = {
    normal: "px-4 py-2",
    small: "px-2",
};

function Button({
    children,
    color = "orange",
    size = "normal",
    bold = true,
    className = "",
    onClick,
}: {
    children: ReactNode;
    color?: ButtonColor;
    size?: ButtonSize;
    bold?: boolean;
    className?: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`${COLORS[color]} ${SIZES[size]} ${
                bold ? "font-bold" : ""
            } rounded-md flex gap-2 justify-center items-center ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;
