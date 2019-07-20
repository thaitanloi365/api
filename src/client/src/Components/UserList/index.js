import React from "react";
import { Table, Divider, Tag } from "antd";

function UserList() {
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <a href="javascript:;">{text}</a>
    },
    {
      title: "FirstName",
      dataIndex: "firstName",
      key: "firstname"
    },
    {
      title: "LastName",
      dataIndex: "lastName",
      key: "lastname"
    },
    {
      title: "EmployeeID",
      dataIndex: "employeeID",
      key: "employeeID"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a href="javascript:;">{text}</a>
    },
    {
      title: "Risk Score",
      dataIndex: "riskScore",
      key: "key"
    }
  ];
  const data = [
    {
      key: "1",
      username: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      firstName: "John",
      lastName: "Brown",
      employeeID: "#123456",
      email: "john.brown@gmail.com",
      riskScore: 93
    },
    {
      key: "2",
      username: "John Brown",
      age: 22,
      address: "New York No. 1 Lake Park",
      firstName: "John",
      lastName: "Brown",
      employeeID: "#123456",
      email: "john.brown@gmail.com",
      riskScore: 91
    },
    {
      key: "3",
      username: "John Brown",
      age: 30,
      address: "New York No. 1 Lake Park",
      firstName: "John",
      lastName: "Brown",
      employeeID: "#123456",
      email: "john.brown@gmail.com",
      riskScore: 92
    },
    {
      key: "4",
      username: "John Brown",
      age: 30,
      address: "New York No. 1 Lake Park",
      firstName: "John",
      lastName: "Brown",
      employeeID: "#123456",
      email: "john.brown@gmail.com",
      riskScore: 95
    },
    {
      key: "5",
      username: "John Brown",
      age: 30,
      address: "New York No. 1 Lake Park",
      firstName: "John",
      lastName: "Brown",
      employeeID: "#123456",
      email: "john.brown@gmail.com",
      riskScore: 100
    }
  ];
  return (
    <div className="userList">
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default UserList;
