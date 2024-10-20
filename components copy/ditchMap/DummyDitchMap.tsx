import React from 'react';
import TopButtons from './TopButtons';
import DitchFab from '../elements/DitchFab';
import defaultEnvironment from '../../model/DefaultEnv.json';
import { View } from 'react-native';
import Mapbox from 'rnmapbox-ditch';

Mapbox.setAccessToken(defaultEnvironment.DitchMapKey);

const DummyDitchMap = () => {

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
      <View style={{ flex: 1, flexGrow: 1, height: '100%' }}>
        <Mapbox.MapView
          attributionEnabled={false}
          style={{ flex: 1 }}
          styleURL={defaultEnvironment.DitchMapStyles['Nav Chart']}
          zoomEnabled={true}
          logoEnabled={false}
        />
        <Mapbox.Camera
          defaultSettings={{
            centerCoordinate: [-76.67446, 34.73762],
            zoomLevel: 1.676,
          }}
        />
        <DitchFab showAcoe={true} />
        <TopButtons />
      </View>
    </View>
  );
};

export default DummyDitchMap;
