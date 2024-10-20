import { combineReducers, configureStore } from "@reduxjs/toolkit";
import reduxMiddleware from "./reduxMiddleware";
import confirmActionReducer from "./confirmActionSlice";
import utilsReducer from "./utilsSlice";
import snackbarReducer from "./snackbarSlice";

const rootReducer = combineReducers({
  confirmAction: confirmActionReducer,
  utils: utilsReducer,
  snackbar: snackbarReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(reduxMiddleware),
});

export default store;
// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

export type RootStateForMiddleWare = ReturnType<typeof rootReducer>;
