import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, GestureResponderEvent, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { ditchColors } from '../../DitchStatics';
import DitchText from '../typography/DitchText';
import DitchIcon, { IconNames } from './DitchIcon';
import BlankButton from './button/BlankButton';

interface DitchTextInputProps {
  icon?: IconNames;
  placeholder?: string;
  label?: string;
  style?: ViewStyle;
  withSearchIcon?: boolean;
  value: string;
  setInput: (input: string) => void;
  inputViewStyles?: ViewStyle;
  onSubmit?: (event?: GestureResponderEvent) => void;
  multiline?: boolean;
  autoFocus?: boolean;
}

const DitchTextInput = ({
  onSubmit,
  icon,
  setInput,
  value,
  placeholder,
  label,
  style,
  withSearchIcon,
  inputViewStyles,
  multiline = false,
  autoFocus = true,
}: DitchTextInputProps) => {
  const handleKeyDown = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <View style={[styles.formField, style]}>
      <DitchText styles={styles.label} text={label} />
      <View style={[styles.inputContainer, inputViewStyles]}>
        {icon && (
          <BlankButton onClickHandler={onSubmit} style={styles.iconButton}>
            <DitchIcon name={icon} size={24} color={ditchColors.darkBlue} />
          </BlankButton>
        )}
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => setInput(text)}
          style={styles.input}
          autoFocus={autoFocus}
          onKeyPress={handleKeyDown}
          numberOfLines={2}
          multiline={multiline}
        />
        {withSearchIcon && (
          <BlankButton onClickHandler={onSubmit} style={styles.iconButton}>
            <DitchIcon name="search" size={24} color={ditchColors.darkBlue} />
          </BlankButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formField: {
    marginBottom: 10,
  },
  label: {
    marginTop: 8,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ditchColors.background,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ditchColors.darkBlue,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: ditchColors.darkBlue,
  },
  iconButton: {
    padding: 10,
  },
});

export default DitchTextInput;
