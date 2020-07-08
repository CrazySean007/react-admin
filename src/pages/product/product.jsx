import React, {Component} from 'react'
import ProductAddUpdate from "./add-update";
import ProductDetail from "./detail";
import ProductHome from "./home";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import './product.less'
export default class Product extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route path='/product/addupdate' component={ProductAddUpdate}/>
                        <Route path='/product/detail' component={ProductDetail}/>
                        <Route path='/product' component={ProductHome} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}