import React, { useState } from "react";
import { Row, Col } from "antd";
import { Typography } from "antd";
import { Form, Icon, Input, Button } from "antd";
import LoginBg from "../../assets/images";

import "./Login.scss";

const { Title } = Typography;

function Login() {
  const [loginUserInfo, setLoginUserInfo] = useState({ username: "" });
  const [loginPassInfo, setLoginPassInfo] = useState({ password: "" });

  const handleOnChange = (event) => {
    let target = event.target;
    let name = target.name;
    let value = target.value;
    if (name === "username") {
      setLoginUserInfo({ ...loginUserInfo, username: value });
    } else if (name === "password") {
      setLoginPassInfo({ ...loginPassInfo, password: value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(loginUserInfo, loginPassInfo);
  };

  return (
    <div className="login">
      <Row>
        <Col md={{ span: 12 }} sm={{ span: 0 }} className="loginLeft">
          <img src={LoginBg} alt="Login bg" />
        </Col>
        <Col md={{ span: 12 }} sm={{ span: 24 }} className="loginRight">
          <div>
            <Title className="loginTitle">Welcome back,</Title>
            <Title className="loginTitle" level={4}>
              please login to your account
            </Title>

            <Form className="loginForm" onSubmit={handleSubmit}>
              <Form.Item>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Username"
                  name="username"
                  onChange={handleOnChange}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleOnChange}
                />
              </Form.Item>
              <Form.Item className="loginControl">
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
                <a className="loginForgot" href="#">
                  Forgot password?
                </a>
              </Form.Item>
            </Form>
          </div>
          <div className="createAccount">
            <a href="#">Create Account</a>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
