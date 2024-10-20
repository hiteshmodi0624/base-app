import React, { PropsWithChildren, useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { ditchColors } from '../../DitchStatics';
import BlankButton from './button/BlankButton';
import { Modal as RNModal } from 'react-native';
import Snackbar from '../shared/Snackbar';
import CloseButton from '../shared/CloseButton';
import useSubscription from '@/hooks/useSubscription';

interface CenteredMenuProps extends PropsWithChildren {
  style?: ViewStyle | ViewStyle[];
  onCloseHandler?: () => void;
  backgroundColor?: string;
  hideCloseButton?: boolean;
  withoutDelay?: boolean;
}

const CenteredMenu = ({ children, backgroundColor, style, onCloseHandler, hideCloseButton = false, withoutDelay = false }: CenteredMenuProps) => {
  const [isVisible, setIsVisible] = useState(withoutDelay ? true : false);
  const { subscriptionOverlay } = useSubscription();
  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

  useEffect(()=>{
    setIsVisible(!subscriptionOverlay);
  },[subscriptionOverlay])
  return (
    <RNModal transparent={true} animationType={withoutDelay ? 'none' : 'fade'} visible={isVisible}>
      <BlankButton
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: `${backgroundColor ?? 'rgba(0, 0, 0, 0.5)'}`,
          position: 'absolute',
        }}
        onClickHandler={onCloseHandler}
      />
      {children && (
        <View style={[styles.menu, style]}>
          {hideCloseButton === false && onCloseHandler && <CloseButton onCloseHandler={onCloseHandler} />}
          <ScrollView>{children}</ScrollView>
        </View>
      )}
      <Snackbar />
    </RNModal>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: ditchColors.background,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CenteredMenu;
