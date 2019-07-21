import { SIDEBAR_COLLAPSED } from "./Sidebar.action";

const initialState = {
  collapsed: false
};

export default function sidebarReducer(state = initialState, action) {
  switch (action.type) {
    case SIDEBAR_COLLAPSED:
      return { ...state, collapsed: action.collapsed };
    default:
      return state;
  }
}
