export const SIDEBAR_COLLAPSED = "SIDEBAR_COLLAPSED";

export function setSidebarCollapsed(collapsed) {
  return {
    type: SIDEBAR_COLLAPSED,
    collapsed: !collapsed
  };
}
