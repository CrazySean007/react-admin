import React, {Component} from 'react'
import {Button, Card, Form, Input, message, Select, Table, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {reqDeleteProduct, reqProductList, reqSearchProduct, reqUpdateProductStatus} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'


const {Option} = Select;

export default class ProductHome extends Component {


    state = {
        productList: [],
        total: 0,
        pageNum: 1,
        loading: true,
        visible: false
    }

    searchResult = (pageNum) => {

        const {formData} = this.state;
        const searchData = {
            pageNum: pageNum,
            pageSize: PAGE_SIZE
        };
        if(formData[0].value === '0')
            searchData.productName = formData[1].value;
        else
            searchData.productDesc = formData[1].value;

        console.log("search Data(): ", searchData);
        reqSearchProduct(searchData)
            .then(
                response => {
                    //console.log('Yeah!');
                    console.log("search result: ", response.data);
                    const list = response.data.data.list;
                    const total = response.data.data.total;
                    this.setState({
                        productList: list,
                        total,
                        pageNum: 1,
                        loading: false
                    })
                }
            )
            .catch(
                error => {
                    message.error("search product list failed! reason: " + error.message);
                }
            )
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false
        });
    };

    tableInitializer = () => {
        this.columns = [
            {
                title: 'Product Name',
                dataIndex: 'name'
            },
            {
                title: 'Product Description',
                dataIndex: 'desc'
            },
            {
                title: 'Price',
                render: (product) => '$'+product.price
            },
            {
                title: 'Status',
                render: (product) => {
                    if(product.status === 1) { //this product is on sale
                        return <span>
                            <Button onClick={() => this.updateProductStatus(product._id, 2)} type = 'primary'>Withdraw</Button><br />
                            <span style = {{color: 'blue'}}>available</span>
                        </span>
                    } else {
                        return <span>
                            <Button onClick={() => this.updateProductStatus(product._id, 1)} type = 'primary'>Launch</Button><br />
                            <span style = {{color: 'red'}}>unavailable</span>
                        </span>
                    }

                }
            },
            {
                title: 'Operation',
                render: (product) => {
                    return (
                        <div>
                            <Button type = 'link' name='details' onClick={() => this.getProductDetails(product)}>
                                details
                            </Button>
                            <Button type = 'link' name='modify' onClick={() => this.props.history.push('/product/addupdate', product)}>
                                modify
                            </Button>
                            <Button type = 'link' name='delete' onClick={() => this.confirmDeletion(product)}>
                                delete
                            </Button>
                            <Modal
                                title={"Delete " + product.name}
                                visible={this.state.visible}
                                onOk={() => this.deleteProducts(product)}
                                onCancel={this.hideModal}
                            >
                                <p>Are you sure to delete <br /><span style={{fontWeight:'bold', color: 'red', fontSize: 20}}>{product.name}</span></p>
                            </Modal>
                        </div>
                    )
                }
            }
        ];
    }

    onPageChange = (page) => {
        this.getProductList(page);
        this.setState({
            pageNum: page
        })
    }

    updateProductStatus = (productId, status) => {
        reqUpdateProductStatus({productId, status})
            .then(
                response => {
                    console.log(response)
                    if(response.data.status === 0) {
                        message.success('update Successful!');
                        this.getProductList(this.state.pageNum, PAGE_SIZE);
                    } else {
                        message.error('update Failed!')
                    }
                }
            )
            .catch(
                error => {
                    message.error("update failed! reason: " + error.message);
                }
            )
    };

    UNSAFE_componentWillMount() {
        this.tableInitializer();
    }

    componentDidMount() {
        this.getProductList(1, PAGE_SIZE);
    }

    getProductList = (pageNum) => {
        this.setState({
            loading: true
        })
        const {formData} = this.state;
        if(!formData) {
            console.log("show product home list!");
            reqProductList(pageNum, PAGE_SIZE)
                .then(
                    (response) => {
                        const list = response.data.data.list
                        const totalNum = response.data.data.total;
                        this.setState({
                            productList: list,
                            total: totalNum,
                            loading: false
                        })
                    }
                )
                .catch(
                    error => {
                        message.error("get product list failed! reason: " + error.message)
                    }
                )

        } else {
            console.log("show search result!");
            this.searchResult(pageNum);
        }
    }

    getProductDetails = (product) => {
        console.log(product)
        let path = {
            pathname:'/product/detail',
            query:product,
        }
        this.props.history.push(path);
    }

    render() {
        const title = <Form
            name = 'searchForm'
            layout='inline'
            ref = {this.formRef}
            onFieldsChange={(changedFields, allFields) => {
                this.setState({
                    formData: allFields
                });
            }}
            onFinish={() => this.getProductList(1)}
        >
            <Form.Item name = 'selectInput' initialValue = "0">
                <Select >
                    <Option value="0">Search by name</Option>
                    <Option value="1">Search by description</Option>
                </Select>
            </Form.Item>
            <Form.Item name = 'searchInput'>
                <Input placeholder="keywords" />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" className="login-form-button" type="primary">
                    Search
                </Button>
            </Form.Item>
        </Form>;

        const extra = <span>
            <Button onClick={() => this.props.history.push('/product/addupdate')} type="primary" icon = {<PlusOutlined />}>Add Product</Button>
        </span>;

        return (
            <Card className="productHome" title={title} extra={extra}>
                <Table
                    dataSource={this.state.productList}
                    columns={this.columns}
                    rowKey = '_id'
                    pagination={{
                        pageSize: PAGE_SIZE,
                        total:this.state.total,
                        onChange: this.onPageChange,
                        current: this.state.pageNum,
                    }}
                    loading = {this.state.loading}
                />;
            </Card>
        )
    }


    deleteProducts = product => {
        const {_id} = product;
        reqDeleteProduct(_id)
            .then(
                response => {
                    const result = response.data
                    if(result.status === 0) {
                        message.success("deletion successful!");
                        this.getProductList(this.state.pageNum);
                    } else {
                        message.error("deletion failed!");
                    }
                }
            )
            .catch(
                err => {
                    message.error("deletion failed! reason: "+err.message);
                }
            )
        this.getProductList(this.state.pageNum);
    }


    confirmDeletion() {
        this.showModal();
    }
}