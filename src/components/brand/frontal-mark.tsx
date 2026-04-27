import type { ReactElement } from "react";

export interface FrontalMarkProps {
  color?: string;
  size?: number;
}

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
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={(size * 259.99) / 162.5}
      viewBox="0 0 162.5 259.99"
      width={size}
    >
      {RECT_COORDINATES.map(([x, y]) => (
        <rect
          fill={color}
          height="32.5"
          key={`${x}-${y}`}
          width="32.5"
          x={x}
          y={y}
        />
      ))}
    </svg>
  );
}
