import React, { Component } from 'react';
import * as d3 from "d3";

import './chart.scss'

export default class BarChart extends Component  {
    constructor() {
        super();
        this.areaChart = React.createRef();
        this.colors = ["#e41a1c","#377eb8","#4daf4a"];
        this.labels = ["failed", "passed", "completed", ];
        this.subGraph = this.subGraph.bind(this);
    }

    getData(path) {
        return new Promise((res, rej) => d3.csv(path).then(data => res(data)));
    }

    getJsonData(path) {
        return new Promise((res) => d3.json(path).then(data => res(data)));
    }

    createGraph(margin, data, subGraph = false) {
        let { h, w } = this.props;
        let width = w - margin.left - margin.right;
        let height = h - margin.top - margin.bottom;
        let formatDate = subGraph ? d3.timeFormat("%d-%m-%Y") : d3.timeFormat("%m-%Y");
        let parseDate = subGraph ? d3.timeParse("%d-%m-%Y") : d3.timeParse("%m-%Y");
        data.sort((a, b) => parseDate(a.dated) - parseDate(b.dated)); 
        let svg = d3.select(this.areaChart.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text(this.title);

        //Read the data
        // Add X axis
        var x = d3.scaleLinear()
            .domain(d3.extent(data, (d) => parseDate(d.dated)))
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(data.length).tickFormat(formatDate));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.total)])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // color palette
        var color = d3.scaleOrdinal()
            .domain(this.labels)
            .range(this.colors)

        //stack the data?
        var stackedData = d3.stack()
            .keys(this.labels)
            (data)

        // Show the areas
        svg
            .selectAll("mylayers")
            .data(stackedData)
            .enter()
            .append("path")
            .style("fill", (d) => { console.log(d); return color(d.key); })
            .attr("d", d3.area()
                .x(function(d, i) { return x(parseDate(d.data.dated)); })
                .y0(function(d) { return y(d[0]); })
                .y1(function(d) { return y(d[1]); })
            );
    }

    subGraph() {

    }

    mainGraph() {
        let margin = {top: 30, right: 30, bottom: 30, left: 60}
        let data = this.actualData.map(function(rec) { return {
            datas: rec['datas'], 
            dated: rec['dated'], 
            total: rec['total'],
            completed: rec['completed'],
            failed: (rec['completed'] - rec['passed']), 
            passed: rec['passed']
        }});
        this.createGraph(margin, data);
    }

    async componentDidMount() {
        this.title = this.props.title ? this.props.title : "STACKED AREA CHART";
        this.actualData = await this.getJsonData("http://localhost:5000/api/v1/testcases");
        this.mainGraph();
    }

    render() {
        return (<div ref={this.areaChart}></div>);
    }

}