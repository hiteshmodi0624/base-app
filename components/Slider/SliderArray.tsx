import React from 'react';
import { View, StyleSheet } from 'react-native';
import { appColors } from '../../Statics';
import BlankButton from '../ui/button/BlankButton';

interface SliderArrayProps {
  count: number;
  setScreenIndex?: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}

const SliderArray = ({ count, index, setScreenIndex }: SliderArrayProps) => {
  return (
    <View style={styles.container}>
      {Array(count)
        .fill(0)
        .map((_, ind) => (
          <BlankButton
            style={[
              styles.sliderDot,
              {
                backgroundColor: index === ind ? appColors.darkBlue : 'gray',
                pointerEvents: setScreenIndex ? 'auto' : 'none',
              },
            ]}
            key={ind}
            onClickHandler={() => {
              if (setScreenIndex) setScreenIndex(ind);
            }}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  sliderDot: {
    borderRadius: 999, // large enough to make it a circle
    padding: 5,
    width: 12,
    height: 12,
    marginHorizontal: 6,
  },
});

export default SliderArray;
