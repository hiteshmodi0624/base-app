import Mapbox, { UserLocation } from 'rnmapbox-ditch';
import usePrefs from '@/hooks/usePrefs';
import React, { useEffect, useRef, useState } from 'react';
import { addBreadCrumb, getDitchLayers, getHeadingAngleByAveraging, getUserLocation, lineWidthArray, setUserLocation } from '@/utils';
import { Animated, Dimensions } from 'react-native';
import useDitchMap from '@/hooks/useDitchMap';
import { getCoordinateFromView, getPointInView, setCameraPosition } from '@/hooks/useMapboxLibraries';
import useUtils from '@/hooks/useUtils';

let waitUntil = 0;
let lastUpdateTime = 0;
const headingHistory: number[] = [];
const speedHistory: number[] = [];
const DitchLocation = () => {
  const { getPref } = usePrefs();
  const layers = getDitchLayers();
  const { satellite, styleLoaded } = useDitchMap();
  const { noseLine, noseLineRotation, markerRotation, onUserLocationUpdate } = useDitchLocation();  
  return (
    <UserLocation
      onUpdate={onUserLocationUpdate}
      visible
      showsUserHeadingIndicator={noseLine && getPref('ShowHeadingLine')}
      animated={true}
      minDisplacement={0}
    >
      <Mapbox.Animated.SymbolLayer
        key="noseLine"
        id="noseLine"
        style={{
          iconImage: 'noseLine',
          iconSize: noseLine && getPref('ShowHeadingLine') ? lineWidthArray(0.5) : 0,
          iconRotate: noseLineRotation,
          iconAllowOverlap: true,
        }}
        belowLayerID={
          styleLoaded === false || satellite
            ? undefined
            : layers.find((layer) => layer.Name.startsWith('boy') || layer.Name.startsWith('day'))?.Name
        }
      />
      {
        <Mapbox.Animated.SymbolLayer
          key="boatIcon"
          id="boatIcon"
          style={{
            iconImage: 'userLocationHeading',
            iconSize: lineWidthArray(0.3),
            iconRotate: markerRotation,
            iconAllowOverlap: true,
          }}
        />
      }
    </UserLocation>
  );
};
export default DitchLocation;

const useDitchLocation = () => {
  const animationDuration = 500;
  const { showSnackbar } = useUtils();
  const { followingUser, northUp, heading, refreshVisibleFeatures, setLastSpeed } = useDitchMap();
  const [iconRotate, setIconRotate] = useState(0);
  const [prevIconRotate, setPrevIconRotate] = useState(0);
  const [noseLine, setShowNoseLine] = useState(false);
  const { getPref } = usePrefs();
  const { height } = Dimensions.get('window');

  const noseLineRotation = useRef(new Animated.Value(0)).current;
  const markerRotation = useRef(new Animated.Value(0)).current;
  const calculateAnimationRange = (start: number, end: number) => {
    let delta = end - start;
    if (Math.abs(delta) > 180) {
      delta = delta > 0 ? delta - 360 : delta + 360;
    }
    return [start, start + delta];
  };

  useEffect(() => {
    if (noseLine) {
      showSnackbar('Ditch detects movement', 15);
    }
  }, [noseLine]);

  const captureBreadCrumbs = async (latitude: number, longitude: number, speed: number, timestamp: number, atMotion: boolean) => {
    const showBreadCrumbs = getPref('ShowBreadCrumbs');
    if (atMotion) {
      const newBreadcrumb = await addBreadCrumb({ lat: latitude, lng: longitude }, timestamp, speed);
      if (newBreadcrumb && showBreadCrumbs) {
        refreshVisibleFeatures();
      }
    }
  };

  const updateMap = async(
    headingAngle: number,
    latitude: number,
    longitude: number,
    atMotion: boolean,
    timestamp: number,
  ) => {
    const shouldUpdateMapHeading = followingUser && Math.abs(headingAngle - heading) > getPref('SnapBackDegrees') && !northUp;
    const northUpValueChanged = (northUp && heading !== 0) || (!northUp && heading === 0);
    const currentLocation = getUserLocation();
    const firstLoad = currentLocation === undefined;
    setUserLocation(latitude, longitude, headingAngle);
    if (waitUntil > timestamp) {
      return;
    }
    if (shouldUpdateMapHeading) {
      waitUntil = timestamp + animationDuration;
    }
    setPrevIconRotate(iconRotate);
    setIconRotate(shouldUpdateMapHeading ? 0 : headingAngle - heading);
    setShowNoseLine(atMotion);
    if (followingUser) {
      // wait for noseLine update in case of northUp value change
      if (northUpValueChanged || firstLoad) {
        waitUntil = timestamp + 2 * animationDuration;
        setShowNoseLine(false);
      }
      const point = await getPointInView([longitude, latitude]);
      const newPosition = await getCoordinateFromView([point.x, point.y - height / 6]);

      setCameraPosition({
        heading: northUp ? 0 : shouldUpdateMapHeading ? headingAngle : undefined,
        longitude: point.x === -1 || northUp === true ? longitude : newPosition[0],
        latitude: point.x === -1 || northUp === true ? latitude : newPosition[1],
        animationDuration: firstLoad ? 1 : animationDuration,
        zoom: firstLoad ? 16 : undefined,
      });
    }
  };

  const onUserLocationUpdate = async (location: Mapbox.Location) => {
    const timestamp = location.timestamp ?? Date.now();
    if (timestamp - lastUpdateTime < 1000) return;
    const { latitude, longitude } = location.coords;
    const minSpeed = getPref('MinSpeedForBreadcrumb');
    const accuracy = location.coords.accuracy ?? 0;
    if (location.coords.course) {
      const sampleSize = getPref('NoseLineSampleSize');
      headingHistory.push(location.coords.course);
      if (headingHistory.length > sampleSize) {
        headingHistory.shift();
      }
    }
    if (location.coords.speed && timestamp - lastUpdateTime >= 1000) {
      speedHistory.push(location.coords.speed);
      if (speedHistory.length > 5) {
        speedHistory.shift();
      }
    }
    const speed = speedHistory.reduce((a, b) => a + b, 0) / 5;
    if (accuracy > 100) {
      return;
    }
    if (timestamp % 20000 <= 1000) {
      setLastSpeed(speed);
    }
    lastUpdateTime = timestamp;
    const atMotion = speed >= minSpeed;
    await captureBreadCrumbs(latitude, longitude, speed, timestamp, atMotion);
    const headingAngle = getHeadingAngleByAveraging(headingHistory)
    updateMap(headingAngle, latitude, longitude, atMotion, timestamp);
  };

  useEffect(() => {
    const [noseLineFromValue, noseLineToValue] = calculateAnimationRange(prevIconRotate - 90, iconRotate - 90);
    const [markerFromValue, markerToValue] = calculateAnimationRange(prevIconRotate, iconRotate);
    noseLineRotation.setValue(noseLineFromValue);
    markerRotation.setValue(markerFromValue);
    Animated.timing(noseLineRotation, {
      toValue: noseLineToValue,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(markerRotation, {
      toValue: markerToValue,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }, [iconRotate]);

  return { onUserLocationUpdate, noseLine, noseLineRotation, markerRotation };
};
