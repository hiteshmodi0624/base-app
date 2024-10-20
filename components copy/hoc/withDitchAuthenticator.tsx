import React from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import DummyDitchMap from '../ditchMap/DummyDitchMap';
import { View} from 'react-native';
import CenteredMenu from '../ui/CenteredMenu';
import { log } from '@/utils';

const withDitchAuthenticator = (Page: () => React.JSX.Element) => {
  const AuthenticatedPage = (props: any) => {
    const { authStatus } = useAuthenticator();
    log(authStatus)
    return (
      <>
        {authStatus !== 'authenticated' ? (
          <>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', opacity: 0.8 }}>
              <DummyDitchMap />
              {authStatus === 'unauthenticated' && (
                <Authenticator
                  components={components}
                  initialState="signUp"
                  Container={({ children }) => (
                    <CenteredMenu
                      style={{ margin: 'auto', width: '95%', maxWidth: 450, maxHeight: '85%', paddingBottom: 0 }}
                      hideCloseButton
                    >
                      {children}
                    </CenteredMenu>
                  )}
                />
              )}
            </View>
          </>
        ) : (
          <Page {...props} />
        )}
      </>
    );
  };
  return AuthenticatedPage;
};
export default withDitchAuthenticator;

const components = {
  SignUp,
  SignIn,
};
