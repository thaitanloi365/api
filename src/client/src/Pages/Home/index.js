import React, { useState } from "react";
import { Row, Col, Button, Icon } from "antd";
import Sidebar from "Components/Sidebar";
import Header from "Components/Header";

import "./Home.scss";

function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    console.log("collapsed", collapsed);
  };
  return (
    <div className="home">
      <Row>
        <Col md={{ span: collapsed ? 2 : 3 }} className="homeLeft">
          <Button
            type="primary"
            onClick={toggleCollapsed}
            style={{ marginBottom: 16 }}
          >
            <Icon type={collapsed ? "menu-unfold" : "menu-fold"} />
          </Button>
          <Sidebar collapsed={collapsed} />
        </Col>
        <Col md={{ span: collapsed ? 22 : 21 }} className="homeRight">
          <Header />
        </Col>
      </Row>
    </div>
  );
}

export default Home;
