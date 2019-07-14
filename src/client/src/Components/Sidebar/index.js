import React from "react";
import { Menu, Icon } from "antd";

import "./Sidebar.scss";

function Sidebar(props) {
  return (
    <div className="sidebar">
      <Menu
        defaultSelectedKeys={["1"]}
        mode="inline"
        inlineCollapsed={props.collapsed}
        className="menu"
      >
        <Menu.Item key="1">
          <span>
            <Icon type="dashboard" />
            <span>Dasboard</span>
          </span>
        </Menu.Item>
        <Menu.Item key="2">
          <span>
            <Icon type="bar-chart" />
            <span>Analytics</span>
          </span>
        </Menu.Item>
        <Menu.Item key="3">
          <span>
            <Icon type="appstore" />
            <span>Applications</span>
          </span>
        </Menu.Item>
        <Menu.Item key="4">
          <span>
            <Icon type="team" />
            <span>Management</span>
          </span>
        </Menu.Item>
        <Menu.Item key="5">
          <span>
            <Icon type="setting" />
            <span>Setting</span>
          </span>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Sidebar;
