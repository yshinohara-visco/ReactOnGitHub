import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

/*
Antigravityに任せてみた。動きはするが、コードはごちゃ混ぜでイマイチ。
威勢よく作業を始めるが、難しい作業を任せると完成前に使用上限に達したりと、着地に失敗する印象が強い。
*/

type Tool = "smooth" | "pixel";
type PenShape = "round" | "square";
type PenColor = "white" | "black" | "red" | "blue";

const COLOR_MAP: Record<PenColor, string> = {
  white: "#FFFFFF",
  black: "#000000",
  red: "#FF0000",
  blue: "#0000FF",
};

const COLOR_RGB_MAP: Record<PenColor, [number, number, number]> = {
  white: [255, 255, 255],
  black: [0, 0, 0],
  red: [255, 0, 0],
  blue: [0, 0, 255],
};

export const Paint = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool>("smooth");
  const [penShape, setPenShape] = useState<PenShape>("round");
  const [penSize, setPenSize] = useState(5);
  const [penColor, setPenColor] = useState<PenColor>("black");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastPanPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 初期化: 白背景
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // コンテキストメニューを無効化
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    canvas.addEventListener("contextmenu", handleContextMenu);

    return () => {
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // スタンプを生成（PixelPen用）
  const createStamp = (
    shape: PenShape,
    size: number
  ): { dx: number; dy: number }[] => {
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
  };

  // ピクセルを描画（PixelPen用）
  const drawPixel = (
    imageData: ImageData,
    x: number,
    y: number,
    color: [number, number, number]
  ) => {
    const width = imageData.width;
    const height = imageData.height;

    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const index = (y * width + x) * 4;
    imageData.data[index] = color[0]; // R
    imageData.data[index + 1] = color[1]; // G
    imageData.data[index + 2] = color[2]; // B
    imageData.data[index + 3] = 255; // A
  };

  // スタンプを押す（PixelPen用）
  const applyStamp = (
    imageData: ImageData,
    x: number,
    y: number,
    stamp: { dx: number; dy: number }[],
    color: [number, number, number]
  ) => {
    stamp.forEach(({ dx, dy }) => {
      drawPixel(imageData, x + dx, y + dy, color);
    });
  };

  // Bresenhamの直線アルゴリズム（PixelPen用）
  const drawLine = (
    imageData: ImageData,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    stamp: { dx: number; dy: number }[],
    color: [number, number, number]
  ) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    while (true) {
      applyStamp(imageData, x, y, stamp, color);

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
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 右クリックの場合はパン開始
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

    const rect = canvas.getBoundingClientRect();
    // ズームとパンを考慮した座標計算
    const x = Math.floor((e.clientX - rect.left) / zoom);
    const y = Math.floor((e.clientY - rect.top) / zoom);

    lastPosRef.current = { x, y };
    setIsDrawing(true);

    if (selectedTool === "smooth") {
      // SmoothPen: Canvas 2D Context APIを使用
      ctx.strokeStyle = COLOR_MAP[penColor];
      ctx.lineWidth = penSize;
      ctx.lineCap = penShape === "round" ? "round" : "butt";
      ctx.lineJoin = penShape === "round" ? "round" : "miter";

      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      // PixelPen: 最初の点を描画
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const stamp = createStamp(penShape, penSize);
      applyStamp(imageData, x, y, stamp, COLOR_RGB_MAP[penColor]);
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // パン中の処理
    if (isPanning && lastPanPosRef.current) {
      const dx = e.clientX - lastPanPosRef.current.x;
      const dy = e.clientY - lastPanPosRef.current.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPanPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!isDrawing || !lastPosRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    // ズームとパンを考慮した座標計算
    const x = Math.floor((e.clientX - rect.left) / zoom);
    const y = Math.floor((e.clientY - rect.top) / zoom);

    if (selectedTool === "smooth") {
      // SmoothPen: Canvas 2D Context APIを使用
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // PixelPen: Bresenhamアルゴリズムで線を描画
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const stamp = createStamp(penShape, penSize);

      drawLine(
        imageData,
        lastPosRef.current.x,
        lastPosRef.current.y,
        x,
        y,
        stamp,
        COLOR_RGB_MAP[penColor]
      );

      ctx.putImageData(imageData, 0, 0);
    }

    lastPosRef.current = { x, y };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setIsPanning(false);
    lastPosRef.current = null;
    lastPanPosRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prevZoom) => Math.max(0.1, Math.min(5, prevZoom * delta)));
  };

  return (
    <CssBaseline>
      <Stack padding={2} spacing={4}>
        <Stack spacing={2}>
          <Typography variant="h3">Paint</Typography>
          <Typography variant="body1" color="text.secondary">
            Canvas上でマウス操作により線を引く基本的なペイントツールです。
            ツールを切り替えて、アンチエイリアス付きの標準描画とジャギーな独自実装を比較できます。
          </Typography>
        </Stack>

        <Stack direction="row" spacing={4} flexWrap="wrap">
          {/* Canvas */}
          <Box
            sx={{
              border: "2px solid #333",
              display: "inline-block",
              overflow: "hidden",
              width: 800,
              height: 600,
              position: "relative",
              backgroundColor: "#e0e0e0", // 背景色をグレーに変更
            }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onWheel={handleWheel}
              style={{
                cursor: isPanning ? "grabbing" : "crosshair",
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center",
                transition: isPanning ? "none" : "transform 0.1s ease-out",
                imageRendering: "pixelated",
              }}
            />
          </Box>

          {/* Controls */}
          <Stack spacing={3} minWidth={250}>
            {/* ツール選択 */}
            <FormControl>
              <FormLabel>ツール</FormLabel>
              <ToggleButtonGroup
                value={selectedTool}
                exclusive
                onChange={(_, value) => value && setSelectedTool(value)}
                fullWidth
              >
                <ToggleButton value="smooth">
                  Smooth Pen
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    (滑らか)
                  </Typography>
                </ToggleButton>
                <ToggleButton value="pixel">
                  Pixel Pen
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    (ジャギー)
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {selectedTool === "smooth"
                  ? "Canvas 2D Context APIによるアンチエイリアス付き描画"
                  : "ImageData直接操作によるピクセル単位の描画"}
              </Typography>
            </FormControl>

            {/* ペン形状 */}
            <FormControl>
              <FormLabel>ペン形状</FormLabel>
              <RadioGroup
                value={penShape}
                onChange={(e) => setPenShape(e.target.value as PenShape)}
              >
                <FormControlLabel value="round" control={<Radio />} label="円" />
                <FormControlLabel
                  value="square"
                  control={<Radio />}
                  label="正方形"
                />
              </RadioGroup>
            </FormControl>

            {/* ペンサイズ */}
            <FormControl>
              <FormLabel>ペンサイズ: {penSize}px</FormLabel>
              <Slider
                value={penSize}
                onChange={(_, value) => setPenSize(value as number)}
                min={1}
                max={50}
                valueLabelDisplay="auto"
              />
            </FormControl>

            {/* 色選択 */}
            <FormControl>
              <FormLabel>色</FormLabel>
              <RadioGroup
                value={penColor}
                onChange={(e) => setPenColor(e.target.value as PenColor)}
              >
                <FormControlLabel value="white" control={<Radio />} label="白" />
                <FormControlLabel value="black" control={<Radio />} label="黒" />
                <FormControlLabel value="red" control={<Radio />} label="赤" />
                <FormControlLabel value="blue" control={<Radio />} label="青" />
              </RadioGroup>
            </FormControl>

            {/* ズーム表示 */}
            <Box>
              <Typography variant="body2" color="text.secondary">
                ズーム: {(zoom * 100).toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                マウスホイールで拡大縮小
              </Typography>
            </Box>

            {/* クリアボタン */}
            <Button variant="outlined" onClick={clearCanvas}>
              クリア
            </Button>
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          💡 Smooth Penはブラウザが自動的にアンチエイリアスを適用し、Pixel
          PenはBresenhamアルゴリズムでスタンプを配置します。
          マウスホイールで拡大縮小、右クリックドラッグでキャンバスを移動できます。
        </Typography>
      </Stack>
    </CssBaseline>
  );
};
