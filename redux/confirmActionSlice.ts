import { ConfirmActionType } from '@/components/shared/ConfirmAction';
import { createSlice } from '@reduxjs/toolkit';

export const ConfirmAction = createSlice({
  name: 'ConfirmAction',
  initialState: null as ConfirmActionType | null,
  reducers: {
    showConfirmAction: (state, { payload }: { payload: ConfirmActionType }) => {
      return payload;
    },
    hideConfirmAction: () => {
      return null;
    },
  },
});

export const { showConfirmAction, hideConfirmAction } = ConfirmAction.actions;

export default ConfirmAction.reducer;
