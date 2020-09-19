import React, { Component } from 'react';
import * as d3 from "d3";
import config from 'config';

import './chart.scss'

export default class StackBarChart extends Component {
    constructor() {
        super();
        this.barChart = React.createRef();
        this.colors = ["#28a745", "#b33040"];
        this.labels = ["passed", "failed"];
        this.subGraph = this.subGraph.bind(this);
    }

    getData(path) {
        return new Promise((res) => d3.json(path).then(data => res(data)));
    }

    async createGraph(margin, data, subGraph = false) {
        let { h, w } = this.props;
        let width = w - margin.left - margin.right;
        let height = h - margin.top - margin.bottom;
        let formatDate = subGraph ? d3.timeFormat("%d-%m-%Y") : d3.timeFormat("%m-%Y");
        let parseDate = subGraph ? d3.timeParse("%d-%m-%Y") : d3.timeParse("%m-%Y");
        data.sort((a, b) => parseDate(a.dated) - parseDate(b.dated)); 
        // Transpose the data into layers
        let scaleOrdinal = d3.scaleOrdinal().range(this.colors).domain(this.labels);
        let dataset = d3.stack().keys(this.labels)(data);
        
        d3.select(this.barChart.current).select("svg").remove()
        let svg = d3.select(this.barChart.current)
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

        // Add X axis
        let x = d3.scaleBand()
            .domain(data.map(d => parseDate(d.dated)))
            .rangeRound([ 0, width ])
            .padding(0.1);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(data.length).tickFormat(formatDate));

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", (width / 2))
            .attr("y", height + 30)
            .text("Dates");

        // Add Y axis
        let y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.total)])
            .range([ height, 0 ]);

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).ticks(5));

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 30)
            .attr("x", -(height / 2) + 50)
            .text("Number of Testcases");
        
        // Create groups for each series, rects for each segment 
        svg.selectAll("g.cases")
            .data(dataset)
            .enter().append("g")
            .attr("class", "cases")
            .style("fill", (d) => scaleOrdinal(d.key))
            .selectAll("rect")
            .data((d) => d)
            .join("rect")
            .attr("x", (d) => {return x(parseDate(d.data.dated));})
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .on("mousemove", function(d) {
                let values = d.data;		
                div.transition()		
                    .style("opacity", .9);		
                div	.html(`<span class="grid-container"><label class="grid-item">Target:</label><span class="grid-item">${values.total}</span></span>
                            <span class="grid-container"><label class="grid-item">Completed:</label><span class="grid-item">${values.failed + values.passed}</span></span>
                            <span class="grid-container"><label class="grid-item">Passed:</label><span class="grid-item">${values.passed}</span></span>
                            <span class="grid-container"><label class="grid-item">Failed:</label><span class="grid-item">${values.failed}</span></span>`)	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
            })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .style("opacity", 0);	
            })
            .on("click", (d) => {
                div.transition()		
                    .style("opacity", 0);
                this.subGraph(d);
            });
        
            
        // Draw legend
        let legend = svg.selectAll(".legend")
            .data(this.colors)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(30," + i * 19 + ")");
        
        legend.append("rect")
            .attr("x", width - margin.right * 3)
            .attr("width", 20)
            .attr("height", 3)
            .style("fill", (d) => d);
        
        legend.append("text")
            .attr("x", width - margin.right * 2)
            .attr("y", 0)
            .attr("dy", ".35em")
            .attr("fill", "black")
            .style("text-anchor", "start")
            .text((d, i) => this.labels[i].charAt(0).toUpperCase() + this.labels[i].slice(1));
        
        
        // Prep the tooltip bits, initial display is hidden
        let div = d3.select(this.barChart.current).append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
        
    }

    subGraph({ data }) {
        let datas = data.datas;
        if(datas) {
            let margin = {top: 30, right: 30, bottom: 30, left: 60};
            let data = datas.map(function(rec) { 
                let failed = rec['completed'] - rec['passed'];
                return {dated: rec['dated'], total: rec['total'], failed: (failed > 0 ? failed : 0), passed: rec['passed']};
            });
            this.createGraph(margin, data, true);
        } else {
            this.mainGraph();
        }
    }

    mainGraph() {
        let margin = {top: 30, right: 30, bottom: 30, left: 60};
        let data = this.actualData.map(function(rec) { return {datas: rec['datas'], dated: rec['dated'], total: rec['total'], failed: (rec['completed'] - rec['passed']), passed: rec['passed']}});
        this.createGraph(margin, data);
    }

    async componentDidMount() {
        this.title = this.props.title ? this.props.title : "STACKED BAR CHART";
        this.actualData = await this.getData(`${config.apiUrl}/testcases`);
        this.mainGraph();
    }

    render() {
        return (<div ref={this.barChart}></div>);
    }
}
