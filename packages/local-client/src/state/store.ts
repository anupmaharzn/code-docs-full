import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import { presistMiddleware } from "./middlewares/persist-middleware";
// import { bundlerMiddleware } from "./middlewares/bundler-middleware";
export const store = createStore(
  reducers,
  {},
  applyMiddleware(presistMiddleware, thunk)
);
