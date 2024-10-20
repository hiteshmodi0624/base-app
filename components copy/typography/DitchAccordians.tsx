import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DitchAccordian from './DitchAccordian';

interface DetailsType {
  details: {
    summary: string;
    details: string;
  }[];
}

const DitchAccordians = ({ details }: DetailsType) => {
  const [currentExpanded, setCurrentExpanded] = useState(-1);
  return (
    <View style={styles.container}>
      {details.map((data, key) => (
        <DitchAccordian
          data={data}
          key={key}
          setCurrentExpanded={(val: number) => (currentExpanded === val ? setCurrentExpanded(-1) : setCurrentExpanded(val))}
          currentExpanded={currentExpanded}
          index={key}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Ensures children do not overflow if borderRadius is applied
    marginVertical: 10, // Adjust margin as needed
  },
});

export default DitchAccordians;
