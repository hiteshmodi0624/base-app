import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import BlankTile from "./BlankTile";
import AppText from "../typography/AppText";

interface InputTileProps {
  title: string;
  subtitle?: string;
  showSubtile?: boolean;
  onChangeHandler?: (input: string) => void;
  initialValue?: string;
  type?: 'string' | 'number';
}

const InputTile = ({ title, subtitle, showSubtile, onChangeHandler, initialValue, type = 'string' }: InputTileProps) => {
  const [input, setInputHandler] = useState(initialValue);

  return (
    <BlankTile subtitle={subtitle} hideNextIcon showSubtile={showSubtile}>
      <View style={styles.container}>
        <AppText styles={styles.label} text={title} fontSizeIndex={2} />
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={(text) => {
            if (type === 'string') {
              setInputHandler(text);
            } else {
              setInputHandler(text.replace(/[^0-9]/g, ''));
            }
          }}
          onBlur={() => {
            if (input) {
              if (onChangeHandler) onChangeHandler(input);
            }
          }}
          placeholder={title}
        />
      </View>
    </BlankTile>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
});

export default InputTile;
