import React from 'react';
import { View, StyleSheet } from 'react-native';
import Circle from './Circle'; // Assuming Circle component is already converted
import DitchText from '../typography/DitchText';
import RouteLegendLine from '../ditchMap/RouteLegendLine';
import { BoatPathType, Conversions } from '@/DitchStatics';
import CloseButton from '../shared/CloseButton';
import useLayerFilters from '@/hooks/useLayerFilters';
import { localUnitString } from '@/utils';
import usePrefs from '@/hooks/usePrefs';
import useUnderway from '@/hooks/useUnderway';

const AcoeLegend = () => {
  const { toggleAcoe } = useLayerFilters();
  const { prefs } = usePrefs();
  const { isUnderway } = useUnderway();
  if (isUnderway) return null;
  return (
    <View style={styles.container}>
      <CloseButton onCloseHandler={toggleAcoe} position={5} size={18} />
      <View style={styles.legendRow}>
        <DitchText styles={styles.legendText} text="Smart Path" fontSizeIndex={2} />
        <RouteLegendLine boatPathType={BoatPathType.smartPath} />
      </View>
      <View style={styles.legendRow}>
        <DitchText styles={styles.legendText} text="No Wake" fontSizeIndex={2} />
        <RouteLegendLine boatPathType={BoatPathType.noWakeZone} />
      </View>
      <View style={styles.legendRow}>
        <DitchText styles={styles.legendText} text="Imported" fontSizeIndex={2} />
        <View style={{ gap: 3, marginVertical: 'auto' }}>
          <RouteLegendLine boatPathType={BoatPathType.gpxImport} />
          <RouteLegendLine boatPathType={BoatPathType.importedRoute} />
        </View>
      </View>
      <View style={styles.legendRow}>
        <DitchText styles={styles.legendText} text="Not Found" fontSizeIndex={2} />
        <RouteLegendLine boatPathType={BoatPathType.notFound} />
      </View>
      <View style={styles.legendRow}>
        <DitchText styles={styles.legendText} text="Local" fontSizeIndex={2} />
        <Circle backgroundColor="#79cdff" diameter={20} />
        <Circle backgroundColor="#79cdff" diameter={10} />
      </View>
      <View style={styles.legendRow}>
        <DitchText styles={styles.legendText} text="Other" fontSizeIndex={2} />
        <Circle backgroundColor="#d7d7d7" diameter={20} />
        <Circle backgroundColor="#d7d7d7" diameter={10} />
      </View>
      <View style={styles.table}>
        {Object.entries(depthColorsInMeters).map(([depth, color]) => (
          <View style={styles.tableRow} key={depth}>
            <DitchText styles={styles.tableText} text={localUnitString(parseFloat(depth), prefs.UseMetric)} fontSizeIndex={2} />
            <View style={[styles.colorBox, { backgroundColor: color }]} />
          </View>
        ))}
      </View>
    </View>
  );
};

const depthColorsInMeters = {
  [2 * Conversions.feetToMeter]: '#b81d1c',
  [5 * Conversions.feetToMeter]: '#f55829',
  [8 * Conversions.feetToMeter]: '#f7e969',
  [12 * Conversions.feetToMeter]: '#42f56e',
  [14 * Conversions.feetToMeter]: '#66def7',
  [16 * Conversions.feetToMeter]: '#b6daf6',
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 10,
    paddingTop: 20,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
    justifyContent: 'flex-end',
  },
  legendText: {
    margin: 1,
    marginRight: 3,
  },
  table: {
    marginLeft: 10,
    marginTop: 5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tableText: {
    textAlign: 'right',
    marginRight: 3,
  },
  colorBox: {
    width: 30,
    height: 20,
  },
});

export default AcoeLegend;
