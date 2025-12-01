import { COLOR_MAP } from "../types";
import type { ToolOptions } from "../types";
import type { ITool } from "./ITool";

export class SmoothPenTool implements ITool {
    onMouseDown(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        options: ToolOptions
    ): void {
        ctx.strokeStyle = COLOR_MAP[options.color];
        ctx.lineWidth = options.size;
        ctx.lineCap = options.shape === "round" ? "round" : "butt";
        ctx.lineJoin = options.shape === "round" ? "round" : "miter";

        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    onMouseMove(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        _options: ToolOptions
    ): void {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    onMouseUp(
        _ctx: CanvasRenderingContext2D,
        _x: number,
        _y: number,
        _options: ToolOptions
    ): void {
        // No specific action needed for smooth pen on mouse up
    }
}
