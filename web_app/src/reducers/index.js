import { combineReducers } from "redux";
import dataReducer from "./dataReducer";
import reRenderReducer from "./reRender";
import optionsProductReducer from "./optionsProductReducer";
import loadingReducer from "./loadingReducer";

const allReducers = combineReducers({
  reRender: reRenderReducer,
  loading: loadingReducer,
  data: dataReducer,
  optionsProduct: optionsProductReducer,
});


export default allReducers;
