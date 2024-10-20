import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { markerIcons, markerTypeLabels } from "../../DitchStatics";
import BlankButton from "../ui/button/BlankButton";
import { getImageSource } from "@/utils";
import DitchText from "../typography/DitchText";

interface MarkerIconsCardProps {
    selectedIndex: number;
    onChange: (index: number) => void;
}

const MarkerIconsCard = ({ selectedIndex, onChange }: MarkerIconsCardProps) => {
  const [newIndex, setNewIndex] = useState(selectedIndex);

  function changeIndex(index: number) {
    setNewIndex(index);
    onChange(index);
  }

  return (
    <View style={styles.columnCard}>
      <View style={styles.iconContainer}>
        {markerTypeLabels.map((label, index) => {
          const imageUrl = markerIcons[index];
          return (
            <BlankButton
              key={index}
              style={{ ...styles.iconWrapper, ...(newIndex === index && styles.selectedIcon) }}
              onClickHandler={() => {
                changeIndex(index);
              }}
            >
              <Image source={getImageSource(imageUrl)} style={styles.iconImage} />
              <DitchText styles={styles.iconLabel} text={label} fontSizeIndex={1} />
            </BlankButton>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  columnCard: {
    flexDirection: "column",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  iconWrapper: {
    padding: 8,
    margin: 16,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIcon: {
    borderWidth: 1,
    borderColor: "black",
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  iconLabel: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
});

export default MarkerIconsCard;