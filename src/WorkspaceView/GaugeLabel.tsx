import { useTheme } from '@mui/material';
import { ChartsText, useGaugeState } from '@mui/x-charts';
import { Property } from 'csstype';

type GaugeLabelPosition = 'central' | 'above' | 'below';

interface GaugeLabelProps {
  text: string;
  fontSize?: Property.FontSize<string | number>;
  position?: GaugeLabelPosition;
}

export function GaugeLabel({ text, fontSize = undefined, position = 'central' }: GaugeLabelProps) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = useGaugeState();
  const theme = useTheme();

  const startMaxY = Math.min(cy - outerRadius * Math.cos(startAngle), cy - innerRadius * Math.cos(startAngle));
  const endMaxY = Math.min(cy - outerRadius * Math.cos(endAngle), cy - innerRadius * Math.cos(endAngle));
  const gaugeMaxY = Math.min(startMaxY, endMaxY);
  const aboveY = cy - (innerRadius / 2);
  let belowY = cy + (innerRadius / 2);
  if (belowY > gaugeMaxY) {
    belowY = gaugeMaxY;
  }
  const yPos = position === 'above' ? aboveY :  position === 'below' ? belowY : cy;

  const dominantBaseline = position === 'central' ? 'central' : 'auto';

  return (
    <g>
      <ChartsText x={cx} y={yPos} text={text} style={{ fontSize: fontSize, textAnchor: 'middle', dominantBaseline: dominantBaseline }} fill={theme.palette.text.primary} />
    </g>
  );
}
