import React, {Component} from 'react'
import {Card, List, Button, message} from 'antd'
import {ArrowLeftOutlined, ArrowRightOutlined} from "@ant-design/icons";
import {Redirect} from "react-router-dom";
import {reqSearchCategoryName} from "../../api";

const Item = List.Item

export default class ProductDetail extends Component {

    state = {
        categoryName: '',
        pCategoryName: ''
    }

    getCategoryName = (pCategoryId, categoryId) => {
        if(!pCategoryId || !categoryId) return;
        if(pCategoryId === '0') {  //It's in level 1 category
            console.log('search for: ' + categoryId);
            reqSearchCategoryName(categoryId)
                .then(
                    response => {
                        const name = response.data.data.name;
                        this.setState({
                            categoryName: name
                        })
                    }
                )
                .catch(
                    error => {
                        message.error('failure when search categoryName!' + error.message);
                    }
                )
        } else {
            let categoryName = '', pCategoryName = '';

            reqSearchCategoryName(categoryId)
                .then(
                    response => {
                        categoryName = response.data.data.name;
                        this.setState({
                            categoryName
                        })
                    }
                )
                .catch(
                    error => {
                        message.error('failure when search categoryName!');
                    }
                )

            reqSearchCategoryName(pCategoryId)
                .then(
                    response => {
                        pCategoryName = response.data.data.name;
                        this.setState({
                            pCategoryName
                        })
                    }
                )
                .catch(
                    error => {
                        message.error('failure when search parent categoryName!');
                    }
                )


        }

    }


    UNSAFE_componentWillMount() {
        const data = this.props.location.query;
        if(!data) return <Redirect to='/product'/>;
        const {pCategoryId, categoryId} = data;
        this.getCategoryName(pCategoryId, categoryId);
    }



    render() {
        const data = this.props.location.query;
        if(!data) return <Redirect to='/product'/>;
        const {desc, name, price, imgs, detail} = data;
        const title = <span style={{fontsize: 20}}>
            <Button type = 'link' onClick={this.props.history.goBack}>
                <ArrowLeftOutlined />
            </Button>
            Product Details
        </span>
        console.log("Product detail: ")
        console.log(data);

        console.log("imgs:");
        console.log(imgs)

        let imgsTag;
        if(imgs && imgs.length >= 1)
            imgsTag = (<div>
            {
                imgs.map(imgOne => {
                    console.log("imgOne(): ");
                    console.log(imgOne);
                    return <img src = {'/upload/'+imgOne}  alt = 'img' key = {imgOne} style = {{border:'1px solid grey', height: 160, margin: '20px 20px 15px 15px'}} />;
                })
            }
        </div>);
        else
            imgsTag = <div></div>
        console.log("imgsTag: ");
        console.log(imgsTag);

        const {categoryName, pCategoryName} = this.state;

        let categoryTag;
        if(pCategoryName) {
            categoryTag = <span>
                <span>{pCategoryName}&nbsp;&nbsp;<ArrowRightOutlined />&nbsp;&nbsp;</span>
                <span>{categoryName}</span>
            </span>
        } else
            categoryTag = <span>{categoryName}</span>
        return (
            <Card title = {title} className='product-detail'>
                <List
                    bordered
                >
                    <Item>
                        <span className='list-item'>
                            <span className='left-col'>Product Name:</span>
                            <span className='right-col'>{name}</span>
                        </span>
                    </Item>
                    <Item>
                        <span className='list-item'>
                            <span className='left-col'>Product Desc:</span>
                            <span className='right-col'>{desc}</span>
                        </span>
                    </Item>
                    <Item>
                        <span className='list-item'>
                            <span className='left-col'>Product Price:</span>
                            <span className='right-col'>${price}</span>
                        </span>
                    </Item>
                    <Item>
                        <span className='list-item'>
                            <span className='left-col'>Category Name:</span>
                            <span className='right-col'>{categoryTag}</span>
                        </span>
                    </Item>
                    <Item>
                        <span className='list-item'>
                            <span className='left-col'>Product Pictures:</span>
                            <span className='right-col'>{imgsTag}</span>
                        </span>
                    </Item>
                    <Item>
                        <span className='list-item'>
                            <span className='left-col'>Product Detail:</span>
                            <span className='right-col'  dangerouslySetInnerHTML={{__html: detail}}></span>
                        </span>
                    </Item>
                </List>
            </Card>

        )
    }
}