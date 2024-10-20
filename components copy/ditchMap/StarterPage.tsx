import React from 'react';
import { View, StyleSheet } from 'react-native';
import CenteredMenu from '../ui/CenteredMenu';
import DitchLogo from '../ui/DitchLogo';
import DitchButton from '../ui/button/DitchButton';
import useUtils from '../../hooks/useUtils';
import DitchText from '../typography/DitchText';
import usePrefs from '@/hooks/usePrefs';

const StarterPage = () => {
  const { setPref, prefs } = usePrefs();
  const neverShowStarterPage = () => {
    setPref('WelcomedWebUser', true);
  };

  const { navigateTo } = useUtils();

  const startUsingDitch = () => {
    neverShowStarterPage();
    navigateTo('index');
  };

  const showOnboardingScreens = () => {
    neverShowStarterPage();
    navigateTo('onboarding');
  };
  return (
    <React.Fragment>
      {prefs['WelcomedWebUser'] === false ? (
        <CenteredMenu backgroundColor="rgba(255, 255, 255, 0.6)" style={styles.container} hideCloseButton>
          <View style={styles.logoContainer}>
            <DitchLogo width={150} />
          </View>
          <View style={styles.textContainer}>
            <DitchText
              textStyles={styles.text}
              text={`The only free boating web app designed for detailed route planning on your desktop.`}
            />
          </View>
          <View style={styles.buttonContainer}>
            <DitchButton actionLabel="Show onboarding screens" actionHandler={showOnboardingScreens} />
            <DitchButton actionLabel="Start using ditch" actionHandler={startUsingDitch} variant={1} />
          </View>
        </CenteredMenu>
      ) : <></>}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    maxWidth: 400,
    margin: 'auto',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10, // Replace rowGap with gap for spacing between buttons
  },
});

export default StarterPage;
