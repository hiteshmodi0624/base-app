import React, { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { BlobType, DitchMessageType, MessagePlatformType } from '../../DitchStatics';
import useBlobs from '../../hooks/useBlobs';
import DitchText from '../typography/DitchText';
import DitchButton from '../ui/button/DitchButton';
import RenderHtml from 'react-native-render-html';
import { getVersion } from '@/utils';
import useSubscription from '@/hooks/useSubscription';
import SubscriptionEndOverlay from '../subscription/SubscriptionEndOverlay';
import DitchModal from '../ui/DitchModal';

const MessageOverlay = () => {
  const [showMessage, changeShowMessageState] = useState(true);
  const [message, setMessage] = useState<DitchBlobInterface | undefined>();
  const { deleteBlob, blobs } = useBlobs();
  const { width } = useWindowDimensions();
  const version = getVersion();
  const { subscriptionOverlay, changeSubscriptionOverlayVisibility } = useSubscription();
  const isBlockingMessage = () => {
    return (
      message?.DitchBlob.DitchMessageTypeIndex === DitchMessageType.blocking
    );
  };
  const hideMessage = () => {
    if (!isBlockingMessage() || message?.DitchBlob?.Type === 'test') changeShowMessageState(false);
    if (subscriptionOverlay) changeSubscriptionOverlayVisibility(false);
  };
  const actionHandler = () => {
    if (message && (!isBlockingMessage() || message.DitchBlob?.Type === 'test')) deleteBlob(message);
    hideMessage();
  };

  useEffect(() => {
    const messageBlobs = blobs.filter(
      (e) =>
        e.TypeId === BlobType.ditchMessage &&
        (e.DitchBlob.MessagePlatformTypeIndex === MessagePlatformType.all ||
          (e.DitchBlob.MessagePlatformTypeIndex === MessagePlatformType.web && Platform.OS === 'web') ||
          (e.DitchBlob.MessagePlatformTypeIndex === MessagePlatformType.mobile && (Platform.OS === 'ios' || Platform.OS === 'android')) ||
          (e.DitchBlob.MessagePlatformTypeIndex === MessagePlatformType.android && Platform.OS === 'android') ||
          (e.DitchBlob.MessagePlatformTypeIndex === MessagePlatformType.ios && Platform.OS === 'ios')),
    );
    const infoBlobs = messageBlobs.find((e) => e.DitchBlob.DitchMessageTypeIndex === DitchMessageType.info);
    const blockingBlobs = messageBlobs.find((e) => e.DitchBlob.DitchMessageTypeIndex === DitchMessageType.blocking);
    if (blockingBlobs) {
      if (message?.DitchBlob.MinBuildNumber <= (version.buildNumber ?? 0)){
        deleteBlob(blockingBlobs);
      } else {
        setMessage(blockingBlobs);
        changeShowMessageState(true);
      }
    } else if (infoBlobs) {
      setMessage(infoBlobs);
      changeShowMessageState(true);
    } else {
      hideMessage();
    }
  }, [blobs]);
  return (
    <>
      {(subscriptionOverlay || (showMessage && message)) && (
        <DitchModal
          containerStyle={[styles.overlayContainer]}
          onCloseHandler={hideMessage}
          style={{
            margin: 'auto',
            maxWidth: 450,
            padding: 15,
            paddingHorizontal: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          hideCloseButton={isBlockingMessage()}
        >
          {subscriptionOverlay && <SubscriptionEndOverlay />}
          {message && (
            <>
              {message.FriendlyName && <DitchText text={message.FriendlyName} />}
              {message.DitchBlob.HTML && <RenderHtml source={{ html: message?.DitchBlob?.HTML }} contentWidth={width * 0.5} />}
              {message.DitchBlob?.ActionLabel && (
                <DitchButton
                  actionLabel={message.DitchBlob?.ActionLabel}
                  actionUrl={message.DitchBlob?.ActionUrl}
                  actionHandler={actionHandler}
                  size={0}
                />
              )}
            </>
          )}
        </DitchModal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageOverlay;
