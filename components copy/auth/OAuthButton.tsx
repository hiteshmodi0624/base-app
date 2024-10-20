import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import DitchText from '../typography/DitchText';
import useUtils from '@/hooks/useUtils';
import BlankButton from '../ui/button/BlankButton';
import { snackbarMessages } from '@/DitchStatics';
import { log } from '@/utils';

interface OAuthProps {
  icon: JSX.Element;
  provider: string;
  emailSignInHandler?: () => void;
  acknowledgement: boolean;
  iconSrc?: string;
}

const OAuthButton = ({ iconSrc, provider, icon, emailSignInHandler, acknowledgement }: OAuthProps) => {
  const { toFederatedSignIn } = useAuthenticator();
  const { showSnackbar } = useUtils();
  const [duration, setDuration] = useState(4000);

  const handlePress = () => {
    if (acknowledgement !== true) {
      setDuration((prev) => prev + 1);
      showSnackbar(snackbarMessages.termsOfUse, duration);
    } else if (provider !== 'email') {
      log(provider);
      toFederatedSignIn({ provider });
    } else {
      if (emailSignInHandler !== undefined) {
        emailSignInHandler();
      }
    }
  };

  return (
    <View style={styles.container}>
      <BlankButton onClickHandler={handlePress} style={styles.button}>
        <View style={styles.iconContainer}>{iconSrc ? <Image source={{ uri: iconSrc }} style={styles.icon} /> : icon}</View>
        <DitchText text={`Continue with ${provider}`} fontSizeIndex={1} />
      </BlankButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8, // Adjust as needed
  },
  button: {
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 20,
    width: 250,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 30,
    cursor: 'pointer',
  },
  iconContainer: {
    height: 24,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 40,
  },
});

export default OAuthButton;
