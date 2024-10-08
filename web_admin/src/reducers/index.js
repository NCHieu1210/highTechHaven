import { combineReducers } from "redux";
import reRenderReducer from "./reRender";

const alllReducers = combineReducers({
  reRender: reRenderReducer,
  // Thêm nhiều Reducers
});

export default alllReducers;