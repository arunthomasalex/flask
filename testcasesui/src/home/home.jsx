import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { chartAction } from '../_actions';
import { StackBarChart, LineChart } from '../charts';

class Home extends Component {
    constructor(props) {
        super();
        props.getYears();
        props.getSuites();
    }

    render() {
        return (
            <Suspense fallback={<div className='loader'></div>}>
                <LineChart w='1080' h='400' title='UI - Target vs Completed' app_type='ui'/>
                <LineChart w='1080' h='400' title='Headless - Target vs Completed' app_type='headless'/>
                {/* <StackBarChart w='800' h='400' title='TESTCASES - ACTUAL vs COMPLETED'/> */}
                {/* <StackAreaChartOne w='600' h='400'></StackAreaChartOne> */}
                {/* <StackAreaChartTwo w='600' h='400'></StackAreaChartTwo> */}
            </Suspense>
        );
    }
}

function mapState(state) {
    const { years } = state.chart;
    return { years };
}

const actionCreators = {
    getYears: chartAction.getYears,
    getSuites: chartAction.getSuites
};

const connectedHome = connect(mapState, actionCreators)(Home);
export default connectedHome;
