import React, { useState } from "react";
import { Row, Col } from "antd";
import { Typography } from "antd";
import { Form, Icon, Input, Button } from "antd";
import { Strings } from "Strings";
import { Api } from "Services";
import Assets from "Assets";
import "./Login.scss";

const { Title } = Typography;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnChange = event => {
    let target = event.target;
    let name = target.name;
    let value = target.value;
    if (name == "email") setEmail(value);
    else if (name == "password") setPassword(value);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    await Api.login(email, password);
  };

  return (
    <div className="login">
      <Row>
        <Col md={{ span: 12 }} sm={{ span: 0 }} className="loginLeft">
          <img src={Assets.images.loginBg} alt="Login bg" />
        </Col>
        <Col md={{ span: 12 }} sm={{ span: 24 }} className="loginRight">
          <div>
            <Title className="loginTitle">{Strings.welcomeBack}</Title>
            <Title className="loginTitle" level={4}>
              {Strings.pleaseLogin}
            </Title>

            <Form className="loginForm" onSubmit={handleSubmit}>
              <Form.Item>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Email"
                  name="email"
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
                  {Strings.login}
                </Button>
                <a className="loginForgot" href="#">
                  {Strings.forgotPassword}
                </a>
              </Form.Item>
            </Form>
          </div>
          <div className="createAccount">
            <a href="#">{Strings.createAccount}</a>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
