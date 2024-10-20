import { createSlice } from "@reduxjs/toolkit";

const initialState: UtilsState = {
  progress: 0,
  loader: false,
};

export const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    setAppLoadedProgress: (state, { payload }) => {
      return { ...state, progress: payload };
    },
    showLoaderInMapPage: (state, { payload }) => {
      return { ...state, loader: payload };
    },
  },
});

export const { setAppLoadedProgress, showLoaderInMapPage } = utilsSlice.actions;

export default utilsSlice.reducer;

interface UtilsState {
  progress: number;
  loader: boolean;
}