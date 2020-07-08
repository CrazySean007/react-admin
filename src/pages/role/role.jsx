import React, {Component} from 'react'
import Role from "./home";
import {BrowserRouter, Route, Switch} from "react-router-dom";
export default class Product extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route path='/role' component={Role}/>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}