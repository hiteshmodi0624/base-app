import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ditchColors } from '../../DitchStatics';
import DitchText from './DitchText';
import DitchIcon from '../ui/DitchIcon';
import BlankButton from '../ui/button/BlankButton';

export interface DitchAccordianProps {
  data: {
    summary: string;
    details: string;
  };
  setCurrentExpanded: (val: number) => void;
  currentExpanded: number;
  index: number;
}

const DitchAccordian = ({ data, setCurrentExpanded, currentExpanded, index }: DitchAccordianProps) => {
  return (
    <View style={styles.container}>
      <BlankButton style={[styles.summary, { flexDirection: 'row-reverse' }]} onClickHandler={() => setCurrentExpanded(index)}>
        <DitchIcon name={currentExpanded === index ? 'remove' : 'add'} size={24} color={ditchColors.darkBlue} />
        <DitchText text={data.summary} fontSizeIndex={2} styles={{ flex: 1 }} />
      </BlankButton>
      {currentExpanded === index && (
        <View style={styles.details}>
          <DitchText text={data.details} fontSizeIndex={1} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: ditchColors.lightGray,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: ditchColors.lightGray,
  },
  details: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default DitchAccordian;
