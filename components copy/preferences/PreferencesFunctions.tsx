import React, { useState } from 'react';
import ButtonTile from '../settingsTile/ButtonTile';
import { getHomePort, getHomePortLatLngString } from '@/utils';
import { pages, snackbarMessages, TapMode } from '../../DitchStatics';
import NavigateToTile from '../settingsTile/NavigateToTile';
import useUtils from '../../hooks/useUtils';
import usePrefs from '../../hooks/usePrefs';
import DitchIcon from '../ui/DitchIcon';
import { ScreenName } from '@/types/App';
import { setCameraPosition } from '@/hooks/useMapboxLibraries';
import useDitchMap from '@/hooks/useDitchMap';
import AboutDitch from '../shared/AboutDitch';
import { Platform } from 'react-native';

export const HomePort = () => {
  const { setTapMode, showSnackbar, navigateTo } = useUtils();
  const { setFollowingUser } = useDitchMap();
  return (
    <ButtonTile
      title="Home Port"
      icon={<DitchIcon name="home" />}
      initialValue={getHomePortLatLngString() ?? 'Not Set'}
      action={async () => {
        await navigateTo('index');
        const homePort = getHomePort();
        if (homePort) {
          setFollowingUser(false);
          setCameraPosition({ latitude: homePort.Latitude, longitude: homePort.Longitude, zoom: 11 });
        } else {
          setTapMode(TapMode.waitingForHomePort);
          showSnackbar(snackbarMessages.waitingForHomePort, 10000);
        }
      }}
    />
  );
};
export const AppSettings = ()=>{
  return <NavigateToTile icon={<DitchIcon name="settings" />} title="App Settings" navigateTo={pages.appsettings as ScreenName} />;
}
export const DeveloperSettings = () => {
  const { getPref } = usePrefs();
  return (
    <>
      {getPref('ShowDeveloperSettings') && (
        <NavigateToTile icon={<DitchIcon name="psychology" />} title="Developer Settings" navigateTo={pages.developer as ScreenName} />
      )}
    </>
  );
};
export const Subscription = () => {
  return (
    <>
      {Platform.OS !== 'web' && (
        <NavigateToTile icon={<DitchIcon name="shopping-bag" />} title="Subscription" navigateTo={pages.subscription as ScreenName} />
      )}
    </>
  );
};
export const Support = () => {
  return <NavigateToTile icon={<DitchIcon name="support" />} title="Support" navigateTo={pages.support as ScreenName} />;
};
export const Feedback = () => {
  return <NavigateToTile icon={<DitchIcon name="feedback" />} title="Feedback" navigateTo={pages.feedback as ScreenName} />;
};
export const YourData = () => {
  return <NavigateToTile icon={<DitchIcon name="lock" />} title="Your Data" navigateTo={pages.yourdata as ScreenName} />;
};
export const AboutDitchButton = () => {
  const [showMessage, toggleShowMessage] = useState<boolean>(false);
  const togglAboutDitch = () => {
    toggleShowMessage((prev) => !prev);
  };
  return (
    <>
      {showMessage && <AboutDitch onCloseHandler={togglAboutDitch} />}
      <ButtonTile icon={<DitchIcon name="info-outline" />} title="About Ditch" action={togglAboutDitch} />
    </>
  );
};

const PreferencesFunctions = [
  HomePort,
  Subscription,
  AppSettings,
  DeveloperSettings,
  Support,
  Feedback,
  YourData,
  AboutDitchButton,
];
export default PreferencesFunctions;
