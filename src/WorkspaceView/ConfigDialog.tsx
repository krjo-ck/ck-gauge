import { ValidateableTextControl } from '@kvaser/canking-api/controls';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

interface Configuration {
  minSignalValue: number;
  maxSignalValue: number;
  decimals: number;
}

interface ConfigDialogProps {
  open: boolean;
  configuration: Configuration;
  onClose: () => void;
  onSave: (config: Configuration) => void;
}

function ConfigDialog({ open, configuration, onClose, onSave }: ConfigDialogProps) {
  const [minSignalValue, setMinSignalValue] = useState(configuration.minSignalValue);
  const [maxSignalValue, setMaxSignalValue] = useState(configuration.maxSignalValue);
  const [decimals, setDecimals] = useState(configuration.decimals);

  useEffect(() => {
    if (open) {
      setMinSignalValue(configuration.minSignalValue);
      setMaxSignalValue(configuration.maxSignalValue);
      setDecimals(configuration.decimals);
    }
  }, [open, configuration]);

  const handleSave = useCallback(() => {
    if (minSignalValue >= maxSignalValue) {
      alert('Min Signal Value must be less than Max Signal Value.');
      return;
    }
    onSave({ minSignalValue, maxSignalValue, decimals });
    onClose();
  }, [onClose, onSave, minSignalValue, maxSignalValue, decimals]);

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