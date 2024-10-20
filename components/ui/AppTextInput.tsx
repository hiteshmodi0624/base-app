import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, GestureResponderEvent, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { appColors } from '../../Statics';
import AppText from '../typography/AppText';
import AppIcon, { IconNames } from './AppIcon';
import BlankButton from './button/BlankButton';

interface AppTextInputProps {
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

const AppTextInput = ({
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
}: AppTextInputProps) => {
  const handleKeyDown = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Enter' && onSubmit) {
      onSubmit();
    }
  };

  return (
    <View style={[styles.formField, style]}>
      <AppText styles={styles.label} text={label} />
      <View style={[styles.inputContainer, inputViewStyles]}>
        {icon && (
          <BlankButton onClickHandler={onSubmit} style={styles.iconButton}>
            <AppIcon name={icon} size={24} color={appColors.darkBlue} />
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
            <AppIcon name="search" size={24} color={appColors.darkBlue} />
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
    backgroundColor: appColors.background,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.darkBlue,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: appColors.darkBlue,
  },
  iconButton: {
    padding: 10,
  },
});

export default AppTextInput;
