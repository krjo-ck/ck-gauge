import { useTheme } from '@mui/material';
import { useGaugeState } from '@mui/x-charts';
import { GaugeMajorTickLabel } from './GaugeMajorTickLabel';

export function GaugeMajorTick({ value }: { value: number }) {
  const { outerRadius, innerRadius, cx, cy, valueMin, valueMax, startAngle, endAngle } = useGaugeState();
  const theme = useTheme();

  const valueAngle = (value - valueMin) / (valueMax - valueMin) * (endAngle - startAngle) + startAngle;
  const coord = {
    x1: cx + (innerRadius - 10) * Math.sin(valueAngle),
    y1: cy - (innerRadius - 10) * Math.cos(valueAngle),
    x2: cx + outerRadius * Math.sin(valueAngle),
    y2: cy - outerRadius * Math.cos(valueAngle),
  };

  const halfCx = cx / 2;
  const labelPos = coord.x1 < halfCx ? 'right' : coord.x1 > (cx + halfCx) ? 'left' : 'central';
  const labelX = labelPos === 'right' ? coord.x1 + 4 : labelPos === 'left' ? coord.x1 - 4 : coord.x1;
  const labelY = labelPos === 'central' ? coord.y1 + 4 : coord.y1;

  return (
    <>
    <g>
      <path
        d={`M ${coord.x1} ${coord.y1} L ${coord.x2} ${coord.y2}`}
        stroke={theme.palette.text.primary}
        strokeWidth={2} />
      </g>
      <GaugeMajorTickLabel
        text={value.toString()}
        fontSize="small"
        position={labelPos}
        x={labelX}
        y={labelY} />
    </>
  );
}
