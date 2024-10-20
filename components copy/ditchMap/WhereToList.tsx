import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import DitchText from "../typography/DitchText";
import DitchIcon from "../ui/DitchIcon";
import BlankButton from "../ui/button/BlankButton";

interface WhereToListProps {
  foundLocations: {
    locations: DitchBlobInterface[];
    searchType: number;
};
  onPlaceClickHandler: (index: number, searchType: number) => void;
  emptyMessage: string;
}

const WhereToList = ({ foundLocations, onPlaceClickHandler, emptyMessage }: WhereToListProps) => {
  return (
    <Animated.ScrollView style={{ flex: 1 }}>
      {emptyMessage !== '' && <DitchText text={emptyMessage} styles={{ margin: 1 }} fontWeightIndex={2} fontSizeIndex={2} />}
      {foundLocations?.locations?.map((place, i) => (
        <BlankButton onClickHandler={() => onPlaceClickHandler(i, foundLocations.searchType)} key={i} style={styles.listItem}>
          <View style={styles.iconContainer}>
            <DitchIcon name="location-pin" size={24} color="black" />
          </View>
          <View style={styles.textContainer}>
            <DitchText textStyles={styles.primaryText} text={place.FriendlyName} />
            <DitchText textStyles={styles.secondaryText} text={place.DitchBlob.Notes} />
          </View>
        </BlankButton>
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  secondaryText: {
    fontSize: 14,
    color: "black",
    overflow: "hidden",
  },
});

export default WhereToList;
