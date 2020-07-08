/*
    gate file for the project
 */

import React from 'react'
import ReactDOM  from 'react-dom'
import 'antd/dist/antd.css'
import App from './App'
import storageUtils from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";
//render App components into index.html in div 'root'

//read userInfo in localstorage
const user = storageUtils.getUser()
memoryUtils.user = user
ReactDOM.render(<App />, document.getElementById("root"))