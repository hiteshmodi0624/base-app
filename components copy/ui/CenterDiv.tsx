import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { PropsWithChildren } from 'react';

interface CenterDivProps extends PropsWithChildren {
  style?: ViewStyle;
}

const CenterDiv = ({ children, style }: CenterDivProps) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    margin: 'auto',
  },
});

export default CenterDiv;
