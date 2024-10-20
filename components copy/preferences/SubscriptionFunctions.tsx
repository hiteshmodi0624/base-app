import React from 'react';
import { ditchColors, smartPathColor } from '../../DitchStatics';
import BlankTile from '../settingsTile/BlankTile';
import DitchText from '../typography/DitchText';
import DitchButton from '../ui/button/DitchButton';
import DitchIcon from '../ui/DitchIcon';
import DitchView from '../ui/DitchView';
import useSubscription from '@/hooks/useSubscription';
import { Platform } from 'react-native';

export const DaysLeft = () => {
  const { daysLeft } = useSubscription();
  return (
    <BlankTile
      title={'days left to explore Ditch'}
      titleFontSizeIndex={3}
      icon={
        <DitchText
          text={Math.floor(daysLeft).toString()}
          fontSizeIndex={4}
          textStyles={{ color: 'white' }}
          styles={{
            backgroundColor: ditchColors.midBlue,
            borderRadius: 9999,
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 52,
            width: 52,
          }}
        />
      }
      hideNextIcon
    />
  );
};

export const SubscriptionTextBox = ({ text, active }: { text: string; active?: boolean }) => (
  <DitchView
    style={{
      margin: 'auto',
      marginVertical: 20,
      backgroundColor: active ? 'black' : 'transparent',
      borderRadius: 20,
      padding: 10,
      width: active ? '80%' : 'auto',
    }}
  >
    <DitchText
      text={text}
      fontSizeIndex={4}
      textStyles={{
        color: active ? ditchColors.background : 'black',
        textAlign: 'center',
      }}
    />
  </DitchView>
);

export const BenefitsItem = ({ text }: { text: string }) => (
  <DitchView style={{ margin: 10, display: 'flex', flexDirection: 'row' }}>
    <DitchView
      style={{
        backgroundColor: smartPathColor,
        borderRadius: 9999,
        padding: 10,
        height: 48,
        width: 48,
        marginHorizontal: 10,
      }}
    >
      <DitchIcon name="check" color="white" />
    </DitchView>
    <DitchText text={text} fontSizeIndex={2} />
  </DitchView>
);

export const BigButton = ({ purchased, action }: { purchased: boolean; action: () => void }) => (
  <DitchView style={{ width: '100%' }}>
    {purchased && Platform.OS === 'web' ? (
      <></>
    ) : (
      <DitchButton
        actionLabel={purchased ? 'Manage Subscription' : 'Subscribe Now'}
        style={{
          margin: 'auto',
          marginBottom: 10,
          marginTop: 20,
          paddingVertical: 10,
          paddingHorizontal: 50,
        }}
        textStyle={{ fontSize: 25 }}
        backgroundColor={smartPathColor}
        actionHandler={action}
      />
    )}
  </DitchView>
);
