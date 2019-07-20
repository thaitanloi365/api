import React from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";

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
          <Link to="/">
            <span>
              <Icon type="dashboard" />
              <span>Dasboard</span>
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="analytics">
            <span>
              <Icon type="bar-chart" />
              <span>Analytics</span>
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/applications">
            <span>
              <Icon type="appstore" />
              <span>Applications</span>
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/usermanagement">
            <span>
              <Icon type="team" />
              <span>Management</span>
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="setting">
            <span>
              <Icon type="setting" />
              <span>Setting</span>
            </span>
          </Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Sidebar;
