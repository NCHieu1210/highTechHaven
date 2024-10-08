import { combineReducers } from "redux";
import dataReducer from "./dataReducer";
import reRenderReducer from "./reRender";
import optionsProductReducer from "./optionsProductReducer";

const allReducers = combineReducers({
  reRender: reRenderReducer,
  data: dataReducer,
  optionsProduct: optionsProductReducer,
});


export default allReducers;
