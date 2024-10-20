import React, {useRef, useEffect} from 'react';
import { Animated } from 'react-native';
import type {PropsWithChildren} from 'react';
import type {ViewStyle} from 'react-native';

type FadeInViewProps = PropsWithChildren<{style: ViewStyle}>;

const FadeInView: React.FC<FadeInViewProps> = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 0,
      useNativeDriver: true,
      delay: 1000,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View 
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}>
      {props.children}
    </Animated.View>
  );
};
export default FadeInView;