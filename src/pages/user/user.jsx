import React, {Component} from 'react'
import {Table, Button, Divider, message, Modal, Form, Input, Tooltip, Select} from 'antd'
import {reqAddUser, reqDeleteUser, reqUpdateUser, reqUserList} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";
import {formatDate} from "../../utils/dateUtils"
import {QuestionCircleOutlined} from '@ant-design/icons'

const Option = Select.Option

export default class User extends Component {

    addForm = React.createRef();
    state = {
        users: [],
        roles: [],
        loading: true,
        visible: 0,
        addOrUpdate: 0,
    }

    tableInitializer = () => {
        this.columns = [
            {
                title: 'User name',
                dataIndex: 'username',
            },
            {
                title: 'email',
                dataIndex: 'email',
            },
            {
                title: 'phone',
                dataIndex: 'phone',
            },
            {
                title: 'Create time',
                dataIndex: 'create_time',
                render: create_time => formatDate(create_time),
            },
            {
                title: 'Role Info',
                dataIndex: 'role_id',
            },
            {
                title: 'operation',
                render: (user) => {
                    return <span>
                        <Button type='link' onClick={() => this.modifyUser(user)}>modify</Button>
                        <Button type='link' onClick={() => this.deleteUser()}>delete</Button>
                        <Modal
                            title={
                                <span>
                                     <QuestionCircleOutlined /> delete confirmation
                                </span>
                            }
                            visible={this.state.visible === 2}
                            onOk={() => this.delete(user)}
                            onCancel={this.handleCancel}
                        >
                            <p> &nbsp;&nbsp;Are you sure to delete &nbsp;&nbsp;<span style={{color: 'blue', fontSize: 18}}>&nbsp;&nbsp;{user.username}</span></p>
                        </Modal>
                    </span>
                }
            },
        ];
    }

    modifyUser = (user) => {
        console.log(user);
        this.addForm.current.setFieldsValue({
            inputName: user.username,
            inputPWD: "admin",
            inputPhone: user.phone,
            inputEmail: user.email,
            selectRole: user.role_id
        });
        this.setState({
            visible: 1,
            _id: user._id,
            addOrUpdate: 1,
        });
    }

    deleteUser = () => {
        this.setState({
            visible: 2,
        });
    }

    delete = (user) => {
        console.log(user);
        const {_id} = user;
        console.log(_id);
        reqDeleteUser(_id)
            .then(
                response => {
                    message.success("Deletion successful!");
                    console.log(response.data);
                    this.getUserList();
                    this.setState({
                        visible: 0,
                    });
                }
            )
            .catch(
                err => {
                    message.error("Deletion failed! reason: "+err.message);
                }
            )
    }

    getUserList() {
        reqUserList()
            .then(
                response => {
                    const result = response.data.data;
                    const users = result.users.map(user => ({
                        ...user,
                        key: user._id,
                    }));
                    console.log("users:", users);
                    const roles = result.roles;
                    this.setState({
                        roles,
                        loading: false,
                        users: users
                    });
                }
            )
            .catch(
                err => {
                    message.error("error when get user list! reason: "+err.message)
                }
            )
    }

    showModal = () => {
        this.setState({
            visible: 1,
            addOrUpdate: 0
        });
        this.addForm.current.resetFields();
    }

    handleOk = () => {
        this.addForm.current.validateFields()
            .then(
                values => {
                    let data = {};
                    data.username = values.inputName;
                    data.phone = values.inputPhone;
                    data.email = values.inputEmail;
                    data.role_id = values.selectRole;
                    //if we are adding new users now:
                    if(this.state.addOrUpdate === 0) {
                        data.password = values.inputPWD;
                        reqAddUser(data)
                            .then(
                                response => {
                                    message.success("Add user successful!");
                                    this.getUserList();
                                }
                            )
                            .catch(
                                err => {
                                    message.error("Add User failed! reason: "+err.message);
                                }
                            )

                    } else {
                        //we are updating new users now!
                        /*
                        	  |_id         |Y       |string   |ID
                              |username    |N       |string   |用户名
                              |phone       |N       |string   |手机号
                              |email       |N       |string   |邮箱
                              |role_id     |N       |string   |角色ID
                         */
                        data._id = this.state._id;
                        console.log(data);
                        reqUpdateUser(data)
                            .then(
                                () => {
                                    message.success("Update user successful!");
                                    this.getUserList();
                                }
                            )
                            .catch(
                                err => {
                                    message.error("Update User failed! reason: "+err.message);
                                }
                            )
                    }
                    this.setState({
                        visible: 0,
                    });
                }
            )
            .catch(
                errorInfo => {
                    message.error("form validation not passed!");
                }
            )

    };

    handleCancel = () => {
        this.setState({
            visible: 0,
        });
    };

    validator = (rule, value) => {
        const re = /^[0-9a-zA-Z_]*$/
        const length = value && value.length
        if(!value) return Promise.reject('password is required!')
        else if(length > 18) return Promise.reject('password length max 18');
        else if(length < 4) return Promise.reject('password length at least 4');
        else if (!re.test(value)) return Promise.reject('only characters, digits and _ are allowed');
        else return Promise.resolve();
    }

    getSelectOptions = () => {
        //console.log("get select options now!");
        const {roles} = this.state;
        if(roles && roles.length >= 1) {
            const result = roles.map(role => {
                return <Option value= {role.name} key={role._id}>{role.name}</Option>;
            })
            return result;
        }
    }

    componentDidMount() {
        this.tableInitializer();
    }

    UNSAFE_componentWillMount() {
        this.getUserList();
    }

    render() {

        const layout = {
            labelCol: {
                span: 5,
            },
            wrapperCol: {
                span: 18,
            },
        };

        const title = this.state.addOrUpdate === 0 ? "Add new User" : "Update User information";
        return (
            <div style={{padding: 20}}>
                <span>
                    <Form
                        ref = {this.addForm}
                        onFinish = {this.handleOk}
                        {...layout}
                    >
                        <Modal
                            title={title}
                            visible={this.state.visible === 1}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                          <Form.Item
                              name = "inputName"
                              label = "User Name: "
                              rules={[
                                  {
                                      required: true,
                                      message: 'Please input the username!'},
                                  {
                                      max: 12,
                                      min: 4,
                                      message: 'Please check your input length(4-12)'},
                                  {
                                      pattern: /^[0-9a-zA-Z_]*$/,
                                      message: 'only characters,digits & _ are valid'},
                              ]}
                          >
                              <Input placeholder = 'please input the username' />
                          </Form.Item>

                          <Form.Item
                              name = "inputPWD"
                              label = "password: "
                              rules={[
                                  {
                                      validator: this.validator
                                  }
                              ]}

                          >
                              <Input type = 'password' placeholder = 'please input the password' disabled = {this.state.addOrUpdate !== 0}/>
                          </Form.Item>


                          <Form.Item
                              name = "inputPhone"
                              label ={
                                  <span>
                                      phone&nbsp;
                                      <Tooltip title="We will not sell any of personal information!">
                                          <QuestionCircleOutlined />
                                      </Tooltip>
                                  </span>
                              }
                              rules = {[
                                  {
                                      pattern: /^[0-9]*$/,
                                      message: "the phone number can only consists of numbers!"
                                  }
                              ]}
                          >
                              <Input placeholder = 'please input the phone number' />
                          </Form.Item>

                          <Form.Item
                              name = "inputEmail"
                              label = "email: "
                              rules = {[
                                  {
                                      type: "email",
                                      message: "please input valid email!"
                                  }
                              ]}
                          >
                              <Input placeholder = 'please input the email' />
                          </Form.Item>

                          <Form.Item
                              name = "selectRole"
                              label = "Role: "
                              rules = {[
                                  {
                                      required: true,
                                      message: "Please choose the role of this user!",
                                  }
                              ]}
                          >
                              <Select placeholder = 'please choose the role'>
                                  {this.getSelectOptions()}
                              </Select>
                          </Form.Item>

                        </Modal>
                    </Form>

                    <Button
                        name = 'createNew'
                        type = 'primary'
                        onClick={this.showModal}
                        style={{marginTop: 15, marginBottom: 15, marginLeft: 15, borderRadius: 5}}
                    >
                        Create New
                    </Button>
                </span>
                <Divider />
                <Table
                    bordered
                    rowKey = 'key'
                    loading= {this.state.loading}
                    columns={this.columns}
                    dataSource={this.state.users}
                    pagination={{pageSize: PAGE_SIZE}}
                />
            </div>

        )
    }



}