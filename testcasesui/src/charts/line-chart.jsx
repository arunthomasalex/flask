import React, { Component } from "react";
import { connect } from 'react-redux';
import * as d3 from "d3";

import config from 'config';

import './chart.scss';

class LineChart extends Component {
    constructor(props) {
        super(); 
        this.lineChart = React.createRef();
        this.state = {
            type: props.app_type
        };
        this.lineAttributes =[
            {
                label: "passed",
                color: "#28a745"
            }, {
                label: "failed",
                color: "#b33040"
            }, {
                label: "completed",
                color: "#34baeb"
            }, {
                label: "target",
                color: "#060708"
            }
        ];
        this.subGraph = this.subGraph.bind(this);
        this.yearChange = this.yearChange.bind(this);
        this.suiteChange = this.suiteChange.bind(this);
    }

    async componentDidMount() {
        this.title = this.props.title ? this.props.title : "LINE CHART";
        this.actualData = await d3.json(`${config.apiUrl}/testcases?type=${this.props.app_type}`);
        this.mainGraph();
    }

    subGraph(data) {
        data = this.actualData.filter(d => d.dated === data.date);
        if(data && data.length > 0) {
            data = data[0];
            let margin = {top: 30, right: 70, bottom: 30, left: 60};
            data = data.datas.map(function(rec) { 
                const failed = rec['completed'] - rec['passed'];
                return {dated: rec['dated'], target: rec['target'], completed: rec['completed'], failed: (failed > 0 ? failed : 0), passed: rec['passed']};
            });
            this.createGraph(margin, data, true);
        } else {
            this.mainGraph();
        }
    }

    mainGraph() {
        let margin = {top: 30, right: 70, bottom: 50, left: 60};
        let data = this.actualData.map(function(rec) { return {datas: rec['datas'], dated: rec['dated'], target: rec['target'], completed: rec['completed'], failed: (rec['completed'] - rec['passed']), passed: rec['passed']}});
        this.createGraph(margin, data);
    }

    async createGraph(margin, data, subGraph = false) {
        let { h, w } = this.props;
        let width = w - margin.left - margin.right;
        let height = h - margin.top - margin.bottom;
        let formatDate = subGraph ? d3.timeFormat("%d-%m-%Y") : d3.timeFormat("%m-%Y");
        let parseDate = subGraph ? d3.timeParse("%d-%m-%Y") : d3.timeParse("%m-%Y");
        data.sort((a, b) => parseDate(a.dated) - parseDate(b.dated)); 

        d3.select(this.lineChart.current).select('svg').remove();
        let svg = d3.select(this.lineChart.current)
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
            .text(`${this.title} (${subGraph ? "Monthly" : "Summary"})`);

        const dataset = this.lineAttributes.map(attr => {
            return {
                "id": attr.label,
                "color": attr.color,
                "values": data.map(d => {
                    return {
                        date: parseDate(d.dated),
                        value: d[attr.label],
                        label: attr.label.charAt(0).toUpperCase() + attr.label.slice(1)
                    }
                })
            };
        });

        // Add X axis
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => parseDate(d.dated)))
            .range([ 0, width ]);

        const dateDisplay = d3.timeFormat(subGraph ? "%d %b": "%b %Y");
        const xAxis = d3.axisBottom().ticks(data.length).tickFormat(dateDisplay).scale(x);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start");
        
        svg.append("text")
            .attr("text-anchor", "end")
            .style("font-weight", "700")
            .attr("x", (width / 2))
            .attr("y", height + 20)
            .text(subGraph ? "Days" : "Months");

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => d.target)])
            .range([ height, 0 ]);

        const yAxis = d3.axisLeft(y).ticks(5);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        svg.append("text")
            .attr("text-anchor", "end")
            .style("font-weight", "700")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 30)
            .attr("x", -(height / 2) + 50)
            .text("# of Testcases");
        
        const drawLine = d3.line().x((d) => x(d.date)).y((d) => y(d.value));

        const line = svg.selectAll("g.lines")
            .data(dataset)
            .enter();
            
        line.append("path")
            .attr("fill", "none")
            .attr("stroke", (d) => d.color)
            .attr("stroke-width", 1.9)
            .attr("d", (d) => {
                return drawLine(d.values);
            })
        
        line.append("text")
            .attr("class","serie_label")
            .attr("stroke", (d) => (d.values[d.values.length - 1]) ? d.color : '#FFFFFF')
            .datum((d) => {
                console.log(d)
                return {
                    id: d.id,
                    value: d.values[d.values.length - 1]
                }; 
            })
            .attr("transform", (d) => {
                try {
                    return "translate(" + (x(d.value.date)) + "," + (y(d.value.value)) + ")";
                } catch(e) { }                
            })
            .attr("x", 5)
            .style("font-family", "monospace")
            .style("text-anchor", "start")
            .style("font-size", "12px")
            .text((d) => d.id.charAt(0).toUpperCase() + d.id.slice(1));

        svg.selectAll("myDots")
            .data(dataset)
            .enter()
            .append('g')
            .style("fill", (d) => d.color)
            .attr("class", (d) => d.id)
            .selectAll("myPoints")
            .data((d) => d.values)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(d.date))
            .attr("cy", (d) => y(d.value))
            .attr("r", 5)
            .attr("stroke", "white")
            .on("mousemove", function(d) {
                div.transition()		
                    .style("opacity", .9);		
                div	.html(`<span class="grid-container"><span class="grid-item">${d.label}:</span><span class="grid-item">${d.value}</span>
                           <span class="grid-item">Dated:</span><span class="grid-item">${formatDate(d.date)}</span>
                           <span class="grid-row">Click here to ${subGraph ? "go back" : "drill down"}</span></span>`)	
                    .style("left", (d3.event.pageX - 50) + "px")		
                    .style("top", (d3.event.pageY - 45) + "px");	
            })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .style("opacity", 0);	
            })
            .on("click", (d) => {
                div.transition()		
                    .style("opacity", 0);
                this.subGraph({...d, date: formatDate(d.date)});
            });

        // Prep the tooltip bits, initial display is hidden
        let div = d3.select(this.lineChart.current).append("div")	
            .attr("class", "line_tooltip")				
            .style("opacity", 0);
    }

    createCritera(param) {
        let params = { ...this.state, ...param };
        let criteria = Object.entries(params).filter((entry) => entry[1] != null).map(([key, value]) => `${key}=${value}`).join('&')
        return criteria;
    }

    async yearChange(event) {
        event.preventDefault();
        let newParam = null;
        if(event.target.value === 'Default') {
            newParam = { year: null };
        } else {
            newParam = { year: event.target.value };
        }
        this.actualData = await d3.json(`${config.apiUrl}/testcases?${this.createCritera(newParam)}`);
        this.setState(newParam);
        this.mainGraph();
    }

    async suiteChange(event) {
        event.preventDefault();
        let newParam = null;
        if(event.target.value === '') {
            newParam = { suite: null };
        } else {
            newParam = { suite: event.target.value };
        }
        this.actualData = await d3.json(`${config.apiUrl}/testcases?${this.createCritera(newParam)}`);
        this.setState(newParam);
        this.mainGraph();
    }

    render() {
        const yearOption = this.props.years ? this.props.years.map(year => <option key={year} value={year}>{year}</option>) : (<option>Default</option>);
        const suiteOption = this.props.suites ? this.props.suites.map(suite => <option key={suite} value={suite}>{suite}</option>) : (<option></option>);
        return (
            <div className="chart">
                <select className="dropdown" onChange={this.yearChange}>
                    { yearOption }
                </select>
                <select className="dropdown" onChange={this.suiteChange}>
                    { suiteOption }
                </select>
                <div ref={this.lineChart}></div>
            </div>
        );
       
        
    }
}

function mapState(state) {
    const { years, suites } = state.chart;
    return { years, suites };
}

const actionCreators = {};

const connectedLineChart = connect(mapState, actionCreators)(LineChart);
export default connectedLineChart;