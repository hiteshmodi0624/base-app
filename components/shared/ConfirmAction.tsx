import React from 'react';
import CenteredMenu from '../ui/CenteredMenu';
import CenterDiv from '../ui/CenterDiv';
import useUtils from '@/hooks/useUtils';
import AppIcon, { IconNames } from '../ui/AppIcon';
import AppText from '../typography/AppText';
import useConfirmAction from '@/hooks/useConfirmAction';
import AppButton from '../ui/button/AppButton';

const ConfirmAction = () => {
  const { confirmAction, hideConfirmAction } = useConfirmAction();
  const getOnSuccessFunction = useGetOnSuccessFunction();

  const onConfirmActionSuccess = async () => {
    if (!confirmAction) return;
    const { callback } = confirmAction.onSuccess;
    hideConfirmAction();
    if (callback) {
      const callBackFunction = getOnSuccessFunction(callback);
      await callBackFunction();
    }
  };

  return (
    <>
      {confirmAction && (
        <CenteredMenu onCloseHandler={hideConfirmAction} style={{ margin: 'auto', padding: 30 }}>
          {confirmAction.overlayMessage.icon && <AppIcon name={confirmAction.overlayMessage.icon} size={60} style={{ margin: 'auto' }} />}
          {confirmAction.overlayMessage.title && (
            <AppText text={confirmAction.overlayMessage.title} fontSizeIndex={3} styles={{ margin: 'auto' }} />
          )}
          {confirmAction.overlayMessage.message && (
            <AppText
              styles={{ alignItems: 'center', marginVertical: 10 }}
              text={confirmAction.overlayMessage.message}
              fontSizeIndex={1}
            />
          )}
          <CenterDiv style={{ justifyContent: 'space-around' }}>
            <AppButton actionLabel={'Cancel'} actionHandler={hideConfirmAction} variant={1} />
            <AppButton actionLabel={`${confirmAction?.onSuccess?.label ?? 'Yes'}`} variant={1} actionHandler={onConfirmActionSuccess} />
          </CenterDiv>
        </CenteredMenu>
      )}
    </>
  );
};

export default ConfirmAction;

export interface ConfirmActionType {
  overlayMessage: {
    title?: string;
    icon?: IconNames;
    message?: string;
  };
  onSuccess: {
    callback: string;
    label?: string;
    message?: string;
  };
}

export const useGetOnSuccessFunction = () => {
  const { navigateTo } = useUtils();
  const getOnSuccessFunction = (label: 'CLEAR_ALL_DATA' | 'CLEAR_LOCAL_STORAGE' | 'SIGN_OUT' | string) => {
    switch (label) {
      case 'CLEAR_ALL_DATA':
        return async () => {
          await navigateTo("(tabs)");
        };
      default:
        return async () => {};
    }
  };
  return getOnSuccessFunction;
};