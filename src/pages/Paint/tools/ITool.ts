import type { ToolOptions } from "../types";

export interface ITool {
    onMouseDown(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        options: ToolOptions
    ): void;
    onMouseMove(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        options: ToolOptions
    ): void;
    onMouseUp(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        options: ToolOptions
    ): void;
}
