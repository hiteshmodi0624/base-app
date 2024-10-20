import React from 'react';
import CenteredMenu from '../ui/CenteredMenu';
import DitchButton from '../ui/button/DitchButton';
import CenterDiv from '../ui/CenterDiv';
import useUtils from '@/hooks/useUtils';
import useConfirmAction from '@/hooks/useConfirmAction';
import DitchIcon, { IconNames } from '../ui/DitchIcon';
import DitchText from '../typography/DitchText';
import { clearAllData } from '@/DitchStore';
import useAuth from '@/hooks/useAuth';
import { clearLocalStorage } from '@/utils';

const ConfirmAction = () => {
  const { confirmAction, hideConfirmAction } = useConfirmAction();
  const getOnSuccessFunction = useGetOnSuccessFunction();
  const { showSnackbar } = useUtils();

  const onConfirmActionSuccess = async () => {
    if (!confirmAction) return;
    const { callback, message } = confirmAction.onSuccess;
    hideConfirmAction();
    if (callback) {
      const callBackFunction = getOnSuccessFunction(callback);
      await callBackFunction();
    }
    if (message) showSnackbar(message);
  };

  return (
    <>
      {confirmAction && (
        <CenteredMenu onCloseHandler={hideConfirmAction} style={{ margin: 'auto', padding: 30 }}>
          {confirmAction.overlayMessage.icon && <DitchIcon name={confirmAction.overlayMessage.icon} size={60} style={{ margin: 'auto' }} />}
          {confirmAction.overlayMessage.title && (
            <DitchText text={confirmAction.overlayMessage.title} fontSizeIndex={3} styles={{ margin: 'auto' }} />
          )}
          {confirmAction.overlayMessage.message && (
            <DitchText
              styles={{ alignItems: 'center', marginVertical: 10 }}
              text={confirmAction.overlayMessage.message}
              fontSizeIndex={1}
            />
          )}
          <CenterDiv style={{ justifyContent: 'space-around' }}>
            <DitchButton actionLabel={'Cancel'} actionHandler={hideConfirmAction} variant={1} />
            <DitchButton actionLabel={`${confirmAction?.onSuccess?.label ?? 'Yes'}`} variant={1} actionHandler={onConfirmActionSuccess} />
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
  const { signOut } = useAuth();
  const { showSnackbar, navigateTo } = useUtils();
  const getOnSuccessFunction = (label: 'CLEAR_ALL_DATA' | 'CLEAR_LOCAL_STORAGE' | 'SIGN_OUT' | string) => {
    switch (label) {
      case 'CLEAR_ALL_DATA':
        return async () => {
          await clearAllData();
          await signOut();
          await navigateTo('(tabs)');
          showSnackbar('All user data and settings have been deleted.');
        };
      case 'SIGN_OUT':
        return signOut;
      case 'CLEAR_LOCAL_STORAGE':
        return clearLocalStorage;
      default:
        return async () => {};
    }
  };
  return getOnSuccessFunction;
};