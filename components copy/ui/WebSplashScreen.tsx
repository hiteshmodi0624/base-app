import { AppLoaded, ditchColors } from '@/DitchStatics';
import useUtils from '@/hooks/useUtils';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import DitchText from '../typography/DitchText';
import DitchImage from './DitchImage';

const SplashScreen = () => {
  const opacityAnim = React.useRef(new Animated.Value(1)).current;
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const textOpacityAnim = React.useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const { progress } = useUtils();

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, 30000);
  });
  useEffect(() => {
    if (progress === AppLoaded.completed || progress === AppLoaded.started) {
      setIsVisible(progress !== AppLoaded.completed);
    }
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      easing: Easing.cubic,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    Animated.timing(textOpacityAnim, {
      toValue: 1,
      duration: 1000,
      delay: 500, // delay the animation by 500ms
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.splashScreen, { opacity: opacityAnim }]}>
        <DitchImage image={require('../../assets/images/ditch_d_trans_512.png')} size={100} />
        <View
          style={{
            margin: 'auto',
            width: '80%',
            borderRadius: 999,
            overflow: 'hidden',
            height: 10,
            backgroundColor: ditchColors.lightBlue,
            maxWidth: 350,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <Animated.View
            style={{
              height: 10,
              borderRadius: 999,
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: ditchColors.darkBlue,
            }}
          />
        </View>
        <Animated.View style={{ opacity: textOpacityAnim }}>
          <DitchText
            text="BOATING NAVIGATION"
            textStyles={{ color: ditchColors.darkBlue, textAlign: 'center' }}
            fontWeightIndex={3}
            fontSizeIndex={4}
            fontFamily="MontserratRegular"
          />
          <DitchText
            text="REIMAGINED"
            textStyles={{ color: ditchColors.midBlue, textAlign: 'center' }}
            fontWeightIndex={3}
            fontSizeIndex={4}
            fontFamily="MontserratRegular"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  splashScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
