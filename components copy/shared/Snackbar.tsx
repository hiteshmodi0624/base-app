import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated, ActivityIndicator } from "react-native";
import useUtils from "../../hooks/useUtils";
import { ditchColors, TapMode } from "../../DitchStatics";
import DitchText from "../typography/DitchText";
import BlankButton from "../ui/button/BlankButton";
import { usePathname } from "expo-router";

export interface SnackbarProps {
  message: string;
  duration?: number;
  actionLabel?: string;
}

const Snackbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { tapMode, loader } = useUtils();
  const { setTapMode, showSnackbar, snackbarConfig, navigateTo } = useUtils();
  const pathName = usePathname();
  const showLoader = loader || tapMode === TapMode.fetchingPaths
  useEffect(() => {
    setIsVisible(false);
    showSnackbar(undefined);
  }, [pathName]);
  useEffect(() => {
    if (snackbarConfig.message && snackbarConfig.duration) {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        showSnackbar(undefined);
      }, snackbarConfig.duration + 500); // duration for displaying the message plus 500ms for fading
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [snackbarConfig]);
  if (!isVisible) return null;
  return (
    <BlankButton onClickHandler={() => {if (tapMode !== TapMode.fetchingPaths) setIsVisible(false);}}>
      <Animated.View style={[styles.overlay]}>
        {snackbarConfig.message && (
          <View
            style={[
              styles.snackbar,
              {
                paddingHorizontal: snackbarConfig.actionLabel ? 20 : 10,
                flexDirection: showLoader || snackbarConfig.actionLabel ? 'row' : 'column',
              },
            ]}
          >
            <DitchText
              textStyles={{
                color: 'white',
                fontSize: 16,
                textAlign: snackbarConfig.actionLabel ? 'left' : 'center',
              }}
              text={snackbarConfig.message}
            />
            {snackbarConfig.actionLabel && (
              <BlankButton
                onClickHandler={() => {
                  if (snackbarConfig.actionLabel === 'Edit Settings') {
                    navigateTo('appsettings');
                  } else {
                    setTapMode(TapMode.ready);
                  }
                }}
                style={styles.button}
              >
                <DitchText
                  textStyles={{
                    color: ditchColors.neonGreen,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}
                  text={snackbarConfig.actionLabel}
                />
              </BlankButton>
            )}

            {showLoader && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={ditchColors.fabGreen} />
              </View>
            )}
          </View>
        )}
      </Animated.View>
    </BlankButton>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 9999,
  },
  snackbar: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    paddingVertical: 20,
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginLeft: 15,
  },
  loaderContainer: {
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
});

export default Snackbar;