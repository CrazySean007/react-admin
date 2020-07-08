import React, {Component} from 'react'
import './login.less'
import logo from '../../assets/images/logo.png'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {reqLogin} from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import {Redirect} from "react-router-dom";

//login router component
export default class Login extends Component {
    login = values => {
        console.log('Received values of form: ', values);
        const {username, password} = values;
        reqLogin(username, password).then(
            response => {
                const result = response.data
                const user = result.data
                memoryUtils.user = user  //store in memory
                storageUtils.saveUser(user)
                if(result.status === 0) {
                    message.success("login successful!")
                    this.props.history.push('/')
                } else {
                    message.error("login failed!"+result.msg)
                }

            }
        ).catch(
            error => {
                message.error("login failed! reason: " + error.message)
            }
        )
    }


    validator = (rule, value) => {
        const re = /^[0-9a-zA-Z_]*$/
        const length = value && value.length
        if(!value) return Promise.reject('password is required!')
        else if(length > 18) return Promise.reject('password length max 18');
        else if(length < 4) return Promise.reject('password length at least 4');
        else if (!re.test(value)) return Promise.reject('only characters, digits and _ are allowed');
        else return Promise.resolve();
    }

    render() {

        //if the user has logged in, just redirect to /admin component
        const user = memoryUtils.user
        if(user._id) {
            //redirect to login component
            //message.error('not logged in!')
            return <Redirect to='/'/>
        }

        return (
            /*
                username/password validation requirement
                    1). required
                    2). length greater than 4
                    3). length less than 12
                    4). consists of characters, digits and _
            */
            <div className="login">
                <header className="login-header">
                    <img src = {logo} alt = "123"/>
                    <h1>Welcome to my management system!</h1>
                </header>
                <div className="login-content">
                    <h2>Login</h2>
                    <Form name="normal_login"  className="login-form" onFinish={this.login}>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!'},
                                {
                                    max: 12,
                                    min: 4,
                                    message: 'Please check your input length(4-12)'},
                                {
                                    pattern: /^[0-9a-zA-Z_]*$/,
                                    message: 'only characters,digits & _ are valid'},

                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    validator: this.validator
                                }
                            ]}
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
    /*
        1. frontend form validation
        2. collect input information
     */


}