import React, {Component} from 'react'
import {Layout} from "antd";
import memoryUtils from "../../utils/memoryUtils";
//import {message} from 'antd'
import {Redirect, Route, Switch} from 'react-router-dom'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from "../home/home";
import Category from "../category/category";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Pie from "../charts/Pie";
import Line from "../charts/line";
import Bar from "../charts/bar";
//management router component
export default class Admin extends Component {
    render() {
        const { Footer, Sider, Content } = Layout;
        const user = memoryUtils.user
        if(!user || !user._id) {
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin: 20, backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product} />
                            <Route path = '/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/bar' component={Bar} />
                            <Route path='/pie' component={Pie} />
                            <Route path='/line' component={Line} />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style = {{backgroundColor: 'white', textAlign: 'center', color: '#cccccc', height: 50}}>Google Chrome is recommended for better user experience</Footer>
                </Layout>
            </Layout>
        )
    }
}