import React, {Component} from 'react'
import {Card, Button, Table, message, Modal, Form, Select, Input} from 'antd'
import {PlusOutlined, ArrowRightOutlined} from "@ant-design/icons";
import {reqAddCategory, reqCategoryList, reqUpdateCategory} from "../../api"


const Option = Select.Option;

export default class Category extends Component {

    formRef = React.createRef();
    addFormRef = React.createRef();
    state = {
        loading: true,
        category: [],
        parentId: '0',
        parentName: '',
        subCategory: [],
        showStatus: 0,
        fields: {modifiedName: ""},
        categoryName: ""
    }

    getCategoryList = (parentId) => {
        reqCategoryList(parentId).then(
            response => {
                this.setState({loading: false});
                const categorys = response.data.data;
                if(this.state.parentId === '0') { // curent category is parentCategory
                    this.setState({category: categorys});
                } else {   //Now it's in subCategory
                    this.setState({subCategory: categorys});
                }
            }
        ).catch(
            error => {
                message.error("get category list failed! reason: " + error.message)
            }
        )
    }

    showSubCategory = (category) => {
        this.getCategoryList(category._id);
        this.setState({parentId: category._id, parentName: category.name})
        console.log("showSubcategory: "+category)
    }

    showCategory = () => {
        this.setState({parentId: '0', category: this.state.category})
    }

    tableIntializer() {
        this.columns = [
            {
                title: 'category title',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Action',
                width: "30%",
                render: (category) => {
                    return (
                        <span>
                            <Button type = 'link' onClick = {() => this.showUpdateCategory(category)}>Modify</Button>
                            {this.state.parentId === '0' ? <Button type = 'link' onClick ={() => this.showSubCategory(category)}> SubCategory</Button> : null}
                        </span>
                    )
                }
            }
        ];
    }

    showAddCategory = () => {
        this.setState({
            showStatus: 1,
        });
        console.log(this.state.parentId)
        this.addFormRef.current.setFieldsValue({
            parentName: this.state.parentId
        })
    };

    showUpdateCategory = (category) => {
        //console.log("showUpdateCategory: "+category)
        this.category = category
        this.setState({
            showStatus: 2,
        });
        this.setState({categoryName: category.name});
        this.formRef.current.setFieldsValue({
            modifiedName:category.name
        })
    };

    addCategory = () => {
        this.addFormRef.current.validateFields()
            .then(values => {
                const {addForm} = this.state
                const categoryName = addForm[1].value;
                const parentId = addForm[0].value;
                //console.log("categoryName: "+categoryName+" parentId: "+parentId);
                this.setState({
                    showStatus: 0
                })
                if(parentId && categoryName) {
                    reqAddCategory(parentId, categoryName).then(
                        response => {
                            if(response.data.status === 0) {
                                message.success("Add category successful!");
                                if(this.state.parentId === response.data.data.parentId)
                                    this.getCategoryList(this.state.parentId);
                            } else {
                                message.error("Error when adding the category list");
                                //console.log(response);
                            }
                        }
                    )
                } else {
                    message.error("information missing!");
                }
                this.addFormRef.current.resetFields();
            })
            .catch(error => {
                //console.log(error);
                message.error("Please input the categoryName");
            })

    };

    ShowTheObject = (obj) => {
        let des = "";
        for(let name in obj){
            des += name + ":" + obj[name] + ";";
        }
        console.log(des);
    }

    updateCategory = () => {
        this.formRef.current.validateFields()
            .then( values => {
                //console.log("Now Update the category!"+this.state.parentId);
                this.setState({showStatus: 0});
                const categoryId = this.category._id;
                //console.log("UpdateCategory: " + categoryId);
                let categoryName;
                if(this.state.fields) {
                    this.ShowTheObject(this.state.fields);
                    categoryName = this.state.fields[0].value;
                    console.log("UpdateCategory: " + categoryName);
                } else
                    message.error("Please input a valid modified name!");
                if(categoryId && categoryName) {
                    reqUpdateCategory(categoryId, categoryName).then(
                        response => {
                            if(response.data.status === 0) {
                                message.success("Update successful!");
                                this.getCategoryList(this.state.parentId);
                            } else {
                                message.error("Error when updating the category list");
                                //console.log(response);
                            }
                        }
                    )
                } else {
                    message.error("information missing!");
                }
                this.formRef.current.resetFields();
            })
            .catch(error => {
                //console.log("Invalid input ! Please check again.");
                message.error("Invalid input ! Please check again.");
            })

    };

    hideModal = () => {
        this.setState({
            showStatus: 0,
        });
    };

    componentDidMount() {
        this.getCategoryList(0);
    }

    UNSAFE_componentWillMount() {
        this.tableIntializer();
    }

    render() {
        const title = this.state.parentId === '0' ? "Category List" : (
            <span>
                <Button type = 'link' onClick = {this.showCategory}>Base Category List</Button>
                <span>
                    <ArrowRightOutlined />&nbsp;&nbsp;&nbsp;{this.state.parentName}
                </span>
            </span>
        );
        const extra = "Add More";

        return (
            <Card title={title} extra={<Button type = 'primary' icon = {<PlusOutlined />} onClick = {this.showAddCategory} >{extra}</Button>} >
                <Form
                    name = "add-form"
                    layout={"vertical"}
                    ref = {this.addFormRef}
                    onFieldsChange={(changedFields, allFields) => {
                        this.setState({
                            addForm: allFields
                        })
                        console.log(111);
                    }}
                >
                    <Modal
                        title="Add new categories"
                        visible={this.state.showStatus === 1}
                        onOk={this.addCategory}
                        onCancel={this.hideModal}
                        okText="Submit"
                        cancelText="Cancel"
                    >

                    <Form.Item
                        label="Parent Category"
                        name = "parentName"
                        initialValue= {this.state.parentId}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the categoryName!'}
                        ]}>
                        <Select>
                            <Option value = '0' key = '0'>Root Category</Option>
                            {
                                this.state.category.map(Item => <Option value = {Item._id} key = {Item._id}>{Item.name}</Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name = "categoryName"
                        label = "category Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the categoryName!'},
                            {
                                pattern: /^[0-9a-zA-Z ]*$/,
                                message: 'only characters,digits & blanks are valid'},

                        ]}>
                        <Input placeholder="Please input the category name"  />
                    </Form.Item>
                    </Modal>
                </Form>
                <Form
                    layout="vertical"
                    name = "update-form"
                    ref = {this.formRef}
                    onFieldsChange={(changedFields, allFields) => {
                        this.setState({
                            fields: allFields
                        })
                    }}

                >
                    <Modal
                        title="Update categories"
                        visible={this.state.showStatus === 2}
                        onOk={this.updateCategory}
                        onCancel={this.hideModal}
                        okText="Submit"
                        cancelText="Cancel"
                    >

                    <Form.Item
                        label="Modified Name"
                        name = "modifiedName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the new Name!'},
                            {
                                pattern: /^[0-9a-zA-Z ]*$/,
                                message: 'only characters,digits & blanks are valid'},
                        ]}>
                        <Input placeholder="Please input the new name" autoComplete="off" name = "inputName" allowClear={true}/>
                    </Form.Item>
                    </Modal>
                </Form>
                <Table
                    loading={this.state.loading}
                    dataSource={ this.state.parentId === '0' ? this.state.category : this.state.subCategory}
                    columns={this.columns}
                    bordered
                    pagination={{ pageSize: 5,  showQuickJumper: true}}
                    rowKey = '_id'
                />
            </Card>
        )
    }
}