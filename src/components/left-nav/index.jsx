// eslint-disable-next-line
import React, {Component} from 'react'
import './index.less'
import logo from '../../assets/images/logo.png'
import {Link, withRouter} from 'react-router-dom'
import { Layout, Menu } from 'antd';
// eslint-disable-next-line
import {
    HomeOutlined,
    UnorderedListOutlined,
    AppstoreOutlined,
    ToolOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
    BarChartOutlined,
    PieChartOutlined,
    LineChartOutlined
} from '@ant-design/icons';
import menuList from '../../config/menuList'
import memoryUtils from "../../utils/memoryUtils";

const {Sider} = Layout;
const { SubMenu } = Menu;
const IconMap = {
    HomeOutlined: <HomeOutlined />,
    UnorderedListOutlined: <UnorderedListOutlined />,
    AppstoreOutlined: <AppstoreOutlined />,
    ToolOutlined: <ToolOutlined />,
    SafetyCertificateOutlined: <SafetyCertificateOutlined />,
    UserOutlined: <UserOutlined />,
    BarChartOutlined: <BarChartOutlined />,
    PieChartOutlined: <PieChartOutlined />,
    LineChartOutlined: <LineChartOutlined />
};
/*
    this file defines the navigation part on the left side
 */

class LeftNav extends Component {
    state = {
        collapsed: false,
    };



    hasAuth = (item) => {
        //1. if this user is admin, return true
        //2. if item is contained in the user menus, return true
        //3. else return false

        const key = item.key;
        const menus = memoryUtils.user.role.menus;
        const username = memoryUtils.user.username;
        if(username === 'admin' || menus.indexOf(key) !== -1)
            return true;
        else if(item.children ) {
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false;
    }

    getMenuList= menuList => {
        const path = this.props.location.pathname
        return menuList.map(
            item => {
                if(this.hasAuth(item)) {
                    if(!item.children) {
                        return (
                            <Menu.Item key={item.key} icon={ IconMap[item.icon] }>
                                <Link to={item.key}>{item.title}</Link>
                            </Menu.Item>
                        )
                    } else {
                        if(item.children.find(cItem => path.indexOf(cItem.key)===0)) {
                            this.openKey = item.key
                        }
                        return (
                            <SubMenu key={item.key} icon={ IconMap[item.icon] } title={item.title}>
                                {this.getMenuList(item.children)}
                            </SubMenu>
                        )
                    }
                }
                return true;
            }
        )
    }

    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuList(menuList)
    }
    render() {
        let selectKey = this.props.location.pathname
        const openKey = this.openKey
        if(selectKey.indexOf('/product') !== -1)
            selectKey = '/product';
        return (
            <div className="left-nav">
                <Link to="/home" className="left-nav-header">
                    <img src={logo} alt = ""/>
                    <h1 className="left-nav-title">backend</h1>
                </Link>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider>
                        <div className="logo" />
                        <Menu theme="dark" selectedKeys={[selectKey]} mode="inline" defaultOpenKeys={[openKey]}>
                            {
                                this.menuNodes
                            }
                        </Menu>
                    </Sider>
                </Layout>
            </div>
        )
    }
}
export default withRouter(LeftNav)