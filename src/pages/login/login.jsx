import React, {Component} from 'react'
import './login.less'
import logo from './images/logo.png'
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

//login router component
export default class Login extends Component {
    render() {
        return (
            <div className="login">
                <header className="login-header">
                    <img src = {logo} alt = "123"/>
                    <h1>Welcome to my management system!</h1>
                </header>
                <div className="login-content">
                    <h2>Login</h2>
                    <Form  name="normal_login"  className="login-form">
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>

                        <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                         </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}