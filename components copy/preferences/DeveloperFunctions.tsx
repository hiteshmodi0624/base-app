import React from 'react';
import SelectTile from '../settingsTile/SelectTile';
import ButtonTile from '../settingsTile/ButtonTile';
import NavigateToTile from '../settingsTile/NavigateToTile';
import { accuracyMeters, CognitoEnvironmentLabels, minSpeedUpdate, pages, radiusMeters,SubscriptionType } from '../../DitchStatics';
import ToggleTile from '../settingsTile/ToggleTile';
import InputTile from '../settingsTile/InputTile';
import * as DocumentPicker from 'expo-document-picker';
import { forceDec } from '@/utils';
import { ScreenName } from '@/types/App';
import useSubscription from '@/hooks/useSubscription';
import useUtils from '@/hooks/useUtils';
import useGPX from '@/hooks/useGPX';
import DitchIcon from '../ui/DitchIcon';

export const SwitchEnvironmet = () => {
  return (
    <SelectTile
      confirmAction={{
        overlayMessage: {
          title: 'Switch Environment',
          message: "Sign out of Ditch and remove locally cached routes?",
          icon: 'key',
        },
        onSuccess: {
          callback: 'SIGN_OUT',
        },
      }}
      title={'Cognito'}
      validOptions={CognitoEnvironmentLabels}
      subtitle={`Change the authentication pool. (Requires restart)`}
    />
  );
};
export const UploadGPX = ({ showIcon = false }: { showIcon?: boolean }) => {
  const { importGPXRoutes } = useGPX(); // Custom hook for handling import
  const { showSnackbar } = useUtils();
  const handleImportGPX = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        // type: ['application/octet-stream', 'application/gpx', 'application/gpx+xml'],
        copyToCacheDirectory: true,
      });
      if (res.assets) {
        importGPXRoutes(res.assets);
      }
    } catch (_) {
      showSnackbar('Error Picking File');
    }
  };

  return (
    <>
      {showIcon ? <DitchIcon name="import-export" onClick={handleImportGPX} /> : <ButtonTile title="Import GPX" action={handleImportGPX} />}
    </>
  );
};

export const HiveViewer = () => {
  return <NavigateToTile title="Hive Viewer" subtitle="Show the viewer for locally stored blobs." navigateTo={pages.blobs as ScreenName} />;
};
export const LogViewer = () => {
  return <NavigateToTile title="Log Viewer" subtitle="Show logs." navigateTo={pages.logs as ScreenName} />;
};
export const BlowHiveAway = () => {
  return (
    <ButtonTile
      title="Delete Hives & Secure"
      subtitle="Low level removal of all locally stored blobs."
      confirmAction={{
        overlayMessage: {
          title: 'Blow Away',
          icon: 'fire-extinguisher',
          message: 'Really?',
        },
        onSuccess: {
          callback: 'CLEAR_LOCAL_STORAGE',
          message: 'Blew away Hive box.',
        },
      }}
    />
  );
};
export const EditTests = () => {
  return <NavigateToTile title="Edit Tests" subtitle="Select the automated tests to run." navigateTo={pages.tests as ScreenName} />;
};

export const ShowEnvironment = () => {
  return <NavigateToTile title="Show Environment" subtitle="Show environment variables." navigateTo={pages.environment as ScreenName} />;
};

export const ShowLayers = () => {
  return <NavigateToTile title="Show Layers" subtitle="Show layers" navigateTo={pages.layersJson as ScreenName} />;
};
export const ShowDeveloperSettings = () => {
  return (
    <ToggleTile
      title="Show Developer Settings"
      subtitle="Allow or deny access to advanced config parameters."
      userSettingsKey="ShowDeveloperSettings"
    />
  );
};
export const HeadingAngleByAveraging = () => {
  return (
    <ToggleTile
      title="Set Noseline Angle By Averaging"
      userSettingsKey="HeadingAngleByAveraging"
    />
  );
};
export const ShowH3Overlay = () => {
  return (
    <ToggleTile
      title="Show H3 Overlay"
      subtitle="Show H3 Overlay."
      userSettingsKey="ShowH3Overlay"
    />
  );
};
export const SynchWithCloud = () => {
  return (
    <ToggleTile title="Synch With Cloud" subtitle="Save changes so they can be viewed on any device." userSettingsKey="SynchWithCloud" />
  );
};
// {
//   title: 'View App Logs',
//   subtitle: 'View detailed app troubleshooting info.',

//   action: (_) => {
//     //TODO VIEW APP LOGS
//   }
// },
export const ChangeMinimumAccuracy = () => {
  return (
    <SelectTile
      title="Default Minimum Accuracy"
      subtitle="Minimum Accuracy to update direction."
      validOptions={accuracyMeters.map((rm) => `${rm} m`)}
      userSettingsKey="MiniumumLocationAccuracyIndex"
    />
  );
};
export const ChangeMinimumSpeed = () => {
  return (
    <SelectTile
      title="Default Minimum Speed"
      subtitle="Minimum Speed to update direction."
      validOptions={minSpeedUpdate.map((rm) => `${rm} km/hr`)}
      userSettingsKey="MiniumumSpeedUpdateIndex"
    />
  );
};
export const ChangeSubscriptionType = () => {
  const { subscription, updateSubscription } = useSubscription();
  return (
    <SelectTile
      title="Change Subscription Type"
      validOptions={Object.values(SubscriptionType)}
      settingsAction={async (val) => await updateSubscription({ subscriptionType: val })}
      initialValue={subscription.type}
    />
  );
};
export const DaysLeft = () => {
  const { daysLeft, updateSubscription } = useSubscription();
  return (
    <InputTile
      title="Days Left"
      subtitle="Change days left of the trial subscription."
      onChangeHandler={async (dateString) => {
        await updateSubscription({ daysLeft: +dateString });
      }}
      initialValue={forceDec(daysLeft, 2).toString()}
    />
  );
};

export const ChangeRadiusSize = () => {
  return (
    <SelectTile
      title="Default Radius"
      subtitle="Change size of search area around waypoints."
      validOptions={radiusMeters.map((rm) => `${rm} m`)}
      userSettingsKey="RadiusSizeIndex"
    />
  );
};
export const MaxSavedFeatures = () => {
  return (
    <InputTile
      title="Max Saved Routes"
      subtitle="The greatest number of routes you are allowed to save."
      userSettingsKey="MaxSavedFeatures"
    />
  );
};
export const LocalBreadcrumbDuration = () => {
  return (
    <InputTile
      title="Time between each Breadcrumb (seconds)"
      subtitle="Time between each Breadcrump."
      userSettingsKey="LocalBreadcrumbDuration"
    />
  );
};
export const LocalBreadcrumbIncrement = () => {
  return (
    <InputTile
      title="Distance between each Breadcrumb (meters)"
      subtitle="Distance between each Breadcrumb"
      userSettingsKey="LocalBreadcrumbIncrement"
    />
  );
};
export const MinSpeedForBreadcrumb = () => {
  return (
    <InputTile
      title="Minimum Speed for Breadcrumb (meters/second)"
      subtitle="Minimum speed to store breadcrumb."
      userSettingsKey="MinSpeedForBreadcrumb"
    />
  );
};
export const BreadcrumbSaveDays = () => {
  return (
    <InputTile
      title="Maximum Breadcrumb Days"
      subtitle="Maximum Breadcrumb Days."
      userSettingsKey="BreadcrumbSaveDays"
    />
  );
};
export const NoseLineSampleSize = () => {
  return (
    <InputTile
      title="Nose Line Sample Size"
      subtitle="Size of the sample used to calculate the nose line."
      userSettingsKey="NoseLineSampleSize"
    />
  );
};

export const ZoomMultiplier = () => {
  return (
    <InputTile title="Max Zoom Multiple" subtitle="Points are near if (zoom - 10) * distance < this." userSettingsKey="MaxZoomMultiple" />
  );
};
export const SnapBackDegrees = () => {
  return (
    <InputTile title="Snap Back Degrees" subtitle="Degrees after which the boat recenters." userSettingsKey="SnapBackDegrees" />
  );
};
export const MaxTimeUntilGap = () => {
  return (
    <InputTile
      title="Max Time Until Gap (seconds)"
      subtitle="Max time between two breadcrumbs to not show gap."
      userSettingsKey="MaxTimeUntilGap"
    />
  );
};

export const MaxWaypoints = () => {
  return (
    <InputTile title="Maximum Waypoints" subtitle="Maximum Waypoints" userSettingsKey="MaxWaypoints" />
  );
};
export const WaypointIncrementPercent = () => {
  return (
    <InputTile
      title="Waypoint Increment"
      subtitle="Multiplier used to grow or shrink waypoint: radius = radius * (1 + waypointIncrement)."
      userSettingsKey="WaypointIncrementPercent"
    />
  );
};
export const ThumbTolerance = () => {
  return (
    <InputTile
      title="Thumb Tolerance"
      subtitle="Pixel distance acceptable for fat-finger drag and drop."
      userSettingsKey="ThumbTolerance"
    />
  );
};

export const Viewers = [HiveViewer, LogViewer, EditTests, ShowEnvironment];
export const Functions = [SwitchEnvironmet, UploadGPX, BlowHiveAway, ShowLayers];
export const Properties = [
  MaxWaypoints,
  MaxTimeUntilGap,
  LocalBreadcrumbDuration,
  LocalBreadcrumbIncrement,
  MinSpeedForBreadcrumb,
  BreadcrumbSaveDays,
  SnapBackDegrees,
  NoseLineSampleSize,
  HeadingAngleByAveraging,
  ChangeSubscriptionType,
  DaysLeft,
  ChangeMinimumSpeed,
  ChangeMinimumAccuracy,
  SynchWithCloud,
  ShowH3Overlay,
  ShowDeveloperSettings,
  MaxSavedFeatures,
  ZoomMultiplier,
  WaypointIncrementPercent,
  ThumbTolerance,
  ChangeRadiusSize,
];
