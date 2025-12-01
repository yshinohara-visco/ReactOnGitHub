export type ToolType = "smooth" | "pixel";
export type PenShape = "round" | "square";
export type PenColor = "white" | "black" | "red" | "blue";

export const COLOR_MAP: Record<PenColor, string> = {
    white: "#FFFFFF",
    black: "#000000",
    red: "#FF0000",
    blue: "#0000FF",
};

export const COLOR_RGB_MAP: Record<PenColor, [number, number, number]> = {
    white: [255, 255, 255],
    black: [0, 0, 0],
    red: [255, 0, 0],
    blue: [0, 0, 255],
};

export interface ToolOptions {
    shape: PenShape;
    size: number;
    color: PenColor;
}
