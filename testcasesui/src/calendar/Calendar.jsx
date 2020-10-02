import React, { Component } from "react";
import moment from 'moment';
import { connect } from 'react-redux';
import { settingAction, alertActions } from '../_actions';
import { Modal, Button } from 'react-bootstrap';
import './calendar.scss';

class Calendar extends Component {
    constructor(props) {
        super();
        this.countFields = [{
            key:'ui_smoke_count',
            label: 'UI Smoke Count'
        },{
            key:'ui_regression_count',
            label: 'UI Regression Count'
        }, {
            key:'headless_smoke_count',
            label: 'Headless Smoke Count'
        }, {
            key:'headless_regression_count',
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
        this.state = {
            dateContext: moment(),
            today: moment(),
            showMonthPopup: false,
            showYearPopup: false,
            selectedDay: null,
            calendarErrorMsg: ''
        }
        props.getCalendarDetails(this.months.indexOf(this.month()) + 1, this.year())
        .then(() => this.setState({calendarDetails: this.props.calendarDetails}));
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
            this.props.getCalendarDetails(this.months.indexOf(data) + 1, this.year())
                .then(() => this.setState({calendarDetails: this.props.calendarDetails}));
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
        this.props.getCalendarDetails(this.months.indexOf(this.month()) + 1, year)
            .then(() => this.setState({calendarDetails: this.props.calendarDetails}));
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
            })
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
        const { calendarDetails } = this.state;
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
            if(this.state.today.startOf("day").isBefore(selectedDate)) {
                this.setState({calendarErrorMsg: ''});
            } else {
                this.setState({calendarErrorMsg: 'Cannot set targets on this date.', selectedDate: undefined});
            }
        });
    }

    handleChange(event) {
        event.preventDefault();
        this.resetAlert();
        const { editContent } = this.state;
        let { name, value } = event.target;
        try {
            if(value !== '') {
                value = parseInt(value)
            }
            editContent[name] = value;
            this.setState({ editContent });
        } catch(e) {
            console.log("Only numbers are allowed.");
        }
    }

    outputValues(target) {
        if(target.key === 'targeted_test_case') {
            return(
                <span>
                    <input type="text" className="form-control" name={target.key} value={target.value} onChange={ this.handleChange.bind(this) } />
                </span>
            );
        } else {
            return(
                <span style={{marginLeft: '10px'}}><label>{target.value}</label></span>
            );
        }
    }

    populateTarget() {
        const targets = this.props.settings;
        if(targets) {
            const leftCol = {width: '50%', position: 'absolute'};
            const rightCol = {width: '50%', position: 'inherit', marginLeft: '125px'};
            return targets.map((target, i) => {
                const key = target.key + "_1";
                return (
                <div key={key} style={ ((i % 2 == 0) ? leftCol : rightCol) }>
                    <label style={{display: 'block', background: 'chartreuse', borderRadius: '5px', width: 'max-content'}}>{target.label}</label>
                    { ((target) => <span style={{marginLeft: '10px'}}>{ target.value }</span>)(target) }
                </div>);
            });
        }
        return '';
    }

    populateCount() {
        const { editContent } = this.state;  
        const value = (field) => editContent[field.key] ? editContent[field.key] : '';
        return this.countFields.map(field => (
            <div key={field.key} className='form-group'>
                <label htmlFor={field.key}>{ field.label }</label>
                <span>
                    <input type="text" className="form-control" name={field.key} value={value(field)} onChange={ this.handleChange.bind(this) } />
                </span>
            </div>
        ));
   }

    handleSubmit(e) {
        e.preventDefault();
        const { calendarDetails } = this.props;
        const { selectedDate, editContent } = this.state;
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

    populateAlert() {
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
                        { this.populateAlert() }
                        { this.populateTarget() }
                        { this.populateCount() }
                        <div className="form-group">
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            );
        } else {
            return ('');
        }
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

        const { calendarDetails } = this.state;
        const today = this.state.today.format("Y-MM-DD");
        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            const month = this.months.indexOf(this.month()) + 1;
            const dateStr = `${this.year()}-${month > 9 ? month : '0' + month}-${d > 9 ? d : '0' + d}`;
            let className = (dateStr === today ? "day current-day": 
                             (calendarDetails && calendarDetails[dateStr]) ? "day value-day" : "day");
            let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
            daysInMonth.push(
                <td key={d} className={className + selectedClass} >
                    <span onClick={()=>{this.onDayClick(d)}}>{d}</span>
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
                    { (() => <b style={{color: 'red'}}>{this.state.calendarErrorMsg}</b>)() }
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
                    <Button variant="primary" onClick={() => this.setState({updateMsg: ''})}>Ok</Button>
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