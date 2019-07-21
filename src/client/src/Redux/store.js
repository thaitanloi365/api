import { createStore, combineReducers } from "redux";
import sidebarReducer from "Redux/SideBar/SideBar.reducer";
import headerRuducer from "Redux/Header/Header.reducer";

const rootRecudecers = combineReducers({
  sidebarReducer,
  headerRuducer
});

const store = createStore(rootRecudecers);

export default store;
