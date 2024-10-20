import {
  hideConfirmAction as hideConfirmActionFromRedux,
  showConfirmAction as showConfirmActionFromRedux,
} from '@/redux/confirmActionSlice';
import { useAppDispatch, useAppSelector } from './useRedux';
import { ConfirmActionType } from '@/components/shared/ConfirmAction';

const useConfirmAction = () => {
  const confirmAction = useAppSelector((state) => state.confirmAction);
  const dispatch = useAppDispatch();
  const showConfirmAction = (confirmAction: ConfirmActionType) => {
    dispatch(showConfirmActionFromRedux(confirmAction));
  };
  const hideConfirmAction = () => {
    dispatch(hideConfirmActionFromRedux());
  };

  return { confirmAction, showConfirmAction, hideConfirmAction };
};
export default useConfirmAction;
