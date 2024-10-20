import React from 'react';
import { View, StyleSheet } from 'react-native';
import { appColors } from '../../Statics';
import AppText from './AppText';
import AppIcon from '../ui/AppIcon';
import BlankButton from '../ui/button/BlankButton';

export interface AppAccordianProps {
  data: {
    summary: string;
    details: string;
  };
  setCurrentExpanded: (val: number) => void;
  currentExpanded: number;
  index: number;
}

const AppAccordian = ({ data, setCurrentExpanded, currentExpanded, index }: AppAccordianProps) => {
  return (
    <View style={styles.container}>
      <BlankButton style={[styles.summary, { flexDirection: 'row-reverse' }]} onClickHandler={() => setCurrentExpanded(index)}>
        <AppIcon name={currentExpanded === index ? 'remove' : 'add'} size={24} color={appColors.darkBlue} />
        <AppText text={data.summary} fontSizeIndex={2} styles={{ flex: 1 }} />
      </BlankButton>
      {currentExpanded === index && (
        <View style={styles.details}>
          <AppText text={data.details} fontSizeIndex={1} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: appColors.lightGray,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: appColors.lightGray,
  },
  details: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default AppAccordian;
