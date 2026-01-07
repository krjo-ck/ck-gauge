import { CheckboxControl, ValidateableTextControl } from '@kvaser/canking-api/controls';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

export interface Configuration {
  minSignalValue: number;
  maxSignalValue: number;
  decimals: number;
  showUnitLabel: boolean;
  showValueLabel: boolean;
  showPointer: boolean;
  showTicks: boolean;
  majorTicks: number;
  minorTicksPerMajor: number;
}

interface ConfigDialogProps {
  open: boolean;
  configuration: Configuration;
  onClose: () => void;
  onSave: (config: Configuration) => void;
}

function ConfigDialog(props: ConfigDialogProps) {
  const { open, configuration, onClose, onSave } = props;

  const [minSignalValue, setMinSignalValue] = useState(configuration.minSignalValue);
  const [maxSignalValue, setMaxSignalValue] = useState(configuration.maxSignalValue);
  const [decimals, setDecimals] = useState(configuration.decimals);
  const [showUnitLabel, setShowUnitLabel] = useState(configuration.showUnitLabel);
  const [showValueLabel, setShowValueLabel] = useState(configuration.showValueLabel);
  const [showPointer, setShowPointer] = useState(configuration.showPointer);
  const [showTicks, setShowTicks] = useState(configuration.showTicks);
  const [majorTicks, setMajorTicks] = useState(configuration.majorTicks);
  const [minorTicksPerMajor, setMinorTicksPerMajor] = useState(configuration.minorTicksPerMajor);

  useEffect(() => {
    if (open) {
      setMinSignalValue(configuration.minSignalValue);
      setMaxSignalValue(configuration.maxSignalValue);
      setDecimals(configuration.decimals);
      setShowUnitLabel(configuration.showUnitLabel);
      setShowValueLabel(configuration.showValueLabel);
      setShowPointer(configuration.showPointer);
      setShowTicks(configuration.showTicks);
      setMajorTicks(configuration.majorTicks);
      setMinorTicksPerMajor(configuration.minorTicksPerMajor);
    }
  }, [open, configuration]);

  const handleSave = useCallback(() => {
    if (minSignalValue >= maxSignalValue) {
      alert('Min Signal Value must be less than Max Signal Value.');
      return;
    }
    onSave({
      minSignalValue,
      maxSignalValue,
      decimals,
      showUnitLabel,
      showValueLabel,
      showPointer,
      showTicks,
      majorTicks,
      minorTicksPerMajor,
    });
    onClose();
  }, [
    onClose,
    onSave,
    minSignalValue,
    maxSignalValue,
    decimals,
    showUnitLabel,
    showValueLabel,
    showPointer,
    showTicks,
    majorTicks,
    minorTicksPerMajor,
  ]);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={'md'}
    >
      <DialogTitle className="draggable">Gauge Configuration</DialogTitle>
      <DialogContent dividers>
        <ValidateableTextControl numberType='float' value={minSignalValue.toString()} onChange={e => setMinSignalValue(Number(e))} label="Min Signal Value" />
        <ValidateableTextControl numberType='float' value={maxSignalValue.toString()} onChange={e => setMaxSignalValue(Number(e))} label="Max Signal Value" />
        <ValidateableTextControl numberType='int' minValue={0} maxValue={15} value={decimals.toString()} onChange={e => setDecimals(Number(e))} label="Decimals" />
        <CheckboxControl checked={showUnitLabel} onChange={e => setShowUnitLabel(e)} label="Show Unit" />
        <CheckboxControl checked={showValueLabel} onChange={e => setShowValueLabel(e)} label="Show Value" />
        <CheckboxControl checked={showPointer} onChange={e => setShowPointer(e)} label="Show Pointer" />
        <CheckboxControl checked={showTicks} onChange={e => setShowTicks(e)} label="Show Ticks" />
        <ValidateableTextControl numberType='int' minValue={0} maxValue={100} value={majorTicks.toString()} onChange={e => setMajorTicks(Number(e))} label="Major Ticks" />
        <ValidateableTextControl numberType='int' minValue={0} maxValue={100} value={minorTicksPerMajor.toString()} onChange={e => setMinorTicksPerMajor(Number(e))} label="Minor Ticks Per Major" />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" size="large">
          Save
        </Button>
        <Button onClick={onClose} variant="outlined" size="large">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfigDialog;