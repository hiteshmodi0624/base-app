import { View, StyleSheet } from 'react-native';
import React, { useMemo, useState } from 'react';
import DitchText from '../typography/DitchText';
import DitchIcon from '../ui/DitchIcon';
import BlankButton from '../ui/button/BlankButton';
import CenteredMenu from '../ui/CenteredMenu';
import usePrefs from '@/hooks/usePrefs';
import InputTile from '../settingsTile/InputTile';
import { activeRoutePointNearest, forceDec, formatTime, getUserLocation, localUnitString } from '@/utils';
import useDitchMap from '@/hooks/useDitchMap';
import { Conversions } from '@/DitchStatics';
import haversineDistance from 'haversine-distance';
import ToggleSwitch from '../ui/ToggleSwitch';
import useBlobs from '@/hooks/useBlobs';
import useUnderway from '@/hooks/useUnderway';

const DitchSegments = () => {
  const [completeVisible, setCompleteVisible] = useState(false);
  const [showBoatSpeedSettings, setShowBoatSpeedSettings] = useState(false);
  const { lastSpeed, refreshMapCounter } = useDitchMap();
  const { prefs, setPref } = usePrefs();
  const { isUnderway } = useUnderway();
  const { activeRoute } = useBlobs();
  const toggleCompleteVisibility = () => {
    setCompleteVisible(!completeVisible);
  };
  const toggleShowBoatSpeedSettings = () => {
    setShowBoatSpeedSettings(!showBoatSpeedSettings);
  };
  const userLocation = getUserLocation();
  const values = useMemo(() => {
    if (!activeRoute) return null;
    const cruisingTime = (activeRoute.cruisingDistance * Conversions.metersToNauticalMiles) / prefs.CruisingSpeed;
    const noWakeTime = (activeRoute.noWakeDistance * Conversions.metersToNauticalMiles) / prefs.IdleSpeed;
    let waypointIndex = 0;
    let coordinateIndex = 0;
    let distanceToSmartRoute = 0;
    if (userLocation) {
      const ditchCoord = { lat: userLocation.lat, lng: userLocation.lng };
      [waypointIndex, coordinateIndex] = activeRoutePointNearest(ditchCoord);
      if (waypointIndex !== undefined && coordinateIndex !== undefined) {
        const waypoint = activeRoute.waypoints[waypointIndex];
        if (waypoint === undefined || waypoint.coordinates[coordinateIndex + 1] === undefined) return null;
        distanceToSmartRoute = haversineDistance(ditchCoord, waypoint.coordinates[coordinateIndex + 1]);
      }
    }
    const remainingDistance = activeRoute.distanceFromWaypoint(waypointIndex ?? 0, coordinateIndex !== undefined ? coordinateIndex + 1 : 0);
    const routeDistance = activeRoute.distance;
    return {
      cruisingTime,
      noWakeTime,
      waypointIndex,
      coordinateIndex,
      distanceToSmartRoute,
      remainingDistance,
      routeDistance,
    };
  }, [refreshMapCounter]);
  if (isUnderway === false || !values) return null;
  
  const { cruisingTime, noWakeTime, waypointIndex, coordinateIndex, distanceToSmartRoute, remainingDistance, routeDistance } = values;
  const calculateRouteTime = () => {
    const time = cruisingTime + noWakeTime;
    const hours = formatTime(Math.floor(time));
    const minutes = formatTime(Math.floor((time % 1) * 60));
    return `${hours}:${minutes}`;
  };
  const calculateTotalRemainingDistance = () => {
    return distanceToSmartRoute + remainingDistance.cruisingDistance + remainingDistance.noWakeDistance;
  };
  const calculateRemainingTime = () => {
    if (waypointIndex !== undefined && coordinateIndex !== undefined) {
      const timeToReachSmartPath = (lastSpeed !== 0 ? distanceToSmartRoute / lastSpeed : 0) / 3600;
      const remainingCruisingTime = (remainingDistance.cruisingDistance * Conversions.metersToNauticalMiles) / prefs.CruisingSpeed;
      const remainingNoWakeTime = (remainingDistance.noWakeDistance * Conversions.metersToNauticalMiles) / prefs.IdleSpeed;
      const routeTime = timeToReachSmartPath + remainingCruisingTime + remainingNoWakeTime;
      return routeTime;
    }
    return 0;
  };

  const remainingTime = calculateRemainingTime();
  const arivalTime = new Date(Date.now() + remainingTime * 3600000);
  const hour = arivalTime.getHours();
  const minutes = arivalTime.getMinutes();
  const data = [
    { key: 'Route Dist', value: localUnitString(routeDistance, prefs.UseMetric), userSettingsKey: 'RouteDistance' },
    {
      key: 'Dist To Dest',
      value: localUnitString(calculateTotalRemainingDistance(), prefs.UseMetric),
      userSettingsKey: 'DestDistance',
    },
    { key: 'Route Time', value: calculateRouteTime(), userSettingsKey: 'RouteTime' },
    {
      key: 'Time To Dest',
      value: `${formatTime(Math.floor(remainingTime))}:${formatTime(Math.floor((remainingTime % 1) * 60))}`,
      userSettingsKey: 'TimeToDest',
    },
    {
      key: 'Smart ETA',
      value: `${formatTime(hour % 12 || 12)}:${formatTime(minutes)}${hour >= 12 ? ' PM' : ' AM'}`,
      userSettingsKey: 'SmartETA',
    },
    { key: 'Heading', value: `${forceDec(userLocation?.heading ?? 0, 1)}`, userSettingsKey: 'Heading' },
    { key: 'SOG', value: `${forceDec(lastSpeed * Conversions.mpsToKnots, 2)} knots`, userSettingsKey: 'RouteSOG' },
    {
      key: 'Cruising Speed',
      value: `${prefs['CruisingSpeed']} knots`,
      onClick: toggleShowBoatSpeedSettings,
    },
    { key: 'No Wake', value: `${prefs['IdleSpeed']} knots`, onClick: toggleShowBoatSpeedSettings },
  ];

  return (
    <View style={[styles.dialogBox]}>
      {showBoatSpeedSettings && (
        <CenteredMenu onCloseHandler={toggleShowBoatSpeedSettings} style={{ margin: 'auto' }} hideCloseButton>
          <View style={{ width: 300, margin: 10 }}>
            <InputTile userSettingsKey="CruisingSpeed" title="Cruising Speed" type="number" />
            <InputTile userSettingsKey="IdleSpeed" title="Idle Speed" type="number" />
          </View>
        </CenteredMenu>
      )}
      <DitchIcon
        name={completeVisible ? 'close' : 'add'}
        color="#333232"
        style={{ backgroundColor: '#707070', borderRadius: 9999, padding: 2, right: 0, alignSelf: 'flex-end', margin: 5 }}
        onClick={toggleCompleteVisibility}
        size={16}
      />
      {data?.map((value) => (
        <View
          key={value.key}
          style={{
            marginVertical: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            display: completeVisible || prefs.SmartETAVisibleFeatures.includes(value.userSettingsKey ?? '') ? 'flex' : 'none',
          }}
        >
          <View
            style={[
              styles.textView,
              {
                width: completeVisible ? 200 : 170,
              },
            ]}
          >
            <DitchText text={`${value.key}`} textStyles={{ color: '#fefefe' }} fontWeightIndex={2} fontSizeIndex={1} />
            <BlankButton
              onClickHandler={() => {
                if (value.onClick) value.onClick();
              }}
            >
              <DitchText
                text={value.value}
                textStyles={{ color: '#fefefe', textDecorationLine: value.onClick ? 'underline' : 'none' }}
                fontWeightIndex={2}
                fontSizeIndex={1}
              />
            </BlankButton>
          </View>
          {completeVisible && value.userSettingsKey && (
            <ToggleSwitch
              onValueChange={(curr) => {
                if (value.userSettingsKey) {
                  if (curr === false) {
                    setPref(
                      'SmartETAVisibleFeatures',
                      prefs.SmartETAVisibleFeatures.filter((item) => item !== value.userSettingsKey),
                    );
                  } else {
                    setPref('SmartETAVisibleFeatures', [...prefs.SmartETAVisibleFeatures, value.userSettingsKey]);
                  }
                }
              }}
              value={prefs.SmartETAVisibleFeatures.includes(value.userSettingsKey)}
            />
          )}
        </View>
      ))}
    </View>
  );
};

export default DitchSegments;

const styles = StyleSheet.create({
  dialogBox: {
    position: 'absolute',
    height: 'auto',
    backgroundColor: '#333232',
    right: 10,
    bottom: 0,
    borderRadius: 10,
    padding: 10,
    zIndex: 0,
  },
  textView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
});
