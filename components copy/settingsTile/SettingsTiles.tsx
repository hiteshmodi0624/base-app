import React from "react";
import { View, StyleSheet } from "react-native";
import { ditchColors } from "../../DitchStatics";
import DitchText from "../typography/DitchText";

interface SettingsTilesProps {
  heading?: string;
  settingTiles: ((props?: any) => JSX.Element)[];
}

const SettingsTiles = ({ settingTiles = [], heading } : SettingsTilesProps) => {
  return (
    <View style={styles.container}>
      {heading && <DitchText fontSizeIndex={2} text={heading} textStyles={styles.headingStyles} />}
      <View style={styles.settingsTiles}>
        {settingTiles
          .filter((tile) => tile !== undefined)
          .map((TileComponent: () => JSX.Element, i) => (
            <TileComponent key={i} />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  settingsTiles: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: ditchColors.background,
  },
  headingStyles: { alignItems: 'center', padding: 5, fontWeight: 500 },
});

export default SettingsTiles;
