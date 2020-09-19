import React, { Component } from "react";
import { Link, BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import './app.sass';
import Home from '../home';
import SettingsPage from '../settings';
import LoginPage from '../login';
import { PrivateRoute } from "./PrivateRouter";

export default class App extends Component {
    constructor() {
        super();
        this.state = { status: localStorage.getItem('user') ? "Logout" : "Login" };
    }

    changeStatus() {
        this.setState({
            status: localStorage.getItem('user') ? "Logout" : "Login"
        });
    }

    render() {
        return (<Router>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/settings">Settings</Link>
                </li>
                <li style={{float: "right"}}>
                    <Link to="/login">{this.state.status}</Link>
                </li>
            </ul>
            <Switch>
                <Route exact path='/'>
                    <Home />
                </Route>
                <PrivateRoute exact path='/settings'  component={SettingsPage}/>
                <Route exact path='/login'  render={(props) => <LoginPage {...props} changeStatus={this.changeStatus.bind(this)}/>} />
                <Redirect from="*" to="/" />
            </Switch>
        </Router>)
    }
}