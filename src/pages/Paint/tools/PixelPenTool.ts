import { COLOR_RGB_MAP } from "../types";
import type { PenShape, ToolOptions } from "../types";
import type { ITool } from "./ITool";

export class PixelPenTool implements ITool {
    private lastPos: { x: number; y: number } | null = null;

    private createStamp(
        shape: PenShape,
        size: number
    ): { dx: number; dy: number }[] {
        const stamp: { dx: number; dy: number }[] = [];
        const radius = Math.floor(size / 2);

        if (shape === "round") {
            // 円形スタンプ
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    if (dx * dx + dy * dy <= radius * radius) {
                        stamp.push({ dx, dy });
                    }
                }
            }
        } else {
            // 正方形スタンプ
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    stamp.push({ dx, dy });
                }
            }
        }

        return stamp;
    }

    private drawPixel(
        imageData: ImageData,
        x: number,
        y: number,
        color: [number, number, number]
    ) {
        const width = imageData.width;
        const height = imageData.height;

        if (x < 0 || x >= width || y < 0 || y >= height) return;

        const index = (y * width + x) * 4;
        imageData.data[index] = color[0]; // R
        imageData.data[index + 1] = color[1]; // G
        imageData.data[index + 2] = color[2]; // B
        imageData.data[index + 3] = 255; // A
    }

    private applyStamp(
        imageData: ImageData,
        x: number,
        y: number,
        stamp: { dx: number; dy: number }[],
        color: [number, number, number]
    ) {
        stamp.forEach(({ dx, dy }) => {
            this.drawPixel(imageData, x + dx, y + dy, color);
        });
    }

    private drawLine(
        imageData: ImageData,
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        stamp: { dx: number; dy: number }[],
        color: [number, number, number]
    ) {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        let x = x0;
        let y = y0;

        while (true) {
            this.applyStamp(imageData, x, y, stamp, color);

            if (x === x1 && y === y1) break;

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
        }
    }

    onMouseDown(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        options: ToolOptions
    ): void {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const stamp = this.createStamp(options.shape, options.size);
        this.applyStamp(imageData, x, y, stamp, COLOR_RGB_MAP[options.color]);
        ctx.putImageData(imageData, 0, 0);
        this.lastPos = { x, y };
    }

    onMouseMove(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        options: ToolOptions
    ): void {
        if (!this.lastPos) return;

        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const stamp = this.createStamp(options.shape, options.size);

        this.drawLine(
            imageData,
            this.lastPos.x,
            this.lastPos.y,
            x,
            y,
            stamp,
            COLOR_RGB_MAP[options.color]
        );

        ctx.putImageData(imageData, 0, 0);
        this.lastPos = { x, y };
    }

    onMouseUp(
        _ctx: CanvasRenderingContext2D,
        _x: number,
        _y: number,
        _options: ToolOptions
    ): void {
        this.lastPos = null;
    }
}
