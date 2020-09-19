import { lazy } from 'react';

const StackBarChart = lazy(() => import('./stack-bar-chart.jsx'));
const StackAreaChartOne = lazy(() => import('./stack-area-chart-one.jsx'));
const StackAreaChartTwo = lazy(() => import('./stack-area-chart-two.jsx'));
const LineChart = lazy(() => import('./line-chart.jsx'));

export { LineChart, StackBarChart, StackAreaChartOne, StackAreaChartTwo };