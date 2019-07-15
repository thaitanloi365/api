import React from "react";
import { Menu, Icon } from "antd";

import "./Header.scss";

const { SubMenu } = Menu;

function Header() {
  return (
    <div className="headerInfo">
      <div className="headerTitle">
        <h1>Title</h1>
      </div>
      <div className="headerAccount">
        <div className="accountNotify">
          <a href="#">
            <Icon type="bell" />
          </a>
        </div>
        <div className="accountUser">
          <Menu mode="inline" className="menuHeader">
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="user" />
                  Admin
                </span>
              }
              className="subMenuHeader"
            >
              <Menu.Item key="1">Setting Account</Menu.Item>
              <Menu.Item key="2">Logout</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Header;
