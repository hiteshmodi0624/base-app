import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import DitchButton from '../ui/button/DitchButton'; // Assuming this component is adapted for React Native
import AutoPlaySlider from '../Slider/AutoplaySlider'; // Assuming this component is adapted for React Native
import DitchText from '../typography/DitchText'; // Assuming this component is adapted for React Native
import useUtils from '../../hooks/useUtils';
import { pages } from '../../DitchStatics';
import { ScreenName } from '@/types/App';
import { reportUserStep } from '@/utils';

interface OnboardingScreenProps {
  screenIndex: number;
}
const OnboardingScreen = ({ screenIndex }: OnboardingScreenProps) => {
  useEffect(() => {
    reportUserStep(`ONBOARDING:${screenIndex}`);
  }, []);

  const { navigateTo } = useUtils();

  const titles = ['Orange is the Smart Path™', 'Use Ditch Underway', 'Tap into Local Knowledge'];

  const subtitles = [
    "Ditch's AI-powered Smart Path creates the optimal route for your boat. Discover the safest, most efficient way to reach your destination.",
    'Heading line and vessel tracks will become visible when Ditch detects you are underway.',
    'See the waterways through the eyes of experienced local boaters.',
  ];

  return (
    <View style={styles.container}>
      <AutoPlaySlider
        slides={imageFiles[screenIndex].map((image, i) => (
          <View
            key={i}
            style={{
              borderRadius: 60,
              overflow: 'hidden',
              margin: 10,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Image source={image} style={{ width: 300, height: 400 }} resizeMode="contain" />
          </View>
        ))}
        playOnce
        hideSlider
        style={{ width: '100%' }}
        sliderSpeed={1000}
        key={screenIndex}
      />
      <View style={{ minHeight: 100 }}>
        <DitchText text={titles[screenIndex]} fontSizeIndex={4} fontWeightIndex={1} />
        <DitchText text={subtitles[screenIndex]} fontSizeIndex={1} fontWeightIndex={1} />
        {screenIndex === imageFiles.length - 1 && (
          <DitchButton
            actionLabel={'Start Using Ditch'}
            actionHandler={() => navigateTo(pages.index as ScreenName)}
            style={{ marginTop: 10 }}
            size={0}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 350,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default OnboardingScreen;

const imageFiles = [
  [
    require('../../assets/images/onboard/onboard00.png'),
    require('../../assets/images/onboard/onboard01.png'),
    require('../../assets/images/onboard/onboard02.png'),
    require('../../assets/images/onboard/onboard03.png'),
  ],
  [
    require('../../assets/images/onboard/onboard04.png'),
    require('../../assets/images/onboard/onboard05.png'),
    require('../../assets/images/onboard/onboard06.png'),
    require('../../assets/images/onboard/onboard07.png'),
  ],
  [
    require('../../assets/images/onboard/onboard08.png'),
    require('../../assets/images/onboard/onboard09.png'),
    require('../../assets/images/onboard/onboard10.png'),
    require('../../assets/images/onboard/onboard11.png'),
    require('../../assets/images/onboard/onboard12.png'),
    require('../../assets/images/onboard/onboard13.png'),
  ],
];
