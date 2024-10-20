import { isAction, Middleware } from "redux";
import { RootStateForMiddleWare } from "./store";

const reduxMiddleware: Middleware<object, RootStateForMiddleWare> =
  (store) => (next) => (action) => {
    const result = next(action);
    if (isAction(action)) {
      return result;
    }
  };

export default reduxMiddleware;
