import { createStore, applyMiddleware, combineReducers } from "redux";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import thunk from "redux-thunk";

import global_site_reducer from "./reducers/global_site_reduces";
import number_view_reducer from "./reducers/number_view_reducer";
import number_list_reducer from "./reducers/numbers_list";
import detail_reducer from "./reducers/detail_reducer";
import activations_reducer from "./reducers/activations_reducer";
import search_number_reducer from "./reducers/search_number_reducer";
import users_reducer from "./reducers/users_reducer";

import fetch_adapter from "../utils/fetch-adapter";

const bindMiddleware = (middleware: Array<any>) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const combinedReducer = combineReducers({
  global_site_reducer,
  number_view_reducer,
  number_list_reducer,
  detail_reducer,
  activations_reducer,
  search_number_reducer,
  users_reducer
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload // apply delta from hydration
    };
    if (state.count) nextState.count = state.count; // preserve count value on client side navigation
    return nextState;
  }
  return combinedReducer(state, action);
};

const initStore = () => createStore(reducer, bindMiddleware([thunk.withExtraArgument({ mtx: { fetch: fetch_adapter }})]));

const wrapper = createWrapper(initStore);

export default wrapper;
