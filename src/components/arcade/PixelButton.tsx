import type { ButtonHTMLAttributes, ReactNode } from "react";
export function PixelButton({children,className="",...props}:ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode}){return <button className={`pixel-button ${className}`} {...props}>{children}</button>}
