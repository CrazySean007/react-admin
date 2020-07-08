import React, {Component} from 'react'
import {Table, Button, Divider, message, Modal, Form, Input, Tree} from 'antd'
import {reqRoleList, reqAddRole, reqUpdateRole} from "../../api";
import {PAGE_SIZE} from "../../utils/constants";
import menuList from "../../config/menuList";
import memoryUtils from "../../utils/memoryUtils";
import {formatDate} from "../../utils/dateUtils"
import storageUtils from "../../utils/storageUtils";
import {Redirect} from "react-router-dom";

export default class Role extends Component {

    addForm = React.createRef();
    modifyForm = React.createRef();
    state = {
        selectedRole: {},
        roles: [],
        loading: true,
        visible: 0,
        selectedKeys: [],
        modifiedRole: {},
    }

    tableInitializer = () => {
        this.columns = [
            {
                title: 'Role name',
                dataIndex: 'name',
            },
            {
                title: 'Created time',
                dataIndex: 'create_time',
                render: create_time => formatDate(create_time),
            },
            {
                title: 'Authorized time',
                dataIndex: 'auth_time',
                render: auth_time => formatDate(auth_time),
            },
            {
                title: 'Authorizer',
                dataIndex: 'auth_name',
            },
        ];
    }

    getRoleList() {

        reqRoleList()
            .then(
                response => {
                    const result = response.data.data;
                    const roles = result.map(role => ({
                        key: role._id,
                        name: role.name,
                        create_time: role.create_time,
                        menus: role.menus,
                        auth_time: role.auth_time,
                        auth_name: role.auth_name
                    }))
                    this.setState({
                        roles,
                        loading: false
                    });
                }
            )
            .catch(
                err => {
                    message.error("error when get role list! reason: "+err.message)
                }
            )
    }

    getMenuList= menuList => {
        return menuList.map(item => ({
            title: item.title,
            key: item.key,
            children: (item.children ? this.getMenuList(item.children) : []),
        }))
    }

    setAccess = () => {
        const formData = this.state.selectedRole;
        console.log("selectedRole: ", formData);
        this.setState({
            visible: 2,
            checkedKeys: formData.menus,
            modifiedRole: formData,
        });
        this.modifyForm.current.setFieldsValue({
            roleName: formData.name,
        });
    }

    showModal = () => {
        this.setState({
            visible: 1
        });
    }

    handleOk = () => {
        this.setState({
            visible: 0,
        });
        const name = this.addForm.current.getFieldsValue().inputName;

        if(name && name !== "") {
            reqAddRole(name)
                .then(
                    response => {
                        const result = response.data;
                        if(result.status === 0) {
                            message.success("add new role successful!");
                            this.getRoleList();
                        } else {
                            message.error("add new role failed!");
                        }
                    }
                )
                .catch(
                    err => {
                        message.error("add new role failed! reason: "+err.message);
                    }
                )
        }
    };

    handleCancel = () => {
        this.setState({
            visible: 0,
        });
    };

    onRow = (role) => {
        return {
            onClick: () => {
                console.log('row onClick()', role);
                this.setState({
                    selectedRole: role
                });
            }
        }
    }

    submit = () => {
        const {modifiedRole} = this.state;
        console.log(modifiedRole);
        const {key} = modifiedRole;
        let data = {};
        data._id = key;
        data.auth_time = new Date().valueOf();
        data.auth_name = memoryUtils.user.username;
        data.menus = this.state.checkedKeys;
        console.log("data: ");
        console.log(data);
        reqUpdateRole(data)
            .then(
                response => {

                    const result = response.data;
                    if(result.status === 0) {
                        if(data._id === memoryUtils.user.role._id) {
                            memoryUtils.user = {};
                            storageUtils.removeUser();
                            this.props.history.replace('/login');
                            this.props.history.go();
                            message.info("current role access has been modified! Please login again!");
                            this.setState();
                        } else {
                            message.success("update successful!");
                            this.handleCancel();
                        }

                    } else {
                        message.error("update failed!");
                        this.handleCancel();
                    }
                }
            )
            .catch(
                err => {
                    message.error("update failed! reason: "+err.message);
                    this.handleCancel();
                }
            )
        this.setState({
            checkedKeys: data.menus,
        });
        this.getRoleList();
        setTimeout(() => {
            const newRole = this.state.roles.find(cItem => cItem.key === key);
            console.log("newRole: ", newRole)
            this.setState({
                selectedRole: newRole,
            })
        }, 1000);

    }

    componentDidMount() {
        this.tableInitializer();
    }

    UNSAFE_componentWillMount() {
        this.getRoleList();
        this.treeData = this.getMenuList(menuList);
    }


    render() {

        if(!memoryUtils.user || !storageUtils.getUser()) {
            //console.log("No!");
            return <Redirect to='/login'/>
        }

        const {selectedKeys} = this.state;

        // rowSelection object indicates the need for row selection
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({
                    selectedRole: selectedRows[0]
                })
            }
        };

        const onSelect = (selectedKeys, info) => {
            //console.log('onSelect', info);
            this.setState({selectedKeys});
        };

        return (
            <div style={{padding: 20}}>
                <span>
                    <Form
                        ref = {this.addForm}
                        onFinish = {this.handleOk}
                    >
                        <Modal
                            title="Add new role"
                            visible={this.state.visible === 1}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                          <Form.Item
                              name = "inputName"
                              label = "Role Name: "
                              rules={[
                                  {
                                      required: true,
                                      message: 'Please input role name!'
                                  }
                              ]}
                          >
                              <Input placeholder = 'role name is required!' />
                          </Form.Item>
                        </Modal>
                    </Form>

                    <Form
                        ref = {this.modifyForm}
                    >
                        <Modal
                            title="modify access"
                            visible={this.state.visible === 2}
                            onOk={this.submit}
                            onCancel={this.handleCancel}
                        >
                          <Form.Item
                              name = "roleName"
                              label = "Role Name: "
                          >
                              <Input disabled/>
                          </Form.Item>

                           <Form.Item
                                name = "roleName"
                                label = "Role Name: "
                           >
                              <Tree
                                  checkable = "false"
                                  autoExpandParent="true"
                                  onSelect={onSelect}
                                  selectedKeys={selectedKeys}
                                  treeData={this.treeData}
                                  selectable="false"
                                  defaultExpandAll="true"
                              />
                           </Form.Item>

                        </Modal>
                    </Form>

                    <Button
                        name = 'create-new'
                        type = 'primary'
                        onClick={this.showModal}
                        style={{marginTop: 15, marginBottom: 15, marginLeft: 15, borderRadius: 5}}
                    >
                        Create New
                    </Button>
                    <Button
                        name = 'set-access'
                        type = 'primary'
                        onClick={this.setAccess}
                        disabled={!this.state.selectedRole.key}
                        style={{marginLeft: 15, marginRight: 15, borderRadius: 5}}
                    >
                        Set Access
                    </Button>
                </span>
                <Divider />
                <Table
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [this.state.selectedRole.key],
                        ...rowSelection,
                    }}
                    bordered
                    rowKey = 'key'
                    loading= {this.state.loading}
                    columns={this.columns}
                    dataSource={this.state.roles}
                    pagination={{pageSize: PAGE_SIZE}}
                    onRow = {this.onRow}
                />
            </div>

        )
    }


}