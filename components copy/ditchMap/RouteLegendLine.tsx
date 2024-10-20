import { BoatPathType } from '@/DitchStatics';
import { getColorValue } from '@/utils';
import React from 'react';
import { View } from 'react-native';

const RouteLegendLine = ({ boatPathType }: { boatPathType: number }) => {
  const lineStyle = {
    backgroundColor: getColorValue(boatPathType),
  };
  const widthArray =
    boatPathType === BoatPathType.smartPath || boatPathType === BoatPathType.gpxImport
      ? widths.straight
      : boatPathType === BoatPathType.noWakeZone
        ? widths.smallMidDash
        : widths.dashed;
  return (
    <View style={{ justifyContent: 'space-between', flexDirection: 'row', gap: 3 }}>
      {widthArray.map((width, i) => (
        <View style={[lineStyle, { width, padding: 1.5 }]} key={i} />
      ))}
    </View>
  );
};
export default RouteLegendLine;

const widths = {
  straight: [24],
  dashed: [6, 6, 6],
  smallMidDash: [7, 4, 7],
};
