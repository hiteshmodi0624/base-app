import React, { Fragment, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, Dimensions } from 'react-native';
import useUtils from '../../hooks/useUtils';
import { BoatPathType, ditchColors, FeatureType } from '../../DitchStatics';
import useFeatures from '../../hooks/useFeatures';
import { getWaypointFromData, getInfluencerLayer, clearActiveRoute, getPoint, getUserLocation } from '@/utils';
import useLayerFilters from '../../hooks/useLayerFilters';
import DitchHeading from '../typography/DitchHeading';
import DitchIcon, { IconNames } from '../ui/DitchIcon';
import usePrefs from '@/hooks/usePrefs';
import useDitchMap from '@/hooks/useDitchMap';
import DitchText from '../typography/DitchText';
import DitchModal from '../ui/DitchModal';
import BlankButton from '../ui/button/BlankButton';
import useBlobs from '@/hooks/useBlobs';
import RouteLegendLine from './RouteLegendLine';

const ContextMenu = () => {
  const { showingContextMenu, setContextMenuVisibility, contextMenuData } = useUtils();
  const { activeRoute } = useBlobs();
  const commands = useContextMenuCommands();
  const getLine = () => {
    const boatPathType =
      contextMenuData.FeatureTypeId === FeatureType.routeSegment
        ? BoatPathType.smartPath
        : contextMenuData.FeatureTypeId === FeatureType.influencerLayer
          ? BoatPathType.importedRoute
          : undefined;
    if (boatPathType) return <RouteLegendLine boatPathType={boatPathType} />;
  };

  const filteredCommands = () => {
    let rtn = [...commands.filter((e) => e.validFeatureTypes.includes(contextMenuData.FeatureTypeId))];
    const userLocation = getUserLocation();
    if (activeRoute && contextMenuData.DitchBlob && 'FeatureCollectionString' in contextMenuData.DitchBlob) {
      const waypoint = getWaypointFromData(contextMenuData.DitchBlob, activeRoute);
      if (waypoint.DitchRoute.waypoints.length < 3) {
        rtn = rtn.filter((e) => e.title !== 'Delete Waypoint');
      }
      if (!waypoint.isEndpoint) {
        rtn = rtn.filter((e) => e.title !== 'Extend Route');
      }
    }
    if (!userLocation) {
      rtn = rtn.filter((e) => e.title !== 'Route to here');
    }

    if (
      activeRoute &&
      (contextMenuData.FeatureTypeId === FeatureType.routeSegment || contextMenuData.FeatureTypeId === FeatureType.waypoint)
    ) {
      if (activeRoute.FriendlyName !== 'Your Last Route') {
        rtn = rtn.filter((e) => e.title !== 'Save Route');
      }
    }
    return rtn;
  };
  const [overlayDimensions, setOverlayDimensions] = useState({ width: 0, height: 0 });

  const onOverlayLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setOverlayDimensions({ width, height });
  };
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const point = getPoint({
    x: contextMenuData.x as number,
    y: contextMenuData.y as number,
  });
  const calculatedTop = Math.min(point.y, screenHeight - 170 - overlayDimensions.height);
  const calculatedLeft = Math.min(point.x, screenWidth - overlayDimensions.width);
  const contextMenuCommands = filteredCommands();
  return (
    <Fragment>
      {showingContextMenu && (
        <DitchModal
          style={[{ top: calculatedTop, left: calculatedLeft }]}
          containerStyle={{ alignItems: 'flex-start' }}
          onCloseHandler={() => setContextMenuVisibility(false)}
          hideCloseButton={true}
        >
          <View style={styles.menuContainer} onLayout={onOverlayLayout}>
            <View style={styles.header}>
              <DitchHeading
                text={`${
                  contextMenuData.FeatureTypeId === FeatureType.waypoint
                    ? activeRoute?.FriendlyName
                    : contextMenuData.DitchBlob && 'FriendlyName' in contextMenuData.DitchBlob
                      ? contextMenuData.DitchBlob.FriendlyName
                      : contextMenuData.FriendlyName
                }`}
                fontSizeIndex={1}
                styles={styles.heading}
              />
              {getLine()}
            </View>
            <View>
              {contextMenuCommands.map((command, index) => (
                <BlankButton
                  key={`${index} ${command.title}`}
                  style={[
                    styles.commandButton,
                    contextMenuCommands.length !== index + 1 ? styles.borderBotton : {},
                    // command.borderBottom && contextMenuCommands.length !== index + 1 ? styles.borderBotton : {},
                  ]}
                  onClickHandler={() => {
                    command.action();
                    setContextMenuVisibility(false);
                  }}
                >
                  <DitchIcon name={command.icon} style={{ marginRight: 10 }} />
                  <DitchText text={command.title} fontSizeIndex={1} />
                </BlankButton>
              ))}
            </View>
          </View>
        </DitchModal>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: ditchColors.background,
    padding: 4,
    borderRadius: 6,
    minWidth: 200,
    maxWidth: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
  },
  heading: {
    margin: 4,
  },
  commandButton: {
    backgroundColor: ditchColors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 8,
    paddingVertical: 6,
    marginVertical: 0,
    borderColor: 'black',
    fontSize: 12,
    borderRadius: 0,
  },
  borderBotton: {
    borderBottomWidth: 0.5,
  },
});

export default ContextMenu;

const useContextMenuCommands = () => {
  const { createNewRoute, extendRoute, removeWaypoint, createNewMarker, addWaypointOnPath, reverseRoute } = useFeatures();
  const { deleteActiveRoute, deleteBlob, exportDitchBlob, activeRoute } = useBlobs();
  const { refreshVisibleFeatures } = useDitchMap();
  const { contextMenuData, navigateTo, showSnackbar } = useUtils();
  const { toggleAcoe, setInfluencerLayerVisibility } = useLayerFilters();
  const influencerLayerTitle = getInfluencerLayer()?.Label;
  const { prefs } = usePrefs();
  const userLocation = getUserLocation();
  const commands: {
    title: string;
    validFeatureTypes: number[];
    icon: IconNames;
    action: () => void;
    borderBottom?: boolean;
  }[] = [
    {
      title: 'Extend Route',
      validFeatureTypes: [FeatureType.waypoint],
      icon: 'trending-up',
      action: () => {
        const maxWaypoints = prefs.MaxWaypoints;
        if (activeRoute && activeRoute.waypoints.length >= maxWaypoints) {
          showSnackbar(`Number of waypoints is limited to ${maxWaypoints}`);
        } else if (contextMenuData.DitchBlob && 'FeatureCollectionString' in contextMenuData.DitchBlob)
          extendRoute(contextMenuData.DitchBlob);
      },
    },
    {
      title: 'Save Route',
      validFeatureTypes: [FeatureType.waypoint, FeatureType.routeSegment],
      icon: 'save',
      action: () =>
        navigateTo('editblobs', {
          ditchBlob: JSON.stringify(activeRoute),
          state: 'save',
        }),
    },
    {
      title: 'Route from here',
      validFeatureTypes: [
        FeatureType.nothing,
        FeatureType.aton,
        FeatureType.routeSegment,
        FeatureType.waypoint,
        FeatureType.bathymetry,
        FeatureType.influencerLayer,
        FeatureType.marker,
        FeatureType.importedLayer,
      ],
      icon: 'arrow-back',
      action: () => createNewRoute([{ lat: contextMenuData.lat, lng: contextMenuData.lng }], true),
    },
    {
      title: 'Route to here',
      validFeatureTypes: [
        FeatureType.nothing,
        FeatureType.aton,
        FeatureType.routeSegment,
        FeatureType.waypoint,
        FeatureType.bathymetry,
        FeatureType.influencerLayer,
        FeatureType.marker,
        FeatureType.importedLayer,
      ],
      icon: 'arrow-forward',
      action: () => {
        if (userLocation) {
          createNewRoute([
            { lat: userLocation.lat, lng: userLocation.lng },
            { lat: contextMenuData.lat, lng: contextMenuData.lng },
          ]);
        }
      },
    },
    {
      title: `${prefs['ShowACOELegend'] ? 'Hide' : 'Show'} depth legend`,
      validFeatureTypes: [FeatureType.bathymetry],
      icon: 'format-list-numbered',
      action: toggleAcoe,
      borderBottom: true,
    },
    {
      title: 'Marker Info',
      validFeatureTypes: [FeatureType.marker],
      icon: 'info',
      action: () =>
        navigateTo('editblobs', {
          ditchBlob: JSON.stringify(contextMenuData.DitchBlob),
        }),
    },
    {
      title: 'Route Info',
      validFeatureTypes: [FeatureType.waypoint, FeatureType.routeSegment],
      icon: 'info',
      action: () => {
        activeRoute?.FriendlyName === 'Your Last Route'
          ? navigateTo('editblobs', {
              ditchBlob: JSON.stringify(activeRoute),
              state: 'save',
            })
          : navigateTo('editblobs', {
              ditchBlob: JSON.stringify(activeRoute),
            });
      },
    },
    {
      title: `Hide Route`,
      validFeatureTypes: [FeatureType.waypoint, FeatureType.routeSegment, FeatureType.importedLayer],
      icon: 'visibility-off',
      action: () => {
        clearActiveRoute();
        refreshVisibleFeatures();
      },
    },
    {
      title: 'Add Waypoint',
      validFeatureTypes: [FeatureType.routeSegment],
      icon: 'edit',
      action: () => {
        if (activeRoute && activeRoute.waypoints.length >= 15) {
          showSnackbar('Number of waypoints is limited to 15');
        } else {
          addWaypointOnPath({
            lat: contextMenuData.lat,
            lng: contextMenuData.lng,
          });
        }
      },
    },
    {
      title: 'Delete Marker',
      validFeatureTypes: [FeatureType.marker],
      icon: 'delete',
      action: () => {
        if (contextMenuData.DitchBlob && 'DitchBlob' in contextMenuData.DitchBlob) deleteBlob(contextMenuData.DitchBlob);
      },
    },
    {
      title: 'Delete Route',
      validFeatureTypes: [FeatureType.waypoint, FeatureType.routeSegment, FeatureType.importedLayer],
      icon: 'delete-sweep',
      action: deleteActiveRoute,
    },
    {
      title: 'Export Route',
      validFeatureTypes: [FeatureType.waypoint, FeatureType.routeSegment],
      icon: 'download',
      action: () => {
        exportDitchBlob(activeRoute);
      },
    },
    {
      title: 'Delete Waypoint',
      validFeatureTypes: [FeatureType.waypoint],
      icon: 'delete',
      action: () => {
        if (contextMenuData.DitchBlob && 'FeatureCollectionString' in contextMenuData.DitchBlob) removeWaypoint(contextMenuData.DitchBlob);
      },
    },
    {
      title: 'Reverse Route',
      validFeatureTypes: [FeatureType.waypoint, FeatureType.routeSegment],
      icon: 'swap-vert',
      action: reverseRoute,
    },
    {
      title: 'Add place marker',
      validFeatureTypes: [
        FeatureType.nothing,
        FeatureType.aton,
        FeatureType.routeSegment,
        FeatureType.importedLayer,
        FeatureType.waypoint,
        FeatureType.bathymetry,
        FeatureType.influencerLayer,
      ],
      icon: 'add-location',
      action: async () => {
        await createNewMarker({
          lat: contextMenuData.lat,
          lng: contextMenuData.lng,
        });
      },
      borderBottom: true,
    },
    {
      title: `Hide ${influencerLayerTitle}`,
      validFeatureTypes: [FeatureType.influencerLayer],
      icon: 'visibility-off',
      action: () => setInfluencerLayerVisibility(false),
      borderBottom: true,
    },
  ];
  return commands;
};
