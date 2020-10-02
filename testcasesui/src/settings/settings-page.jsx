import React, { Component } from "react";
import { settingAction } from '../_actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Calender from '../calendar';

import './settings.scss';

class SettingsPage extends Component {
    constructor(props) {
        super();
        this.oldValues = {};
        if(props.settings) {
            props.settings.reduce((result, item) => {
                result[item.key] = item.value;
                return result;
            }, this.oldValues);
        }

        if(props.settings && props.settings.length > 0) {
            this.state = {
                submitted: false,
                settings: props.settings
            };
        } else {
            this.state = { redirect: "/login" };
        }
    }
    
    handleChange(event) {
        event.preventDefault();
        const { name, value } = event.target;
        const { settings } = this.state;
        for(let setting of settings) {
            if(setting.key === name)
                setting.value = value;
        }
        this.setState({
            settings: [
                ...settings
            ]
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const settings = this.state.settings ?  this.state.settings : this.props.settings;
        if (settings) {
            let promises = [], index = 0;
            for(let setting of settings) {
                if(setting.value !== this.oldValues[setting.key]) 
                    promises.push(this.props.update(setting.key, setting.value));
                ++index;
            }
            Promise.all(promises).then(() => this.props.history.push('/'));
        }

    }

    populateSettings() {
        const { settings, submitted } = this.state;
        if(!settings) {
            return '';
        } else {
            return settings.map(setting => {
                return (<div key={setting.key} className={'form-group' + (submitted && !setting.key ? ' has-error' : '')}>
                    <label htmlFor={setting.key}>{setting.label}</label>
                    <input type="text" className="form-control" name={setting.key} value={setting.value} onChange={ this.handleChange.bind(this) } />
                    {submitted && !setting.key &&
                        <div className="help-block">{setting.label} is required field.</div>}
                </div>)
            });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return(
                <Calender></Calender>
                // <div>
                //     <h2>Settings</h2>
                //     <form name="settings" onSubmit={ this.handleSubmit.bind(this) }>
                //         {this.populateSettings()}
                //         <div className="form-group">
                //             <button className="btn btn-primary">Update</button>
                //         </div>
                //     </form>
                // </div>
        )
    }
}

function mapState(state) {
    const { settings } = state.settings;
    return { settings };
}

const actionCreators = {};

const connectedSettingsPage = connect(mapState, actionCreators)(SettingsPage);
export default connectedSettingsPage;