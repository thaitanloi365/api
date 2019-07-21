import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "antd";

import Sidebar from "Components/Sidebar";
import UserList from "Components/UserList";
import Header from "Components/Header";

const mapStateToProps = (state) => ({
  collapsed: state.sidebarReducer.collapsed
});

function UserManagement(props) {
  return (
    <div className="home">
      <Row>
        <Col md={{ span: props.collapsed ? 2 : 3 }} className="homeLeft">
          <Sidebar />
        </Col>
        <Col md={{ span: props.collapsed ? 22 : 21 }} className="homeRight">
          <Header />
          <UserList />
        </Col>
      </Row>
    </div>
  );
}

export default connect(mapStateToProps)(UserManagement);
