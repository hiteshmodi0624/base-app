import { useEffect, useState } from 'react';
import { getCamera } from '../../DitchStore';
import { accessToken } from '../../DitchStatics';
import useMapbox from '../../hooks/useMapbox';
import useLayerFilters from '../../hooks/useLayerFilters';
import DitchFab from '../elements/DitchFab';
import TopButtons from './TopButtons';
import { View } from 'react-native';
import * as Linking from 'expo-linking';
import Mapbox from 'rnmapbox-ditch';
import usePrefs from '@/hooks/usePrefs';
import DitchMarkers from './DitchMarkers';
import DitchLayers from './DitchLayers';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { getStyleString, getAccessToken } from '@/utils';
import React from 'react';
import BoatIcon from '../../assets/images/boatIcon.png';
import NoseLine from '../../assets/images/noseLine.png';
import DitchLocation from './DitchLocation';
import useSubscription from '@/hooks/useSubscription';
import { getMapboxMap } from '@/hooks/useMapboxLibraries';
import useDitchMap from '@/hooks/useDitchMap';
import useGPX from '@/hooks/useGPX';

Mapbox.setAccessToken(accessToken);

const DitchMap = () => {
  const map = getMapboxMap();
  const { setInitialSettings } = useLayerFilters();
  const { mapTapped, onStylesLoad } = useMapbox();
  const { getPref, prefs } = usePrefs();
  const [mapStyles, setMapStyles] = useState<string | undefined>(undefined);
  const camera = getCamera();
  const { setLastZoom, setUserLocationOnMap, heading, setFollowingUser, setNorthUp, setHeading, styleLoaded, setStylesLoaded } =
    useDitchMap();
  const { onlySubscribers, isSubscribed } = useSubscription();
  const link = Linking.useURL();
  
  useEffect(() => {
    if (link) handleLink({ url: link });
  }, [link]);

  const { handleLink } = useGPX();

  useEffect(() => {
    const styleStrings = getStyleString();
    const access_token = getAccessToken();
    Mapbox.setAccessToken(access_token);
    setStylesLoaded(false);
    setMapStyles(styleStrings[getPref('DitchMapStyleIndex')]);
  }, [prefs.DitchMapStyleIndex]);

  useEffect(() => {
    if (styleLoaded) {
      setInitialSettings();
    }
    if (getPref('KeepScreenAwake')) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [styleLoaded, prefs, isSubscribed]);

  return (
    <View style={{ flexGrow: 1, height: '100%', position: 'relative' }}>
      {mapStyles && (
        <Mapbox.MapView
          attributionEnabled={false}
          onTouchMove={() => {
            setFollowingUser(false);
            if (heading !== 0) {
              setNorthUp(false);
            }
          }}
          logoEnabled={false}
          style={{ flex: 1 }}
          styleURL={mapStyles}
          gestureSettings={{ pitchEnabled: false, rotateEnabled: false }}
          onPress={async (e) => {
            if (!e || !e.properties) return;
            const geometry = e.geometry as Point;
            const lngLat = {
              lat: geometry.coordinates[1],
              lng: geometry.coordinates[0],
            };
            onlySubscribers(() =>
              mapTapped(
                {
                  x: e?.properties?.screenPointX ?? (0 as number),
                  y: e?.properties?.screenPointY ?? (0 as number),
                },
                lngLat,
              ),
            );
          }}
          onDidFinishLoadingStyle={async () => {
            await onStylesLoad();
            setStylesLoaded(true);
          }}
          onCameraChanged={(state) => {
            setLastZoom(state.properties.zoom);
            setUserLocationOnMap(state.properties.center[1], state.properties.center[0]);
            if (heading !== state.properties.heading) setHeading(state.properties.heading);
          }}
          zoomEnabled={true}
          ref={map}
        >
          <Mapbox.Camera
            ref={camera}
            animationDuration={200}
            allowUpdates={true}
            animationMode="moveTo"
            defaultSettings={{
              bounds: {
                ne: [-125.39, 24.49],
                sw: [-60.22, 50.08],
              },
            }}
          />
          <Mapbox.Images images={{ 'boat-icon': BoatIcon, userLocationHeading: BoatIcon, noseLine: NoseLine }} />
          <DitchLayers />
          <DitchMarkers />
          <DitchLocation />
        </Mapbox.MapView>
      )}
    </View>
  );
};

export default DitchMap;

Mapbox.Logger.setLogCallback((log) => {
  // remove Source RNMBX-mapview-point-annotations_drag
  if (log.message.includes('RNMBX-mapview-point-annotations_drag') || log.message.includes('RNMBX-mapview-callouts_drag')) {
    return true;
  }
  return false;
});
