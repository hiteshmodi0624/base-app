import { createSlice } from "@reduxjs/toolkit";

const initialState: SnackbarSlice = {
  snackbarConfig: {
    duration: 0,
    message: "",
    actionLabel: "",
  },
};

export const snackbarSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    showSnackbarInMapPage: (state, { payload }) => {
      const { message } = payload;
      const seconds = payload.duration ?? 4000;
      const duration =
        seconds === state.snackbarConfig.duration ? seconds + 1 : seconds;
      const { actionLabel } = payload;
      return {
        ...state,
        snackbarConfig: { message, duration, actionLabel },
      };
    },
  },
});

export const { showSnackbarInMapPage } = snackbarSlice.actions;

export default snackbarSlice.reducer;

interface SnackbarSlice {
  snackbarConfig: {
    duration: number;
    message: string;
    actionLabel?: string;
  };
}