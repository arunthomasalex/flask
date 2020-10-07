import React, { Component } from "react";
import moment from 'moment';
import { connect } from 'react-redux';
import { settingAction, alertActions } from '../_actions';
import { Modal, Button } from 'react-bootstrap';
import { Target } from './components';
import './calendar.scss';

class Calendar extends Component {
    constructor(props) {
        super();
        this.countFields = [{
            key:'ui_smoke',
            label: 'UI Smoke Count'
        },{
            key:'ui_regression',
            label: 'UI Regression Count'
        }, {
            key:'headless_smoke',
            label: 'Headless Smoke Count'
        }, {
            key:'headless_regression',
            label: 'Headless Regression Count'
        }]
        this.oldValues = undefined;
        this.style = props.style || {};
        this.weekdays = moment.weekdays(); //["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"]
        this.weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        this.months = moment.months();
        this.year = this.year.bind(this);
        this.month = this.month.bind(this);
        this.daysInMonth = this.daysInMonth.bind(this);
        this.currentDate = this.currentDate.bind(this);
        this.currentDay = this.currentDay.bind(this);
        this.firstDayOfMonth = this.firstDayOfMonth.bind(this);
        this.setMonth = this.setMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.SelectList = this.SelectList.bind(this);
        this.onChangeMonth = this.onChangeMonth.bind(this);
        this.MonthNav = this.MonthNav.bind(this);
        this.showYearEditor = this.showYearEditor.bind(this);
        this.setYear = this.setYear.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.onKeyUpYear = this.onKeyUpYear.bind(this);
        this.YearNav = this.YearNav.bind(this);
        this.onDayClick = this.onDayClick.bind(this);
        this.EditableSection = this.EditableSection.bind(this);
        this.Alert = this.Alert.bind(this);
        this.Edit = this.Edit.bind(this);
        this.label = this.label.bind(this);
        this.state = {
            dateContext: moment(),
            today: moment(),
            showMonthPopup: false,
            showYearPopup: false,
            selectedDay: null,
            calendarErrorMsg: ''
        }
        props.getCalendarDetails(this.months.indexOf(this.month()) + 1, this.year());
    }

    year() {
        return this.state.dateContext.format("Y");
    }
    month() {
        return this.state.dateContext.format("MMMM");
    }
    daysInMonth() {
        return this.state.dateContext.daysInMonth();
    }
    currentDate() {
        return this.state.dateContext.get("date");
    }
    currentDay() {
        return this.state.dateContext.format("D");
    }

    firstDayOfMonth() {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d'); // Day of week 0...1..5...6
        return firstDay;
    }

    setMonth(month) {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    }

    nextMonth() {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    prevMonth() {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }

    onSelectChange(e, data) {
        this.resetAlert();
        if(this.year() < this.state.today.year() || (this.year() == this.state.today.year() && this.months.indexOf(data) < this.state.today.month())) {
            this.setState({calendarErrorMsg: 'Cannot navigate to a past month.'});
        } else {
            this.props.getCalendarDetails(this.months.indexOf(data) + 1, this.year());
            this.setState({calendarErrorMsg: ''});
            this.setMonth(data);
            this.props.onMonthChange && this.props.onMonthChange();
        }

    }
    SelectList(props) {
        let popup = props.data.map((data) => {
            return (
                <div key={data}>
                    <a href="#" onClick={(e)=> {this.onSelectChange(e, data)}}>
                        {data}
                    </a>
                </div>
            );
        });
        return (
            <div className="month-popup">
                {popup}
            </div>
        );
    }

    onChangeMonth(e) {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    MonthNav() {
        return (
            <span className="label-month"
                onClick={(e)=> {this.onChangeMonth(e)}}>
                {this.month()}
                {this.state.showMonthPopup &&
                 <this.SelectList data={this.months} />
                }
            </span>
        );
    }

    showYearEditor() {
        this.setState({
            showYearNav: true
        });
    }

    setYear(year) {
        this.props.getCalendarDetails(this.months.indexOf(this.month()) + 1, year);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext
        })
    }
    onYearChange(e) {
        this.resetAlert();
        this.setYear(e.target.value);
        this.props.onYearChange && this.props.onYearChange(e, e.target.value);
    }

    onKeyUpYear(e) {
        if (e.which === 13 || e.which === 27) {
            this.setYear(e.target.value);
            this.setState({
                showYearNav: false
            });
        }
    }

    YearNav() {
        return (
            this.state.showYearNav ?
            <input
                defaultValue = {this.year()}
                className="editor-year"
                ref={(yearInput) => { this.yearInput = yearInput}}
                onKeyUp= {(e) => this.onKeyUpYear(e)}
                onChange = {(e) => this.onYearChange(e)}
                onPointerOut = {(e) => this.setState({showYearNav: false})}
                type="number"
                placeholder="year"/>
            :
            <span
                className="label-year"
                onDoubleClick={(e)=> { this.showYearEditor()}}>
                {this.year()}
            </span>
        );
    }

    onDayClick(day) {
        this.props.clearAlerts();
        const { calendarDetails } = this.props;
        const month = this.months.indexOf(this.month()) + 1;
        const selectedDate = `${this.year()}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`;
        this.oldValues = (calendarDetails && calendarDetails[selectedDate]) ? 
                            calendarDetails[selectedDate]
                                .reduce((obj, item) => ({...obj, [item.name]: item.value}), {}) : 
                            {};
        this.setState({
            alerts: [],
            selectedDay: day,
            selectedDate: selectedDate,
            editContent: {...this.oldValues}
        }, () => {
            if(this.state.today.startOf("day").isSameOrBefore(selectedDate) || calendarDetails[selectedDate]) {
                this.setState({calendarErrorMsg: ''});
            } else {
                this.setState({calendarErrorMsg: 'Cannot set targets on this date.', selectedDate: undefined});
            }
        });
    }

    handleChange(event) {
        event.preventDefault();
        const { selectedDate, editContent } = this.state;
        let { name, value } = event.target;
        try {
            if(this.state.today.startOf("day").isBefore(selectedDate)) {
                this.resetAlert();
                if(value !== '') {
                    value = parseInt(value)
                }
                editContent[name] = value;
                this.setState({ editContent });
            } else {
                event.target.value = editContent[name];
                this.setState({ alerts: [{
                        type: "alert-danger",
                        message: "Cannot change the data on this date."
                    }]
                });
            }
        } catch(e) {
            console.log("Only numbers are allowed.");
        }
    }

    label(val) {
        return (val.split('_').map(l => (l.charAt(0).toUpperCase() + l.slice(1))).join(' ')  + " Count");
    }

    Edit() {
        const { editContent } = this.state;  
        const targets = this.props.settings
        const value = (field) => editContent[field.key] ? editContent[field.key] : '';
        return targets.map(field => (
            <div key={field.key} className='fields-group'>
                <label htmlFor={field.key}>{ this.label(field.key) }</label>
                <span>
                    <input type="text" className="form-control" name={field.key} value={value(field)} onChange={ this.handleChange.bind(this) } />
                </span>
            </div>
        ));
    }

    submit() {
        const { calendarDetails } = this.props;
        const { selectedDate, editContent } = this.state;
        if(this.state.today.startOf("day").isBefore(selectedDate)) {
            const newValues = Object.entries(editContent)
                                    .filter(([key, value]) => !this.oldValues[key] && value)
                                    .map(([key, value]) => {
                                        return {
                                            'name': key, 
                                            'value': value
                                        }
                                    });
            const updateValues = Object.entries(editContent)
                                    .filter(([key, value]) => this.oldValues[key] && (this.oldValues[key] !== value))
                                    .map(([key, value]) => { 
                                        return {
                                            'id': calendarDetails[selectedDate].find(({name}) => name === key).id, 
                                            'name': key, 
                                            'value': value
                                        };
                                    });
            if(newValues && newValues.length > 0) {
                this.props.addCalendarDetails(selectedDate, newValues)
                    .then(() => this.addAlert());
            }
            if(updateValues && updateValues.length > 0) {
                this.props.updateCalendarDetails(updateValues)
                    .then(() => this.addAlert());
            }
            this.oldValues = { ...this.oldValues, ...editContent };
        } else {
            this.setState({ alerts: [{
                    type: "alert-danger",
                    message: "Cannot submit the data on this date."
                }]
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({updateMsg: "Are you sure that you want to submit?"});
    }

    addAlert() {
        if(this.props.alert) {
            this.setState({ alerts: this.props.alert });
        }
    }

    resetAlert() {
        this.props.clearAlerts()
        this.setState({alerts: []});
    }

    Alert() {
        const { alerts } = this.state;
        let alertMsg = ''
        if(alerts) {
            alertMsg = alerts.map((alert, index) => {
                return (
                    <div key={index} className={ alert.type + " alert-msg" }>
                        { alert.message }
                    </div>
                )
            });
        }
        return (
            <div className='alert-div'>
                { alertMsg }
            </div>
        )
    }

    EditableSection() {
        const { selectedDate } = this.state;
        const targets = this.props.settings
        if(targets && selectedDate) {
            return (
                <div className="col-md-6 col-md-offset-3">
                    <h3>Targets</h3>
                    <form name="settings" onSubmit={ this.handleSubmit.bind(this) }>
                        <this.Alert/>
                        <Target targets={this.props.settings}/>
                        <this.Edit/>
                        <div className="form-group" style={{marginTop: "1rem"}}>
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            );
        }
        return ('');
    }

    render() {
        // Map the weekdays i.e Sun, Mon, Tue etc as <td>
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });

        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">{""}</td>);
        }

        const { calendarDetails } = this.props;
        const today = this.state.today.format("Y-MM-DD");
        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            const month = this.months.indexOf(this.month()) + 1;
            const dateStr = `${this.year()}-${month > 9 ? month : '0' + month}-${d > 9 ? d : '0' + d}`;
            let className = (dateStr === today ? "day current-day": 
                             (calendarDetails && calendarDetails[dateStr]) ? "day value-day" : "day");
            let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
            daysInMonth.push(
                <td key={d} className={className + selectedClass} onClick={()=>{this.onDayClick(d)}}>
                    {d}
                </td>
            );
        }

        const totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];
        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i*100}>
                    {d}
                </tr>
            );
        })

        const show = this.state.updateMsg;
        return (
            <div className="grid-container">
                <div className='grid-item'>
                    { (() => {
                        return this.state.calendarErrorMsg &&
                         <span className="alert-danger" style={{borderRadius: "4px", padding: "6px"}}>{this.state.calendarErrorMsg}</span>;
                    })()}
                    <table className="calendar">
                        <thead>
                            <tr className="calendar-header">
                                <td colSpan="5">
                                    <this.MonthNav />
                                    {" "}
                                    <this.YearNav />
                                </td>
                                <td colSpan="2" className="nav-month">
                                    <i className="prev fa fa-fw fa-chevron-left"
                                        onClick={(e)=> {this.prevMonth()}}>
                                    </i>
                                    <i className="prev fa fa-fw fa-chevron-right"
                                        onClick={(e)=> {this.nextMonth()}}>
                                    </i>

                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {weekdays}
                            </tr>
                            {trElems}
                        </tbody>
                    </table>
                </div>
                <div className='grid-item'>
                    <this.EditableSection />
                </div>
                <Modal
                    show={!!show}
                    onHide={() => this.setState({updateMsg: ''})}
                    backdrop="static"
                    keyboard={false}>
                    <Modal.Header closeButton>
                    <Modal.Title>Message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {show}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        this.setState({updateMsg: ''});
                        this.submit();
                    }}>Ok</Button>
                    <Button variant="primary" onClick={() => this.setState({updateMsg: ''})}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>

        );
    }
}

function mapState(state) {
    const { settings, calendarDetails } = state.settings;
    const { alert } = state;
    return { settings, calendarDetails, alert };
}

const actionCreators = {
    getCalendarDetails: settingAction.getCalendarDetails,
    addCalendarDetails: settingAction.addCalendarDetails,
    updateCalendarDetails: settingAction.updateCalendarDetails,
    clearAlerts: alertActions.clear

};

const connectedCalendar = connect(mapState, actionCreators)(Calendar);
export default connectedCalendar;