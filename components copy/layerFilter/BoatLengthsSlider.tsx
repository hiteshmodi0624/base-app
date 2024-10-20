import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { boatLengthMeters } from '../../DitchStatics';
import usePrefs from '../../hooks/usePrefs';
import { getValueLabelFormat } from '@/utils';
import DitchText from '../typography/DitchText';
import { getMetricValue } from '../../utils';
import ToggleTile from '../settingsTile/ToggleTile';

const BoatLengthsSlider = () => {
  const { getPref, setPref } = usePrefs();
  const [minimum, setMinimum] = useState(getPref('ScatterFilterLengthStartIndex') ?? 0);
  const isMetric = getMetricValue();
  const [maximum, setMaximum] = useState(getPref('ScatterFilterLengthEndIndex') ?? boatLengthMeters.length);

  const handleBoatLengthChange = (value: number[]) => {
    setMinimum(value[0]);
    setMaximum(value[1]);

    setPref('ScatterFilterLengthStartIndex', value[0]);
    setPref('ScatterFilterLengthEndIndex', value[1]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <DitchText text="Boat Lengths" styles={{ margin: 'auto' }} fontSizeIndex={3} />
        <MultiSlider
          onValuesChange={(value) => handleBoatLengthChange(value)}
          snapped
          values={[minimum, maximum]}
          min={boatLengthMeters[0]}
          max={boatLengthMeters.length}
          step={1}
          selectedStyle={{ backgroundColor: '#34c759' }}
          sliderLength={240}
        />
      </View>
      <View style={styles.textContainer}>
        <DitchText text={getValueLabelFormat(minimum, isMetric)} fontSizeIndex={0} />
        <DitchText text={getValueLabelFormat(maximum, isMetric)} fontSizeIndex={0} />
      </View>
      <ToggleTile userSettingsKey="ScatterFilterOnlyLastMonth" title="Only Last Month" subscriptionLock />
      <ToggleTile userSettingsKey="ScatterFilterLocal" title="Local Vessels" subscriptionLock />
      <ToggleTile userSettingsKey="ScatterFilterNonLocal" title="Non-Local Vessels" subscriptionLock />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  sliderContainer: { marginVertical: 5, margin: 'auto', paddingHorizontal: 30 },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default BoatLengthsSlider;
