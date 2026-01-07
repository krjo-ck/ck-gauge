import { useTheme } from '@mui/material';
import { useGaugeState } from '@mui/x-charts';

export function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  const theme = useTheme();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={theme.palette.secondary.main} />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke={theme.palette.secondary.main}
        strokeWidth={3} />
    </g>
  );
}
