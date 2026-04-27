import type { ReactElement } from "react";

export interface FrontalMarkProps {
  color?: string;
  size?: number;
}

const VIEWBOX_WIDTH = 162.5;
const VIEWBOX_HEIGHT = 259.99;
const CELL_SIZE = 32.5;
const RECT_COORDINATES = [
  [32.5, 32.5],
  [0, 65],
  [65, 0],
  [130, 0],
  [0, 0],
  [65, 65],
  [32.5, 97.5],
  [32.5, 162.5],
  [0, 195],
  [65, 130],
  [97.5, 97.5],
  [97.5, 32.5],
  [0, 130],
  [32.5, 227.5],
] as const;

export function FrontalMark({
  color = "currentColor",
  size = 72,
}: FrontalMarkProps): ReactElement {
  const scale = size / VIEWBOX_WIDTH;
  const height = VIEWBOX_HEIGHT * scale;
  const cellSize = CELL_SIZE * scale;

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height,
        display: "flex",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {RECT_COORDINATES.map(([x, y]) => (
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x * scale,
            top: y * scale,
            width: cellSize,
            height: cellSize,
            display: "flex",
            background: color,
          }}
        />
      ))}
    </div>
  );
}
