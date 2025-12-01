import { Box } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ITool } from "./tools/ITool";
import { PixelPenTool } from "./tools/PixelPenTool";
import { SmoothPenTool } from "./tools/SmoothPenTool";
import type { ToolOptions, ToolType } from "./types";

interface PaintCanvasProps {
  width: number;
  height: number;
  zoom: number;
  pan: { x: number; y: number };
  toolType: ToolType;
  toolOptions: ToolOptions;
  onPanChange: (newPan: { x: number; y: number }) => void;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const PaintCanvas: React.FC<PaintCanvasProps> = ({
  width,
  height,
  zoom,
  pan,
  toolType,
  toolOptions,
  onPanChange,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPosRef = useRef<{ x: number; y: number } | null>(null);

  // ツールインスタンスの管理
  const tools = useMemo(
    () => ({
      smooth: new SmoothPenTool(),
      pixel: new PixelPenTool(),
    }),
    []
  );

  const activeTool: ITool = tools[toolType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 初期化: 白背景 (初回のみ)
    // 注意: ReactのStrict Modeで2回呼ばれる可能性があるため、
    // 既存の描画を消さないようにチェックするか、親から制御する方が良いが、
    // ここでは簡易的に実装。
    // 実際には親コンポーネントで初期化を行うか、
    // canvasの状態管理を別にするのが望ましい。
    // 今回はリファクタリング前の動作を維持するため、
    // 親からclearCanvasを呼べるようにrefを公開する形をとる。
    // ここでの初期化は行わない（親に任せるか、useEffectの依存配列を空にして一度だけ実行）
  }, [onCanvasReady]);

  // 初期背景色設定
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // 既に描画されているかどうかの判定は難しいので、
    // とりあえず白で塗りつぶすのは親コンポーネントの責任とするか、
    // ここでは何もしない。
    // リファクタリング前はuseEffectで白塗りしていた。
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // コンテキストメニュー無効化
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    canvas.addEventListener("contextmenu", handleContextMenu);
    return () => canvas.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const getCanvasCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / zoom);
    const y = Math.floor((e.clientY - rect.top) / zoom);
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 右クリックはパン
    if (e.button === 2) {
      e.preventDefault();
      setIsPanning(true);
      lastPanPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    setIsDrawing(true);
    activeTool.onMouseDown(ctx, x, y, toolOptions);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning && lastPanPosRef.current) {
      const dx = e.clientX - lastPanPosRef.current.x;
      const dy = e.clientY - lastPanPosRef.current.y;
      onPanChange({ x: pan.x + dx, y: pan.y + dy });
      lastPanPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    activeTool.onMouseMove(ctx, x, y, toolOptions);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setIsPanning(false);
      lastPanPosRef.current = null;
      return;
    }

    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);
    activeTool.onMouseUp(ctx, x, y, toolOptions);
    setIsDrawing(false);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMouseUp(e);
  };

  return (
    <Box
      sx={{
        border: "2px solid #333",
        display: "inline-block",
        overflow: "hidden",
        width: width,
        height: height,
        position: "relative",
        backgroundColor: "#e0e0e0",
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: isPanning ? "grabbing" : "crosshair",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center",
          transition: isPanning ? "none" : "transform 0.1s ease-out",
          imageRendering: "pixelated",
        }}
      />
    </Box>
  );
};
