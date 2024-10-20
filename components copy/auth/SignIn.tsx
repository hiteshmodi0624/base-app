import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import DitchImage from "../ui/DitchImage";
import DitchButton from "../ui/button/DitchButton";
import DitchText from "../typography/DitchText";
import { signIn, signUp, resendSignUpCode } from "@aws-amplify/auth";
import {
  PasswordField,
  TextField,
} from "@aws-amplify/ui-react-native/dist/primitives";
import DitchIcon from "../ui/DitchIcon";
import GoogleIcon from "../../assets/images/google.png";
import FacebookIcon from "../../assets/images/facebook.png";
import BlankButton from "../ui/button/BlankButton";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { reportUserStep } from "@/utils";
import useUtils from "@/hooks/useUtils";
import { snackbarMessages } from "@/DitchStatics";

const AuthState = {
  signIn: "signIn",
  signUp: "signUp",
};

const SignIn = () => {
  const { toSignUp } = useAuthenticator();
  return (
    <View style={styles.pageContainer}>
      <View style={styles.authHeader}>
        <BlankButton onClickHandler={toSignUp}>
          <DitchIcon name="arrow-back" size={24} color="black" />
        </BlankButton>
        <DitchImage image={GoogleIcon} size={24} />
        <DitchImage image={FacebookIcon} size={24} />
        <DitchIcon name="apple" size={30} color="black" />
      </View>
      <AuthScreensFormFields />
    </View>
  );
};

export default SignIn;

export const AuthScreensFormFields = () => {
  const { toForgotPassword } = useAuthenticator();
  const [authState, setAuthState] = useState(AuthState.signIn);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showSnackbar } = useUtils();
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(()=>{
    reportUserStep(`SIGNUP:${AuthState.signIn === authState ? 'Sign In' : verificationSent ? 'Verification Sent' : 'Sign Up'}`);
  })

  const authHandler = async () => {
    if (authState === AuthState.signIn || confirmPassword === password) {
      try {
        if (authState === AuthState.signUp && !verificationSent) {
          await signUp({ username, password });
          setVerificationSent(true);
          showSnackbar(snackbarMessages.verificationMessage, 10);
        } else {
          showSnackbar(snackbarMessages.signInWaitMessage, 10);
          await signIn({ username, password });
          showSnackbar(snackbarMessages.signInMessage);
        }
      } catch (error) {
        showSnackbar((error as Error).message);
      }
    } else {
      showSnackbar(snackbarMessages.passwordsDoNotMatch);
    }
  };

  const toggleAuthState = () => {
    setAuthState((prev) =>
      prev === AuthState.signIn ? AuthState.signUp : AuthState.signIn,
    );
  };
  const [currentFocus, setCurrentFocus] = useState('email');
  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <TextField
          label="Email"
          id="email"
          onChangeText={(text) => setUsername(text)}
          value={username}
          fieldStyle={[styles.input, { marginRight: 16 }]}
          style={{ width: '100%' }}
          labelStyle={{ fontFamily: 'Arial' }}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === 'Enter') {
              setCurrentFocus('password');
            }
          }}
          key={`input-${currentFocus}`}
          autoFocus={currentFocus === 'email'}
        />
        <PasswordField
          label="Password"
          id="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          fieldStyle={styles.input}
          labelStyle={{ fontFamily: 'Arial' }}
          onKeyPress={(e) => {
            if (e.nativeEvent.key === 'Enter') {
              if (authState === AuthState.signUp) {
                setCurrentFocus('confirm-password');
              } else {
                authHandler();
              }
            } 
          }}
          autoFocus={currentFocus === 'password'}
          key={`password-${currentFocus}`}
        />
        {authState === AuthState.signUp && (
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            id="confirm-password"
            onChangeText={(text) => setConfirmPassword(text)}
            iconStyle={{
              marginHorizontal: 'auto',
            }}
            fieldStyle={styles.input}
            labelStyle={{ fontFamily: 'Arial' }}
            autoFocus={currentFocus === 'confirm-password'}
            key={`confirm-password-${currentFocus}`}
            onKeyPress={(e) => {
              if (e.nativeEvent.key === 'Enter') {
                authHandler();
              }
            }}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <DitchButton
          actionLabel={authState === AuthState.signUp ? (verificationSent ? 'I Verified my Email' : 'Send Verification Link') : 'Sign In'}
          actionHandler={authHandler}
          size={0} // Adjust size as needed
          style={verificationSent ? styles.throbbingAnimation : {}}
        />
      </View>
      {verificationSent && (
        <View style={styles.buttonContainer}>
          <DitchButton
            actionLabel={'Resend Verification Link'}
            actionHandler={() => {
              resendSignUpCode({ username });
              showSnackbar(snackbarMessages.verificationMessage);
            }}
            size={0} // Adjust size as needed
            style={verificationSent ? styles.throbbingAnimation : {}}
          />
        </View>
      )}
      {authState === AuthState.signIn && (
        <View style={styles.forgotPasswordContainer}>
          <DitchButton variant={1} actionLabel={'Forgot Password'} actionHandler={toForgotPassword} size={0} />
        </View>
      )}
      <View style={styles.linkContainer}>
        <DitchText
          text={`${authState === AuthState.signUp ? 'Already have an account?' : 'Need to set up a new account?'}`}
          fontSizeIndex={1}
        />
        <DitchButton
          variant={1}
          actionLabel={`Sign ${authState === AuthState.signUp ? 'In' : 'Up'}`}
          actionHandler={toggleAuthState}
          size={0}
          style={{ paddingVertical: 0 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    margin: 'auto',
    width: 300,
    paddingVertical: 10,
  },
  authHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2, // Adjust as needed
    columnGap: 6,
  },
  forgotPasswordContainer: {
    marginTop: 0,
    marginBottom: 2,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  throbbingAnimation: {
    // animationName: "throbbing",
    // animationDuration: "4s",
    // animationIterationCount: "infinite",
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginHorizontal: 'auto',
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 1,
    margin: 'auto',
    marginTop: 50,
  },
  input: {
    maxWidth: 600,
    minWidth: 250,
  },
  buttonContainer: {
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
});
