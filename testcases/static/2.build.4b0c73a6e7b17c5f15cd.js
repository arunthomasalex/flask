(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{155:function(t,e,a){"use strict";a.r(e);var r=a(5),n=a.n(r),s=a(92),i=a.n(s),o=a(93),c=a.n(o),l=a(13),p=a.n(l),u=a(14),d=a.n(u),f=a(22),h=a.n(f),g=a(15),m=a.n(g),y=a(16),x=a.n(y),b=a(11),v=a.n(b),w=a(0),k=a.n(w),O=a(20),D=a(94),C=a(12),j=a(9);a(85);function G(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,r)}return a}function A(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?G(Object(a),!0).forEach((function(e){n()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):G(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function P(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var a,r=v()(t);if(e){var n=v()(this).constructor;a=Reflect.construct(r,arguments,n)}else a=r.apply(this,arguments);return x()(this,a)}}var E=function(t){m()(s,t);var e,a,r,n=P(s);function s(t){var e;return p()(this,s),(e=n.call(this,t)).state={default:t.years[0]},t.get(),e.lineChart=k.a.createRef(),e.lineAttributes=[{label:"passed",color:"#28a745"},{label:"failed",color:"#b33040"},{label:"completed",color:"#34baeb"},{label:"target",color:"#060708"}],e.subGraph=e.subGraph.bind(h()(e)),e.yearChange=e.yearChange.bind(h()(e)),e}return d()(s,[{key:"componentDidMount",value:(r=c()(i.a.mark((function t(){return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.title=this.props.title?this.props.title:"LINE CHART",t.next=3,j.chartService.getTestcases();case 3:this.actualData=t.sent,this.mainGraph();case 5:case"end":return t.stop()}}),t,this)}))),function(){return r.apply(this,arguments)})},{key:"subGraph",value:function(t){if((t=this.actualData.filter((function(e){return e.dated===t.date})))&&t.length>0){t=(t=t[0]).datas.map((function(t){var e=t.completed-t.passed;return{dated:t.dated,target:t.target,completed:t.completed,failed:e>0?e:0,passed:t.passed}})),this.createGraph({top:30,right:70,bottom:30,left:60},t,!0)}else this.mainGraph()}},{key:"mainGraph",value:function(){var t=this.actualData.map((function(t){return{datas:t.datas,dated:t.dated,target:t.target,completed:t.completed,failed:t.completed-t.passed,passed:t.passed}}));this.createGraph({top:30,right:70,bottom:50,left:60},t)}},{key:"createGraph",value:(a=c()(i.a.mark((function t(e,a){var r,n,s,o,c,l,p,u,d,f,h,g,m,y,x,b,v,w,k=this,O=arguments;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=O.length>2&&void 0!==O[2]&&O[2],n=this.props,s=n.h,o=n.w,c=o-e.left-e.right,l=s-e.top-e.bottom,p=r?D.q("%d-%m-%Y"):D.q("%m-%Y"),u=r?D.r("%d-%m-%Y"):D.r("%m-%Y"),a.sort((function(t,e){return u(t.dated)-u(e.dated)})),D.o(this.lineChart.current).select("svg").remove(),(d=D.o(this.lineChart.current).append("svg").attr("width",c+e.left+e.right).attr("height",l+e.top+e.bottom).append("g").attr("transform","translate("+e.left+","+e.top+")")).append("text").attr("x",c/2).attr("y",0-e.top/2).attr("text-anchor","middle").style("font-size","16px").style("text-decoration","underline").text(this.title),f=this.lineAttributes.map((function(t){return{id:t.label,color:t.color,values:a.map((function(e){return{date:u(e.dated),value:e[t.label],label:t.label.charAt(0).toUpperCase()+t.label.slice(1)}}))}})),h=D.n().domain(D.f(a,(function(t){return u(t.dated)}))).range([0,c]),g=D.q(r?"%d %b":"%b %Y"),m=D.b().ticks(a.length).tickFormat(g).scale(h),d.append("g").attr("class","x-axis").attr("transform","translate(0,"+l+")").call(m).selectAll("text").attr("y",0).attr("x",9).attr("dy",".35em").attr("transform","rotate(45)").style("text-anchor","start"),d.append("text").attr("text-anchor","end").attr("x",c/2).attr("y",l+40).text("Dates"),y=D.l().domain([0,D.i(a,(function(t){return t.target}))]).range([l,0]),x=D.c(y).ticks(5),d.append("g").attr("class","y-axis").call(x),d.append("text").attr("text-anchor","end").attr("transform","rotate(-90)").attr("y",30-e.left).attr("x",-l/2+50).text("Number of Testcases"),b=D.h().x((function(t){return h(t.date)})).y((function(t){return y(t.value)})),(v=d.selectAll("g.lines").data(f).enter()).append("path").attr("fill","none").attr("stroke",(function(t){return t.color})).attr("stroke-width",1.9).attr("d",(function(t){return b(t.values)})),v.append("text").attr("class","serie_label").attr("stroke",(function(t){return t.color})).datum((function(t){return{id:t.id,value:t.values[t.values.length-1]}})).attr("transform",(function(t){return"translate("+h(t.value.date)+","+y(t.value.value)+")"})).attr("x",5).style("font-family","monospace").style("text-anchor","start").style("font-size","12px").text((function(t){return t.id.charAt(0).toUpperCase()+t.id.slice(1)})),d.selectAll("myDots").data(f).enter().append("g").style("fill",(function(t){return t.color})).attr("class",(function(t){return t.id})).selectAll("myPoints").data((function(t){return t.values})).enter().append("circle").attr("cx",(function(t){return h(t.date)})).attr("cy",(function(t){return y(t.value)})).attr("r",5).attr("stroke","white").on("mousemove",(function(t){w.transition().style("opacity",.9),w.html('<span class="grid-container"><span class="grid-item">'.concat(t.label,':</span><span class="grid-item">').concat(t.value,'</span>\n                           <span class="grid-item">Dated:</span><span class="grid-item">').concat(p(t.date),"</span></span>")).style("left",D.e.pageX+"px").style("top",D.e.pageY-28+"px")})).on("mouseout",(function(t){w.transition().style("opacity",0)})).on("click",(function(t){w.transition().style("opacity",0),k.subGraph(A(A({},t),{},{date:p(t.date)}))})),w=D.o(this.lineChart.current).append("div").attr("class","line_tooltip").style("opacity",0);case 26:case"end":return t.stop()}}),t,this)}))),function(t,e){return a.apply(this,arguments)})},{key:"yearChange",value:(e=c()(i.a.mark((function t(e){return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.preventDefault(),e.target.value!==this.state.default){t.next=7;break}return t.next=4,j.chartService.getTestcases();case 4:this.actualData=t.sent,t.next=10;break;case 7:return t.next=9,j.chartService.getTestcases(e.target.value);case 9:this.actualData=t.sent;case 10:this.mainGraph();case 11:case"end":return t.stop()}}),t,this)}))),function(t){return e.apply(this,arguments)})},{key:"render",value:function(){var t=this.props.years?this.props.years.map((function(t){return k.a.createElement("option",{key:t,value:t},t)})):k.a.createElement("option",null,this.state.default);return k.a.createElement("div",{className:"chart"},k.a.createElement("select",{className:"dropdown",onChange:this.yearChange},t),k.a.createElement("div",{ref:this.lineChart}))}}]),s}(w.Component);var R={get:C.chartAction.get},S=Object(O.b)((function(t){return{years:t.chart.years}}),R)(E);e.default=S},85:function(t,e,a){var r=a(37),n=a(86);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[t.i,n,""]]);var s={insert:"head",singleton:!1};r(n,s);t.exports=n.locals||{}},86:function(t,e,a){(e=a(38)(!1)).push([t.i,"div.tooltip{position:absolute;text-align:center;width:80px;height:60px;padding:2px 0px 0px 4px;font:10px sans-serif;background:lightsteelblue;border:0px;border-radius:6px;pointer-events:none}div.line_tooltip{position:absolute;text-align:center;width:auto;height:30px;padding:4px 2px 0px 2px;font:10px sans-serif;background:lightsteelblue;border:0px;border-radius:6px;pointer-events:none}.grid-container{display:grid;grid-template-columns:auto auto;margin:0px 0px -4px 0px}.grid-item{text-align:left}.chart select.dropdown{padding:0.5em;align-items:center}\n",""]),t.exports=e}}]);