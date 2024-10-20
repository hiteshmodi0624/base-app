import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, Platform } from 'react-native';
import { appColors } from '../../Statics';
import AppHeading from '../typography/AppHeading';
import { useNavigation } from 'expo-router';
import BlankButton from '../ui/button/BlankButton';
import AppIcon from '../ui/AppIcon';
import useUtils from '@/hooks/useUtils';

interface PageLayoutProps extends PropsWithChildren {
  title: string;
  showBackButton?: boolean;
  subtitle?: string;
  style?: ViewStyle;
  contextStyle?: ViewStyle;
  notScrollable?: boolean;
  showCloseButton?: boolean;
  onCloseHandler?: () => void;
  showFullScreen?: boolean;
  rightButton?: React.ReactNode;
}

const PageLayout = ({
  children,
  style,
  title,
  subtitle,
  showBackButton,
  contextStyle,
  showCloseButton,
  onCloseHandler,
  notScrollable,
  showFullScreen,
  rightButton
}: PageLayoutProps) => {
  const navigate = useNavigation();
  const { navigateTo } = useUtils();
  const goBack = () => {
    if(navigate.canGoBack()){
      navigate.goBack();
    } else {
      navigateTo('(tabs)');
    }
  };
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {showBackButton && (
          <BlankButton style={styles.backButton} onClickHandler={goBack}>
            <AppIcon name="arrow-back" size={24} />
          </BlankButton>
        )}
        <AppHeading text={title} fontSizeIndex={2} />
        {subtitle && <AppHeading text={subtitle} fontSizeIndex={1} />}
        {showCloseButton && onCloseHandler && (
          <BlankButton style={styles.closeButton} onClickHandler={onCloseHandler}>
            <AppIcon name="close" size={24} />
          </BlankButton>
        )}
        {rightButton && <BlankButton style={styles.closeButton}>{rightButton}</BlankButton>}
      </View>
      <View style={[styles.innerContainer, showFullScreen ? undefined : styles.smallInnerContainer]}>
        {notScrollable && Platform.OS !== 'web' ? (
          <View style={[styles.content, contextStyle]}>{children}</View>
        ) : (
          <ScrollView contentContainerStyle={[styles.content, contextStyle]} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    paddingHorizontal: 10,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    marginHorizontal: 'auto',
  },
  smallInnerContainer:{
    maxWidth: 720,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  content: {
    flexGrow: 1,
    paddingTop: 0,
    margin: 0,
    padding: 1,
  },
});

export default PageLayout;
