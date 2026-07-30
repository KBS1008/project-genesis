import { formatNumber } from './escape.js';

/** Build a polyline points string from normalized values. */
export function buildLinePoints(
  values: readonly number[],
  xStart: number,
  xEnd: number,
  yBase: number,
  yTop: number,
): string {
  if (values.length === 0) {
    return '';
  }
  const max = Math.max(...values, 1);
  const step = values.length <= 1 ? 0 : (xEnd - xStart) / (values.length - 1);
  return values
    .map((value, index) => {
      const x = xStart + step * index;
      const y = yBase - ((value / max) * (yBase - yTop));
      return `${formatNumber(x)},${formatNumber(y)}`;
    })
    .join(' ');
}

/** Build bar rectangles for a chart panel. */
export function buildBars(
  values: readonly number[],
  xStart: number,
  yBase: number,
  barWidth: number,
  gap: number,
  maxHeight: number,
): readonly { readonly x: number; readonly y: number; readonly width: number; readonly height: number }[] {
  const max = Math.max(...values, 1);
  return values.map((value, index) => {
    const height = (value / max) * maxHeight;
    return {
      x: xStart + index * (barWidth + gap),
      y: yBase - height,
      width: barWidth,
      height,
    };
  });
}

/** Build pie/donut slice paths. */
export function buildPieSlices(
  values: readonly number[],
  cx: number,
  cy: number,
  radius: number,
  innerRadius = 0,
): readonly string[] {
  const total = values.reduce((sum, value) => sum + value, 0) || 1;
  let startAngle = -Math.PI / 2;
  const paths: string[] = [];

  for (const value of values) {
    const angle = (value / total) * Math.PI * 2;
    const endAngle = startAngle + angle;
    const x1 = cx + Math.cos(startAngle) * radius;
    const y1 = cy + Math.sin(startAngle) * radius;
    const x2 = cx + Math.cos(endAngle) * radius;
    const y2 = cy + Math.sin(endAngle) * radius;
    const largeArc = angle > Math.PI ? 1 : 0;

    if (innerRadius <= 0) {
      paths.push(
        `M ${formatNumber(cx)} ${formatNumber(cy)} L ${formatNumber(x1)} ${formatNumber(y1)} A ${formatNumber(radius)} ${formatNumber(radius)} 0 ${largeArc} 1 ${formatNumber(x2)} ${formatNumber(y2)} Z`,
      );
    } else {
      const ix1 = cx + Math.cos(startAngle) * innerRadius;
      const iy1 = cy + Math.sin(startAngle) * innerRadius;
      const ix2 = cx + Math.cos(endAngle) * innerRadius;
      const iy2 = cy + Math.sin(endAngle) * innerRadius;
      paths.push(
        `M ${formatNumber(x1)} ${formatNumber(y1)} A ${formatNumber(radius)} ${formatNumber(radius)} 0 ${largeArc} 1 ${formatNumber(x2)} ${formatNumber(y2)} L ${formatNumber(ix2)} ${formatNumber(iy2)} A ${formatNumber(innerRadius)} ${formatNumber(innerRadius)} 0 ${largeArc} 0 ${formatNumber(ix1)} ${formatNumber(iy1)} Z`,
      );
    }

    startAngle = endAngle;
  }

  return paths;
}

/** Gauge arc path from 0-100 value. */
export function buildGaugeArc(
  value: number,
  cx: number,
  cy: number,
  radius: number,
): string {
  const clamped = Math.max(0, Math.min(100, value));
  const startAngle = Math.PI;
  const endAngle = Math.PI + (clamped / 100) * Math.PI;
  const x1 = cx + Math.cos(startAngle) * radius;
  const y1 = cy + Math.sin(startAngle) * radius;
  const x2 = cx + Math.cos(endAngle) * radius;
  const y2 = cy + Math.sin(endAngle) * radius;
  const largeArc = clamped > 50 ? 1 : 0;
  return `M ${formatNumber(x1)} ${formatNumber(y1)} A ${formatNumber(radius)} ${formatNumber(radius)} 0 ${largeArc} 1 ${formatNumber(x2)} ${formatNumber(y2)}`;
}
