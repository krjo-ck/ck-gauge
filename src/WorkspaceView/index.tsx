import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjectData, useSignalData } from '@kvaser/canking-api/hooks';
import { SelectSignalDialog } from '@kvaser/canking-api/controls';
import { FrameDefinition, SignalDefinition } from '@kvaser/canking-api/models';
import { EditIcon, MoreHorizIcon } from '@kvaser/canking-api/icons';
import { Box, IconButton, Typography } from '@mui/material';
import { GaugeContainer, GaugeReferenceArc, GaugeValueArc } from '@mui/x-charts';
import ConfigDialog, { Configuration } from './ConfigDialog';
import { GaugePointer } from './GaugePointer';
import { GaugeMajorTick } from './GaugeMajorTick';
import { GaugeMinorTick } from './GaugeMinorTick';
import { GaugeLabel } from './GaugeLabel';

// If any data should be stored in the project file then add it to this interface
interface IProjectData {
  // Selected qualified signal name
  qualifiedSignalName: string | null;
  // Selected signal's name
  signalName: string | null;
  // Selected signal's unit
  signalUnit: string | null;
  // Min signal value
  minSignalValue: number;
  // Max signal value
  maxSignalValue: number;
  // Number of decimals to show
  decimals: number;
  // Show gauge unit label
  showUnitLabel: boolean;
  // Show gauge value label
  showValueLabel: boolean;
  // Show gauge pointer
  showPointer: boolean;
  // Show gauge ticks
  showTicks: boolean;
  // Number of major ticks
  majorTicks: number;
  // Number of minor ticks between major ticks
  minorTicksPerMajor: number;
}

// Define any default values for the project data that will be used when the component is created
const defaultProjectData: IProjectData = {
  qualifiedSignalName: null,
  signalName: null,
  signalUnit: null,
  minSignalValue: -500,
  maxSignalValue: 500,
  decimals: 2,
  showUnitLabel: true,
  showValueLabel: true,
  showPointer: true,
  showTicks: true,
  majorTicks: 7,
  minorTicksPerMajor: 4,
};

// This component is the component that will be loaded into the Workspace view
function WorkspaceView() {
  // Get this view's unique id from search params
  const [searchParams] = useSearchParams();
  const idString = searchParams.get('id');
  const id = idString !== null ? Number.parseInt(idString, 10) : -1;

  // Use the useProjectData hook to serialize/deserialize your view data to the project
  const { projectData, setProjectData } = useProjectData<IProjectData>(id, defaultProjectData);

  const [showSelectSignalDialog, setShowSelectSignalDialog] = useState(false);
  const handleOpenSelectSignalDialog = useCallback(() => {
    setShowSelectSignalDialog(true);
  }, []);
  const handleCloseSelectSignalDialog = useCallback(() => {
    setShowSelectSignalDialog(false);
  }, []);
  const handleSelectSignal = useCallback((_message: FrameDefinition, signal: SignalDefinition) => {
    setProjectData(curr => ({
      ...curr,
      qualifiedSignalName: signal.qualifiedName,
      signalName: signal.name,
      signalUnit: signal.unit,
      minSignalValue: signal.minValue < signal.maxValue ? signal.minValue : defaultProjectData.minSignalValue,
      maxSignalValue: signal.minValue < signal.maxValue ? signal.maxValue : defaultProjectData.maxSignalValue,
    }));
  }, [setProjectData]);

  const qualifiedSignalNames = useMemo(() => projectData.qualifiedSignalName ? [projectData.qualifiedSignalName] : [], [projectData.qualifiedSignalName]);
  const signalData = useSignalData(qualifiedSignalNames);
  const signalValue = useMemo(() => signalData.length > 0 ? signalData[0].doubleValue : 0, [signalData]);
  const signalText = useMemo(() => {
    if (projectData.qualifiedSignalName === null) {
      return 'No signal selected';
    }
    const signal = signalData[0];
    if (signal?.doubleValue === undefined) {
      return 'No data';
    }
    return `${signal.doubleValue.toFixed(projectData.decimals)}`;
  }, [projectData.qualifiedSignalName, projectData.decimals, signalData]);

  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const handleOpenConfigDialog = useCallback(() => {
    setShowConfigDialog(true);
  }, []);
  const handleCloseConfigDialog = useCallback(() => {
    setShowConfigDialog(false);
  }, []);
  const handleSaveConfig = useCallback((config: Configuration) => {
    setProjectData(curr => ({
      ...curr,
      minSignalValue: config.minSignalValue,
      maxSignalValue: config.maxSignalValue,
      decimals: config.decimals,
      showPointer: config.showPointer,
      showUnitLabel: config.showUnitLabel,
      showValueLabel: config.showValueLabel,
      showTicks: config.showTicks,
      majorTicks: config.majorTicks,
      minorTicksPerMajor: config.minorTicksPerMajor,
    }));
    setShowConfigDialog(false);
  }, [setProjectData]);

  return (
    <Box aria-label="canking-extension-view" height={'100%'} width={'100%'} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <SelectSignalDialog open={showSelectSignalDialog} onClose={handleCloseSelectSignalDialog} onSelect={handleSelectSignal} modal parentDialogTitle="Gauge" />
      <ConfigDialog open={showConfigDialog} configuration={projectData} onClose={handleCloseConfigDialog} onSave={handleSaveConfig} />
      <Box mt={2} width="100%" display="flex" alignItems="center">
        <Typography variant="h6" ml={13.6} width="100%" textAlign="center">{projectData.signalName ?? ''}</Typography>
        <IconButton aria-label="select-signal" title="Select Signal" onClick={handleOpenSelectSignalDialog} size="small" sx={{ ml: 1 }}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="edit-config" title="Edit Configuration" onClick={handleOpenConfigDialog} size="small" sx={{ ml: 1 }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
      <GaugeContainer startAngle={-110} endAngle={110} valueMin={projectData.minSignalValue} valueMax={projectData.maxSignalValue} value={signalValue}>
        <GaugeReferenceArc />
        <GaugeValueArc skipAnimation />
        {projectData.showTicks && Array.from({ length: projectData.majorTicks }, (_, i) => {
          const majorTickValue = projectData.minSignalValue + i * (projectData.maxSignalValue - projectData.minSignalValue) / (projectData.majorTicks - 1);
          return (
            <GaugeMajorTick key={`major-tick-${i}`} value={majorTickValue} />
          );
        })}
        {projectData.showTicks && Array.from({ length: projectData.majorTicks - 1 }, (_major, i) => {
          return Array.from({ length: projectData.minorTicksPerMajor }, (_minor, j) => {
            const minorTickValue = projectData.minSignalValue + (i + (j + 1) / (projectData.minorTicksPerMajor + 1)) * (projectData.maxSignalValue - projectData.minSignalValue) / (projectData.majorTicks - 1);
            return (
              <GaugeMinorTick key={`minor-tick-${i}-${j}`} value={minorTickValue} />
            );
          });
        })}
        {projectData.showUnitLabel && <GaugeLabel text={projectData.signalUnit ?? ''} position="above" fontSize="small" />}
        {projectData.showValueLabel && <GaugeLabel text={signalText} position="below" fontSize="large" />}
        {projectData.showPointer && <GaugePointer />}
      </GaugeContainer>
    </Box>
  );
}

export default WorkspaceView;
