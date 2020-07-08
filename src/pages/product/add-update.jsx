import React, {Component} from 'react'
import {Button, Card, Input, Form, Cascader, message, Upload, Modal} from "antd";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {reqAddProduct, reqCategoryList, reqDeleteImg, reqUpdateProduct} from "../../api";
import RichTextEditor from "./rich-text-editor";


const {TextArea} = Input;
const Item = Form.Item

export default class ProductAddUpdate extends Component {

    state = {
        options:[],
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    }

    formRef = React.createRef();

    editorRef = React.createRef();

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({ file, fileList }) => {
        console.log('handleChange(): ', file, fileList);
        if(file.status === 'done') {
            const result = file.response;
            if(result.status === 0) {
                message.success('upload successful!');
                const {name, url} = result.data;
                file = fileList[fileList.length - 1];
                file.name = name;
                file.url = url;
            } else {
                message.error('upload failed!');
            }
        }
        if(file.status === 'removed') {
            const fileName = file.name;
            reqDeleteImg(fileName)
                .then(
                    response => {
                        if(response.data.status === 0)
                            message.success('deletion successful!')
                        else
                            message.error('deletion failed!')
                    }
                )
                .catch(
                    err => {
                        message.error('deletion failed! reason: ' + err.message)
                    }
                )
        }
        this.setState({fileList})
    }

    getBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    onFinish = () => {
        const data = this.formRef.current.getFieldsValue();
        const imgs = this.state.fileList.map(cItem => (
            cItem.name
        ))
        data.imgs = imgs;
        const categoryInfo = data.productCategory;
        if(categoryInfo.length === 1) {
            data.pCategoryId = '0';
            data.categoryId = categoryInfo[0];
        } else {
            data.pCategoryId = categoryInfo[0];
            data.categoryId = categoryInfo[1];
        }

        const detail = this.editorRef.current.getContent();
        data.detail = detail;
        console.log("send detail: ");
        console.log(detail);
        if(!this.isUpdate)
            reqAddProduct(data)
                .then(
                    response => {
                        const result = response.data.data
                        console.log("result of submit: ")
                        console.log(result);
                        this.props.history.goBack();
                    }
                )
                .catch(
                    error => {
                        message.error('error when adding product! ' + error.message);
                    }
                );
        else {
            data._id = this.state._id;
            reqUpdateProduct(data)
                .then(
                    response => {
                        if(response.data.status === 0) {
                            message.success("update successful! ")
                        } else {
                            message.error(("update failed!"))
                        }
                        this.props.history.goBack();
                    }
                )
                .catch(
                    error => {
                        message.error('error when adding product! ' + error.message);
                    }
                )
        }
    }

    getCategoryList = (parentId) => {
        reqCategoryList(parentId).then(
            response => {
                const categorys = response.data.data;
                if(parentId === '0') {
                    this.iniOptions(categorys);
                } else {
                    this.setState({
                        categorys: categorys
                    });
                }
            }
        ).catch(
            error => {
                message.error("get category list failed! reason: " + error.message)
            }
        )
    }

    iniOptions = (categorys) => {
        const options = categorys.map(cItem => ({
            value: cItem._id,
            label: cItem.name,
            isLeaf: false,
        }))
        // console.log("options: ")
        // console.log(options)

        const {isUpdate, product} = this;
        // eslint-disable-next-line
        const {pCategoryId, categoryId} = product;
        // console.log("iniOptions(): ")
        // console.log(pCategoryId, categoryId)
        if(isUpdate && pCategoryId !== '0') {
            reqCategoryList(pCategoryId).then(
                response => {
                    const categorys = response.data.data;
                    // console.log("categorys: ")
                    // console.log(categorys)
                    const subCategory = categorys.map(c => ({
                        label: c.name,
                        value: c._id,
                        isLeaf: true
                    }))
                    const levelOne = options.find(option => (option.value === pCategoryId));
                    levelOne.children = subCategory;
                    // console.log("LevelOne: "+levelOne)
                    this.setState({
                        options: [...options]
                    })
                }
            ).catch(
                error => {
                    message.error("get category list failed! reason: " + error.message)
                }
            )
        }
        this.setState({
            options
        })
    }

    loadData = selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        //console.log(targetOption)
        reqCategoryList(targetOption.value)
            .then(
                response => {
                    targetOption.loading = false;
                    const data = response.data.data;
                    if(data && data.length > 0) {
                        const children = data.map(c => ({
                            label: c.name,
                            value: c._id,
                            isLeaf: true
                        }))
                        targetOption.children = children;
                    } else {
                        targetOption.isLeaf = true;
                        this.setState({
                            options: [...this.state.options]
                        })
                    }
                    this.setState({
                        options: [...this.state.options]
                    })
                }
            ).catch(
                error => {
                    message.error("get category list failed! reason: " + error.message)
                }
            )


    };

    setFormInfo = (product) => {
        const {pCategoryId, categoryId, name, desc, detail, price, imgs, _id} = product;
        const categoryInfo = [];
        if(pCategoryId === '0')
            categoryInfo.push(categoryId);
        else {
            categoryInfo.push(pCategoryId);
            categoryInfo.push(categoryId);
        }
        this.formRef.current.setFieldsValue({
            name: name,
            productCategory: categoryInfo,
            desc: desc,
            price: price,
            detail: detail
        })
        //set imgs
        const fileList = imgs.map(img => ({
            uid: img,
            name: img,
            status: 'done',
            url: '/upload/'+img,
        }))
        this.setState({fileList, _id: _id})
        console.log("fileList(): ")
        console.log(fileList)
    }

    UNSAFE_componentWillMount() {
        const product = this.props.location.state;
        this.isUpdate = !!product;
        this.product = product || {};
    }

    componentDidMount() {
        this.getCategoryList('0');
        if(this.isUpdate) {
            this.setFormInfo(this.product);

        }
    }

    render() {

        const formItemLayout = {
            labelCol: {
                span: 4
            },
            wrapperCol: {
                span: 8
            }
        };

        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        let detail;
        if(this.isUpdate) detail = this.product.detail;
        else detail ='';

        const title = <span style={{fontsize: 20}}>
            <Button type = 'link' onClick={() => this.props.history.goBack()}>
                <ArrowLeftOutlined />
            </Button>
            {this.isUpdate ? 'Modify ' : 'Add '}Product
        </span>


        const {fileList, previewVisible, previewTitle, previewImage} = this.state;

        return (
            <Card title = {title} className='add-product'>
                <Form
                    {...formItemLayout}
                    name = 'addProduct'
                    onFinish = {this.onFinish}
                    scrollToFirstError
                    ref = {this.formRef}
                    >
                    <Item
                        name = 'name'
                        label = 'Product Name'
                        rules = {[
                            {
                                required: true,
                                message: 'Product name is required'
                            }
                        ]}
                        >
                        <Input placeholder='Please input product name'/>
                    </Item>

                    <Item
                        name = 'desc'
                        label = 'Product Desc'
                        rules = {[
                            {
                                required: true,
                                message: 'Product description is required'
                            }
                        ]}
                    >
                        <TextArea placeholder='Please input product description'/>
                    </Item>

                    <Item
                        name = 'price'
                        label = 'Product Price'
                        rules = {[
                            {
                                required: true,
                                message: 'Product price is required!'
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (value > 0)  {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The price must be greater than 0!');
                                },
                            }),
                        ]}
                    >
                        <Input prefix = '$' placeholder='Please input product price' type = 'number'/>
                    </Item>

                    <Item
                        name = 'productCategory'
                        label = 'Product Category'
                        rules = {[
                            {
                                required: true,
                                message: 'Product category is required'
                            }
                        ]}
                    >
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                            onChange={this.onChange}
                            changeOnSelect
                        />
                    </Item>

                    <Item
                        name = 'imgs'
                        label = 'Product Images'
                    >
                        <div className="clearfix">
                            <Upload
                                action="/manage/img/upload"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                accept='image/*'
                                name = 'image'
                            >
                                {fileList.length >= 4 ? null : uploadButton}
                            </Upload>
                            <Modal
                                visible={previewVisible}
                                title={previewTitle}
                                footer={null}
                                onCancel={this.handleCancel}
                            >
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </div>
                    </Item>

                    <Item
                        name = 'detail'
                        label = 'Product Details'
                        labelCol = {{span: 2}}
                        wrapperCol = {{span: 15}}
                    >
                        <RichTextEditor
                            initialInput = {detail}
                            ref = {this.editorRef}
                        />
                    </Item>
                    <Button htmlType="submit" className="login-form-button" type="primary">Submit</Button>
                </Form>
            </Card>

        )
    }


}