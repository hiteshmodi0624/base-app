import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import DitchText from '../typography/DitchText';
import OAuthProviders from './OAuthProviders'; // Assuming this is refactored for React Native
import DitchLogo from '../ui/DitchLogo';
import { ditchUrls } from '../../DitchStatics';
import { setMarketingEmailPreferences } from '@/utils';
import CheckBox from 'react-native-check-box';
import DitchButton from '../ui/button/DitchButton';
import BlankButton from '../ui/button/BlankButton';
import AboutDitch from '../shared/AboutDitch';

const SignUp = () => {
  const [acknowledgement, setAcknowledgement] = useState(false);
  const [marketting, setMarketting] = useState(true);
  const [showAboutDitch, setShowAboutDitch] = useState(false);
  useEffect(() => {
    setMarketingEmailPreferences(marketting);
  }, [marketting]);
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        width: width * 0.8,
        maxWidth: 400,
        margin: 'auto',
      }}
    >
      <View style={homeStyles.authHeader}>
        <BlankButton style={homeStyles.loginLogo} onClickHandler={() => setShowAboutDitch(true)}>
          <DitchLogo width={200} />
        </BlankButton>
        {showAboutDitch && <AboutDitch onCloseHandler={() => setShowAboutDitch(false)} />}
        <DitchText
          styles={{ marginTop: 2 }}
          textStyles={{ textAlign: 'center' }}
          fontSizeIndex={3}
          fontWeightIndex={2}
          text={'Smarter Boat Navigation'}
        />
        <DitchText
          styles={{ marginTop: 10 }}
          textStyles={{ textAlign: 'center' }}
          fontSizeIndex={1}
          // fontWeightIndex={3}
          text={'Create your free Ditch account today to start planning your next journey with access to Local Knowledge.'}
        />
      </View>
      <View style={formStyles.container}>
        <View style={formStyles.fieldContainer}>
          <DitchText text={'STEP 1'} fontSizeIndex={1} styles={{ padding: 0, margin: 0 }} textStyles={{ textAlign: 'center' }} />
          <BlankButton style={formStyles.checkboxContainer} onClickHandler={() => setAcknowledgement((prev) => !prev)}>
            <CheckBox isChecked={acknowledgement} onClick={() => setAcknowledgement((prev) => !prev)} style={formStyles.checkbox} />
            <DitchText styles={formStyles.labelText} text={'I accept the Ditch Terms of use.'} fontSizeIndex={1} />
          </BlankButton>
        </View>
        <OAuthProviders acknowledgement={acknowledgement} />
        <View style={formStyles.fieldContainer}>
          <BlankButton style={formStyles.checkboxContainer} onClickHandler={() => setMarketting((prev) => !prev)}>
            <DitchText
              styles={formStyles.labelText}
              text={"Yes, I'd like to receive marketing emails.\nI understand I can unsubscribe at any time."}
              fontSizeIndex={1}
            />
            <CheckBox isChecked={marketting} onClick={() => setMarketting((prev) => !prev)} style={formStyles.checkbox} />
          </BlankButton>
        </View>

        <View style={formStyles.linksContainer}>
          <DitchButton actionLabel={'Terms of Use'} actionUrl={ditchUrls.terms} variant={1} size={0} />
          <DitchButton actionLabel={'Privacy Policy'} actionUrl={ditchUrls.privacy} variant={1} size={0} />
        </View>
      </View>
    </View>
  );
};

export default SignUp;

const homeStyles = StyleSheet.create({
  authHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  loginLogo: {
    marginVertical: 15,
  },
});

const formStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 'auto',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 14,
    color: 'black',
    marginLeft: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
