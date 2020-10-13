import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


import { userActions, settingAction } from '../_actions';

class LoginPage extends Component {
    constructor(props) {
        super();
        props.logout(props.changeStatus);
        this.state = {
            username: '',
            password: '',
            submitted: false,
            errorMsg: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        if(navigator.credentials) {
            navigator.credentials.get({password: true})
                    .then(cred => {
                        if(cred.id && cred.password) {
                            this.login(cred.id, cred.password);
                        }
                    })
                    .catch(err => console.log(err.message));
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { username, password } = this.state;
        if (username && password) {
            this.login(username, password)
                .then(() => {
                    const cred = new PasswordCredential({
                        id: username,
                        name: username,
                        password,
                        type: "password"
                    });
                    navigator.credentials.store(cred);
                })
                .catch((error) => this.setState({ errorMsg: error }));
        }
    }

    login(username, password) {
        return this.props.login(username, password)
            .then(() => {
                this.props.changeStatus();
                this.props.loadSettings();
                this.props.history.push('/');
            });
    }

    render() {
        const { loggingIn } = this.props;
        const { username, password, submitted } = this.state;
        if(this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }
        const messageStyle = {
            padding: "2px 14px",
            "border-radius": "5px",
            margin: "2px 0px"
        };
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Login</h2>
                {(() => {
                    if(this.state.errorMsg) {
                        return <div style={{ borderRadius: '6px', padding: '2px 8px' }} className="alert-danger">
                            {this.state.errorMsg}
                        </div>
                    }
                })()}
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                            <div className="alert-danger" style={messageStyle}>Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="alert-danger" style={messageStyle}>Password is required</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Login</button>
                        {loggingIn &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        {/* <Link to="/register" className="btn btn-link">Register</Link> */}
                    </div>
                </form>
            </div>
        );
    }
}

function mapState(state) {
    const { loggingIn } = state.authentication;
    return { loggingIn };
}

const actionCreators = {
    login: userActions.login,
    logout: userActions.logout,
    loadSettings: settingAction.getTarget
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginPage);
export default connectedLoginPage;