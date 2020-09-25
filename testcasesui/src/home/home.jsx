import React, { Component, Suspense } from 'react';
import { StackBarChart, LineChart } from '../charts';
import { chartService } from '../_services';

export default class Home extends Component {
    render() {
        return (
            <Suspense fallback={<div className='loader'></div>}>
                {/* <StackBarChart w='800' h='400' title='TESTCASES - ACTUAL vs COMPLETED'/> */}
                <LineChart w='1080' h='400' title='UI Smoke Suite - Target vs Completed'/>
                {/* <StackAreaChartOne w='600' h='400'></StackAreaChartOne> */}
                {/* <StackAreaChartTwo w='600' h='400'></StackAreaChartTwo> */}
            </Suspense>
        );
    }
}
