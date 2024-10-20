import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { appColors } from '../../Statics';
import SliderArray from './SliderArray';

interface AutoPlaySliderProps {
  slides: React.JSX.Element[];
  style: ViewStyle;
  playOnce?: boolean;
  hideSlider?: boolean;
  sliderSpeed?: number;
}

function AutoPlaySlider({ slides, style, playOnce, hideSlider, sliderSpeed = 3000 }: AutoPlaySliderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      const lastIndex = slides.length - 1;
      let newIndex = index + 1;
      if (newIndex > lastIndex) {
        newIndex = playOnce ? lastIndex : 0;
      }
      setIndex(newIndex);
    }, sliderSpeed);
    return () => clearInterval(slider);
  }, [index, playOnce, sliderSpeed, slides.length]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.slidesContainer}>
        {slides.map((slide, i) => {
          const slideStyle: ViewStyle[] = [styles.slide];
          if (i === index) {
            slideStyle.push(styles.activeSlide);
          }
          return (
            <View key={i} style={slideStyle}>
              {slide}
            </View>
          );
        })}
      </View>

      {!hideSlider && <SliderArray index={index} count={slides.length} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.background,
    overflow: 'hidden',
    marginVertical: 20,
  },
  slidesContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  slide: {
    width: '100%',
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  activeSlide: {
    display: 'flex',
  },
});

export default AutoPlaySlider;
