import React from 'react';
import { View, StyleSheet } from 'react-native';
import OAuthButton from './OAuthButton';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import GoogleIcon from '../../assets/images/google.png';
import FacebookIcon from '../../assets/images/facebook.png';
import DitchImage from '../ui/DitchImage';
import DitchIcon from '../ui/DitchIcon';
import DitchText from '../typography/DitchText';

interface OAuthProvidersProps {
  acknowledgement: boolean;
}
const OAuthProviders = ({ acknowledgement }: OAuthProvidersProps) => {
  const { toSignIn } = useAuthenticator();

  return (
    <View style={styles.container}>
      <DitchText text={'STEP 2'} fontSizeIndex={1} styles={{ padding: 0, marginBottom: 5 }} />
      <OAuthButton
        icon={<DitchIcon name="mail" size={24} />}
        provider={'email'}
        emailSignInHandler={toSignIn}
        acknowledgement={acknowledgement}
      />
      <OAuthButton icon={<DitchImage image={FacebookIcon} />} provider="Facebook" acknowledgement={acknowledgement} />
      <OAuthButton icon={<DitchImage image={GoogleIcon} />} provider="Google" acknowledgement={acknowledgement} />
      <OAuthButton icon={<DitchIcon name="apple" size={24} />} provider="Apple" acknowledgement={acknowledgement} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
});

export default OAuthProviders;
