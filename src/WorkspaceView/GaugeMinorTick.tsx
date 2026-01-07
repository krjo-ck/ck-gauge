import { useTheme } from '@mui/material';
import { useGaugeState } from '@mui/x-charts';

export function GaugeMinorTick({ value }: { value: number }) {
  const { outerRadius, innerRadius, cx, cy, valueMin, valueMax, startAngle, endAngle } = useGaugeState();
  const theme = useTheme();

  const valueAngle = (value - valueMin) / (valueMax - valueMin) * (endAngle - startAngle) + startAngle;
  const coord = {
    x1: cx + innerRadius * Math.sin(valueAngle),
    y1: cy - innerRadius * Math.cos(valueAngle),
    x2: cx + outerRadius * Math.sin(valueAngle),
    y2: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <path
        d={`M ${coord.x1} ${coord.y1} L ${coord.x2} ${coord.y2}`}
        stroke={theme.palette.text.primary}
        strokeWidth={1} />
    </g>
  );
}
