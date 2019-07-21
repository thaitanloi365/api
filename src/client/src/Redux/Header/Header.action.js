export const SET_HEADER_TITLE = "SET_HEADER_TITLE";

export function setHeaderTitle(headerTitle) {
  return {
    type: SET_HEADER_TITLE,
    headerTitle: headerTitle
  };
}
