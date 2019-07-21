import React, { useState } from "react";
import { connect } from "react-redux";
import { Menu, Icon, Button } from "antd";
import { Link } from "react-router-dom";

import store from "Redux/store";
import { setSidebarCollapsed } from "Redux/SideBar/Sidebar.action";
import { setHeaderTitle } from "Redux/Header/Header.action";

import "./Sidebar.scss";

const mapStateToProps = (state) => ({
  collapsed: state.sidebarReducer.collapsed
});

function Sidebar(props) {
  const toggleCollapsed = () => {
    store.dispatch(setSidebarCollapsed(props.collapsed));
  };

  const changeHeaderTitle = (event) => {
    // console.log("Sidebar", event.target.title);
    store.dispatch(setHeaderTitle(event.target.title));
  };
  return (
    <div className="sidebar">
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        <Icon type={props.collapsed ? "menu-unfold" : "menu-fold"} />
      </Button>
      <Menu
        defaultSelectedKeys={["1"]}
        mode="inline"
        inlineCollapsed={props.collapsed}
        className="menu"
      >
        <Menu.Item key="1">
          <Link to="/" onClick={changeHeaderTitle} title="Dasboard">
            <span>
              <Icon type="dashboard" />
              <span>Dasboard</span>
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="analytics" onClick={changeHeaderTitle} title="Analytics">
            <span>
              <Icon type="bar-chart" />
              <span>Analytics</span>
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link
            to="/applications"
            onClick={changeHeaderTitle}
            title="Applications"
          >
            <span>
              <Icon type="appstore" />
              <span>Applications</span>
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link
            to="/usermanagement"
            onClick={changeHeaderTitle}
            title="Management"
          >
            <span>
              <Icon type="team" />
              <span>Management</span>
            </span>
          </Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="setting" onClick={changeHeaderTitle} title="Setting">
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

export default connect(mapStateToProps)(Sidebar);
