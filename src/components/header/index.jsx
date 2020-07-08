import React, {Component} from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less'
import { Modal, Button } from 'antd';
import {withRouter} from 'react-router-dom'
import menuList from "../../config/menuList";
import {reqLocation, reqWeather} from "../../api";
import storageUtils from "../../utils/storageUtils";
// eslint-disable-next-line
import cloudy from '../../assets/weather-icon/cloudy.png'
// eslint-disable-next-line
import foggy from '../../assets/weather-icon/foggy.png'
// eslint-disable-next-line
import pcloudy from '../../assets/weather-icon/p-cloudy.png'
// eslint-disable-next-line
import rain from '../../assets/weather-icon/rain.png'
// eslint-disable-next-line
import sleet from '../../assets/weather-icon/sleet.png'
// eslint-disable-next-line
import snow from '../../assets/weather-icon/snow.png'
// eslint-disable-next-line
import sunny from '../../assets/weather-icon/sunny.png'
// eslint-disable-next-line
import windy from '../../assets/weather-icon/windy.png'
import {message} from "antd";
import memoryUtils from "../../utils/memoryUtils";
import {formatDate} from '../../utils/dateUtils'

const iconMap = {
    cloudy: cloudy,
    sunny: sunny,
    foggy: foggy,
    windy: windy,
    rain: rain,
    pcloudy: pcloudy,
    sleet: sleet,
    snow: snow
};
/*
    this file defines the navigation part on the left side
 */
class Header extends Component {

    getWeather() {
        let latitude = 0, longitude = 0;
        reqLocation().then(
            response => {
                latitude = response.latitude
                longitude = response.longitude
                //console.log(latitude + ' ' + longitude)
                return Promise.resolve({latitude, longitude})
            }
        ).catch(
            error => {
                message.error("get location failed! reason: " + error.message)
            }
        ).then(
            response => {
                const result = response
                reqWeather(result.latitude, result.longitude).then(
                    ddd => {
                        this.setState(ddd)
                        //console.log(this.state)
                    }
                )
            }
        ).catch(
            error =>  message.error("get weather failed! reason: " + error.message)
        )
    }

    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }

    getTitle = () => {
        const path = this.props.location.pathname;
        //console.log(path)
        let title
        menuList.forEach(item => {
            if(item.key === path)
                title = item.title
            else if(item.children) {
                const cItem = item.children.find(child => (child.key === path))
                if(cItem) title = cItem.title
            }
        })
        return title
    }

    logout = () => {
        Modal.confirm({
            content: 'Are you sure to log out?',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                memoryUtils.user = {};
                storageUtils.removeUser();
                this.props.history.replace('/login');
            }
        });
    }



    state = {
        weatherCondition: 'rainy',
        icon: 'rain',
        currentTime: formatDate(Date.now()),
    }

    componentDidMount() {
        //this.getWeather()
        this.getTime()
    };

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const title = this.getTitle()
        const username = memoryUtils.user.username
        const {weatherCondition, icon, currentTime} = this.state
        return (
            <div className="header">
                <div className="header-top">
                    <span>Hello, {username}!</span>
                    <Button type = 'link' onClick={this.logout}>log out</Button>
                </div>
                <div className="header-bottom">
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={iconMap[icon]} alt=""/>
                        <span>{weatherCondition}</span>
                    </div>
                </div>
            </div>
        )
    }


}

export default withRouter(Header)