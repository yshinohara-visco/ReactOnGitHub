import {
  Box,
  Button,
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
import { PaintCanvas } from "./PaintCanvas";
import type { PenColor, PenShape, ToolType } from "./types";

/*
Antigravityに任せてみた。
一つのコンポーネントにごちゃ混ぜで実装したので分けてもらった。
分かれはしたが、今の実装専用な分かれ方な気もする。
AIに任せる際、今後の拡張性を踏まえた設計をしてもらうのに手間がかかりそう。
今後の拡張を具体的に伝えるとそれ込みで作業を始めて収集が付かなくなるし扱いが難しい。
*/

export const Paint = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolType>("smooth");
  const [penShape, setPenShape] = useState<PenShape>("round");
  const [penSize, setPenSize] = useState(5);
  const [penColor, setPenColor] = useState<PenColor>("black");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };



  // PaintCanvasにonWheelを追加する修正を行う代わりに、
  // ここではPaintCanvasをラップするdivでイベントを捕捉する。
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheelPreventScroll = (e: WheelEvent) => {
      e.preventDefault();
    };

    container.addEventListener("wheel", onWheelPreventScroll, { passive: false });

    return () => {
      container.removeEventListener("wheel", onWheelPreventScroll);
    };
  }, []);

  const onCanvasWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prevZoom) => Math.max(0.1, Math.min(5, prevZoom * delta)));
  };

  return (
    // <CssBaseline> removed
      <Stack padding={2} spacing={4}>
        <Stack spacing={2}>
          <Typography variant="h3">Paint</Typography>
          <Typography variant="body1" color="text.secondary">
            Canvas上でマウス操作により線を引く基本的なペイントツールです。
            ツールを切り替えて、アンチエイリアス付きの標準描画とジャギーな独自実装を比較できます。
          </Typography>
        </Stack>

        <Stack direction="row" spacing={4} flexWrap="wrap">
          {/* Canvas Area */}
          <div ref={containerRef} onWheel={onCanvasWheel}>
            <PaintCanvas
              width={800}
              height={600}
              zoom={zoom}
              pan={pan}
              toolType={selectedTool}
              toolOptions={{
                shape: penShape,
                size: penSize,
                color: penColor,
              }}
              onPanChange={setPan}
              onCanvasReady={(canvas) => (canvasRef.current = canvas)}
            />
          </div>

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
    // </CssBaseline> removed
  );
};
