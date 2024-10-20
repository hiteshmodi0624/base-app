import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { getTester } from "../../DitchStore";
import AcoeLegend from "./AcoeLegend";
import DitchText from "../typography/DitchText";
import { useAppSelector } from "@/hooks/useRedux";
import usePrefs from "@/hooks/usePrefs";

interface DitchFabProps {
  showAcoe ?: boolean
}

const DitchFab = ({ showAcoe }: DitchFabProps ) => {
  const testStatus = useAppSelector((state) => state.test.value);
  const { prefs } = usePrefs();
  const tester = getTester();
  const [testStatusString, setTestStatusString] = useState("");

  useEffect(() => {
    if (testStatus) {
      const intervalId = setInterval(() => {
        setTestStatusString(tester.testStatusString ?? '');
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [testStatus, tester.testStatusString]);

  return (
    <View style={styles.container}>
      {testStatus && <DitchText textStyles={styles.text} text={testStatusString} />}
      {(prefs['ShowACOELegend'] || showAcoe) && <AcoeLegend />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 10,
    position: "absolute",
    bottom: 16,
    right: 16,
    zIndex: 10,
  },
  text: {
    fontFamily: "Arial", // Adjust fontFamily as per your requirement
    fontSize: 14,
    color: "black", // Adjust text color as per your design
  },
});

export default DitchFab;
