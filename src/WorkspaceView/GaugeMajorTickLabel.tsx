import { useTheme } from '@mui/material';
import { ChartsText } from '@mui/x-charts';
import { Property } from 'csstype';

type GaugeMajorTickLabelPosition = 'central' | 'left' | 'right';

interface GaugeMajorTickLabelProps {
  text: string;
  fontSize?: Property.FontSize<string | number>;
  position: GaugeMajorTickLabelPosition;
  x: number;
  y: number;
}

export function GaugeMajorTickLabel({ text, fontSize = undefined, position, x, y }: GaugeMajorTickLabelProps) {
  const theme = useTheme();

  const textAnchor = position === 'left' ? 'end' : position === 'right' ? 'start' : 'middle';
  const dominantBaseline = position === 'central' ? 'hanging' : 'central';

  return (
    <g>
      <ChartsText x={x} y={y} text={text} style={{ fontSize: fontSize, textAnchor: textAnchor, dominantBaseline: dominantBaseline }} fill={theme.palette.text.primary} />
    </g>
  );
}
