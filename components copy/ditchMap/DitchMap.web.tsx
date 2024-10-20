import { View } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import Map, { GeolocateControl } from 'react-map-gl';
import { accessToken, snackbarMessages } from '@/DitchStatics';
import { getStyleString, getAccessToken, getSelectH3State, setUserLocation, log } from '@/utils';
import useLayerFilters from '../../hooks/useLayerFilters';
import usePrefs from '@/hooks/usePrefs';
import useMapbox from '../../hooks/useMapbox';
import mapboxgl from 'mapbox-gl';
import DitchMarkers from './DitchMarkers';
import DitchLayers from './DitchLayers';
import useUtils from '@/hooks/useUtils';
import useH3 from '@/hooks/useH3';
import useSubscription from '@/hooks/useSubscription';
import { getMapboxWebMap, recenter } from '@/hooks/useMapboxLibraries.web';
import Mapbox from 'rnmapbox-ditch';
import useDitchMap from '@/hooks/useDitchMap';

const DitchWeb = () => {
  Mapbox.setAccessToken(getAccessToken());
  const map = getMapboxWebMap();
  const { setInitialSettings } = useLayerFilters();
  const { getPref, prefs } = usePrefs();
  const { showSnackbar } = useUtils();
  const { followingUser, setFollowingUser, setLastZoom, setUserLocationOnMap, setStylesLoaded, styleLoaded } = useDitchMap();
  const { mapTapped, onStylesLoad, layerTapped } = useMapbox();
  const { onlySubscribers } = useSubscription();
  const [mapStyles, setMapStyles] = useState<string | undefined>();
  const [token, setToken] = useState(accessToken);
  const geoControlRef = useRef<mapboxgl.GeolocateControl>(null);
  const { H3Layers, selectH3 } = useH3();
  useEffect(() => {
    const styleStrings = getStyleString();
    const access_token = getAccessToken();
    setToken(access_token);
    setStylesLoaded(false);
    setMapStyles(styleStrings[getPref('DitchMapStyleIndex')]);
  }, [prefs.DitchMapStyleIndex]);

  useEffect(() => {
    if (styleLoaded && geoControlRef && geoControlRef.current && followingUser) {
      setFollowingUser(geoControlRef.current?.trigger());
    }
  }, [geoControlRef.current, followingUser, styleLoaded]);

  useEffect(() => {
    if (styleLoaded) {
      setInitialSettings();
    }
  }, [styleLoaded, prefs]);

  const errorLocatingUser = () => {
    showSnackbar('Location not found. Please try again.');
    setFollowingUser(false);
  }

  return (
    <View style={{ flexGrow: 1, height: '100%', position: 'relative' }}>
      {mapStyles && (
        <Map
          attributionControl={false}
          mapLib={mapboxgl}
          interactiveLayerIds={['smartPath', 'importedPath', 'interimPath', ...H3Layers.map((layers) => layers.source)]}
          scrollZoom
          mapboxAccessToken={token}
          style={{ flex: 1 }}
          bearing={0}
          pitch={0}
          mapStyle={mapStyles}
          onClick={(e) => {
            if (e.features && H3Layers.length > 0 && getSelectH3State()) {
              const id = e.features.find((f) => H3Layers.find((l) => l.source === f.layer.id))?.layer.id;
              if (id) {
                selectH3(id);
                return;
              }
            }
            if (e.features && e.features.length > 0) {
              const id = e.features.find((f) => H3Layers.find((l) => l.source === f.layer.id) === undefined)?.layer.id;
              if (id) {
                layerTapped(e.lngLat, { x: e.point.x, y: e.point.y }, id);
                return;
              }
            }
            onlySubscribers(() => mapTapped(e.point, e.lngLat));
          }}
          onStyleData={async () => {
            await onStylesLoad();
            setStylesLoaded(true);
          }}
          initialViewState={{
            bounds: [
              [-125.39, 24.49],
              [-60.22, 50.08],
            ],
          }}
          onMoveEnd={(evt) => {
            if (followingUser && evt.originalEvent) setFollowingUser(false);
            setLastZoom(evt.viewState.zoom);
            setUserLocationOnMap(evt.viewState.latitude, evt.viewState.longitude);
          }}
          ref={map}
        >
          <GeolocateControl
            ref={geoControlRef}
            style={{ display: 'none' }}
            onGeolocate={(e) => {
              setUserLocation(e.coords.latitude, e.coords.longitude, 0);
              log(e.coords);
              recenter();
            }}
            onTrackUserLocationStart={() => showSnackbar(snackbarMessages.reRouting)}
            onError={errorLocatingUser}
            onOutOfMaxBounds={errorLocatingUser}
          />{' '}
          <DitchMarkers />
          {styleLoaded && <DitchLayers />}
        </Map>
      )}
    </View>
  );
};

export default DitchWeb;
