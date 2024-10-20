import React from 'react';
import { View, StyleSheet } from 'react-native';
import DitchButton from '../ui/button/DitchButton';
import DitchText from '../typography/DitchText';

interface SlideProps {
  icon: React.JSX.Element;
  title: string;
  actionLabel: string;
  actionHandler?: () => void;
  actionUrl?: string;
}

const Slide = ({ icon, title, actionLabel, actionHandler, actionUrl }: SlideProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <DitchText text={title} fontSizeIndex={2} fontWeightIndex={2} styles={styles.title} />
      <DitchButton
        actionLabel={actionLabel}
        actionHandler={actionHandler}
        actionUrl={actionUrl}
        variant={1}
        backgroundColor="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
  },
  title: {
    marginBottom: 10,
  },
});

export default Slide;
