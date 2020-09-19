import React, { Component } from 'react';
import * as d3 from "d3";

import './chart.scss'

export default class BarChart extends Component  {
    constructor() {
        super();
        this.areaChart = React.createRef();
    }

    getData(path) {
        return new Promise((res, rej) => d3.csv(path).then(data => res(data)));
    }

    async componentDidMount() {
        let margin = {top: 30, right: 30, bottom: 30, left: 60}
        let { h, w } = this.props;
        let width = w - margin.left - margin.right;
        let height = h - margin.top - margin.bottom;
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
            .text("STACKED AREA CHART ONE");

        //Read the data
        let data = await this.getData("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv")
        
        // group the data: one array for each value of the X axis.
        var sumstat = d3.nest()
        .key((d) => d.year)
        .entries(data);
    
        // Stack the data: each group will be represented on top of each other
        var mygroups = ["Helen", "Amanda", "Ashley", "Dorothy"] // list of group names
        var mygroup = [1, 2, 3, 4] // list of group names
        var stackedData = d3.stack()
        .keys(mygroup)
        .value((d, key) => d.values[key].n)
        (sumstat)
    
        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.year))
        .range([ 0, width ]);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));
    
        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => +d.n)*1.2])
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y));
    
        // color palette
        var color = d3.scaleOrdinal()
        .domain(mygroups)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
    
        // Show the areas
        svg
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
            .style("fill", (d) => { name = mygroups[d.key-1] ;  return color(name); })
            .attr("d", d3.area()
            .x((d) => x(d.data.key))
            .y0((d) => y(d[0]))
            .y1((d) => y(d[1]))
        );

    }

    render() {
        return (<div ref={this.areaChart}></div>);
    }

}