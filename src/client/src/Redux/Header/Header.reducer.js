import { SET_HEADER_TITLE } from "./Header.action";

const initialState = {
  headerTitle: "DashBoard"
};

export default function headerRuducer(state = initialState, action) {
  switch (action.type) {
    case SET_HEADER_TITLE:
      return { ...state, headerTitle: action.headerTitle };
    default:
      return state;
  }
}
