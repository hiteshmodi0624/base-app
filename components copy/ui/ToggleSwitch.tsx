import { View, Animated, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import BlankButton from './button/BlankButton';

const ToggleSwitch = ({
  value,
  onValueChange,
  disabled = false,
  disabledHandler,
}: {
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabledHandler?: () => void;
  disabled?: boolean;
}) => {
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));
  const [shakeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 28],
  });

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 2,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -2,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 2,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleSwitch = () => {
    if (disabled) {
      triggerShake();
      disabledHandler && disabledHandler();
      return;
    }
    const newValue = !value;
    onValueChange(newValue);
  };

  return (
    <BlankButton onClickHandler={toggleSwitch} style={styles.pressable}>
      <Animated.View
        style={[
          styles.innerContainer,
          {
            backgroundColor: value ? '#34c759' : '#cccccc',
            transform: [{ translateX: shakeAnimation }],
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [{ translateX }],
          }}
        >
          <View style={styles.headGradient} />
        </Animated.View>
      </Animated.View>
    </BlankButton>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: 56,
    height: 30,
    borderRadius: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    borderRadius: 16,
  },
  headGradient: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: 'white',
  },
});

export default ToggleSwitch;