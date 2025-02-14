import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-[#6C48E3]",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    );
}