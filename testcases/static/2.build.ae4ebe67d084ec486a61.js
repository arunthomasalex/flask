(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{152:function(t,e,a){var r=a(153),n=a(154),o=a(47),i=a(155);t.exports=function(t,e){return r(t)||n(t,e)||o(t,e)||i()}},153:function(t,e){t.exports=function(t){if(Array.isArray(t))return t}},154:function(t,e){t.exports=function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var a=[],r=!0,n=!1,o=void 0;try{for(var i,s=t[Symbol.iterator]();!(r=(i=s.next()).done)&&(a.push(i.value),!e||a.length!==e);r=!0);}catch(t){n=!0,o=t}finally{try{r||null==s.return||s.return()}finally{if(n)throw o}}return a}}},155:function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},159:function(t,e,a){"use strict";a.r(e);var r=a(152),n=a.n(r),o=a(4),i=a.n(o),s=a(92),c=a.n(s),l=a(93),u=a.n(l),p=a(13),d=a.n(p),f=a(14),h=a.n(f),y=a(23),m=a.n(y),g=a(15),v=a.n(g),b=a(16),x=a.n(b),w=a(11),k=a.n(w),C=a(0),O=a.n(C),D=a(17),j=a(94),E=a(5),G=a.n(E);a(85);function A(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,r)}return a}function P(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?A(Object(a),!0).forEach((function(e){i()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):A(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function S(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var a,r=k()(t);if(e){var n=k()(this).constructor;a=Reflect.construct(r,arguments,n)}else a=r.apply(this,arguments);return x()(this,a)}}var R=function(t){v()(s,t);var e,a,r,o,i=S(s);function s(t){var e;return d()(this,s),(e=i.call(this)).lineChart=O.a.createRef(),e.state={type:t.app_type},e.lineAttributes=[{label:"passed",color:"#28a745"},{label:"failed",color:"#b33040"},{label:"completed",color:"#34baeb"},{label:"target",color:"#060708"}],e.subGraph=e.subGraph.bind(m()(e)),e.yearChange=e.yearChange.bind(m()(e)),e.suiteChange=e.suiteChange.bind(m()(e)),e}return h()(s,[{key:"componentDidMount",value:(o=u()(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.title=this.props.title?this.props.title:"LINE CHART",t.next=3,j.g("".concat(G.a.apiUrl,"/testcases?type=").concat(this.props.app_type));case 3:this.actualData=t.sent,this.mainGraph();case 5:case"end":return t.stop()}}),t,this)}))),function(){return o.apply(this,arguments)})},{key:"subGraph",value:function(t){if((t=this.actualData.filter((function(e){return e.dated===t.date})))&&t.length>0){t=(t=t[0]).datas.map((function(t){var e=t.completed-t.passed;return{dated:t.dated,target:t.target,completed:t.completed,failed:e>0?e:0,passed:t.passed}})),this.createGraph({top:30,right:70,bottom:30,left:60},t,!0)}else this.mainGraph()}},{key:"mainGraph",value:function(){var t=this.actualData.map((function(t){return{datas:t.datas,dated:t.dated,target:t.target,completed:t.completed,failed:t.completed-t.passed,passed:t.passed}}));this.createGraph({top:30,right:70,bottom:50,left:60},t)}},{key:"createGraph",value:(r=u()(c.a.mark((function t(e,a){var r,n,o,i,s,l,u,p,d,f,h,y,m,g,v,b,x,w,k=this,C=arguments;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=C.length>2&&void 0!==C[2]&&C[2],n=this.props,o=n.h,i=n.w,s=i-e.left-e.right,l=o-e.top-e.bottom,u=r?j.q("%d-%m-%Y"):j.q("%m-%Y"),p=r?j.r("%d-%m-%Y"):j.r("%m-%Y"),a.sort((function(t,e){return p(t.dated)-p(e.dated)})),j.o(this.lineChart.current).select("svg").remove(),(d=j.o(this.lineChart.current).append("svg").attr("width",s+e.left+e.right).attr("height",l+e.top+e.bottom).append("g").attr("transform","translate("+e.left+","+e.top+")")).append("text").attr("x",s/2).attr("y",0-e.top/2).attr("text-anchor","middle").style("font-size","16px").style("text-decoration","underline").text("".concat(this.title," (").concat(r?"Monthly":"Summary",")")),f=this.lineAttributes.map((function(t){return{id:t.label,color:t.color,values:a.map((function(e){return{date:p(e.dated),value:e[t.label],label:t.label.charAt(0).toUpperCase()+t.label.slice(1)}}))}})),h=j.n().domain(j.f(a,(function(t){return p(t.dated)}))).range([0,s]),y=j.q(r?"%d %b":"%b %Y"),m=j.b().ticks(a.length).tickFormat(y).scale(h),d.append("g").attr("class","x-axis").attr("transform","translate(0,"+l+")").call(m).selectAll("text").attr("y",0).attr("x",9).attr("dy",".35em").attr("transform","rotate(45)").style("text-anchor","start"),d.append("text").attr("text-anchor","end").style("font-weight","700").attr("x",s/2).attr("y",l+20).text(r?"Days":"Months"),g=j.l().domain([0,j.i(a,(function(t){return t.target}))]).range([l,0]),v=j.c(g).ticks(5),d.append("g").attr("class","y-axis").call(v),d.append("text").attr("text-anchor","end").style("font-weight","700").attr("transform","rotate(-90)").attr("y",30-e.left).attr("x",-l/2+50).text("# of Testcases"),b=j.h().x((function(t){return h(t.date)})).y((function(t){return g(t.value)})),(x=d.selectAll("g.lines").data(f).enter()).append("path").attr("fill","none").attr("stroke",(function(t){return t.color})).attr("stroke-width",1.9).attr("d",(function(t){return b(t.values)})),x.append("text").attr("class","serie_label").attr("stroke",(function(t){return t.color})).datum((function(t){return{id:t.id,value:t.values[t.values.length-1]}})).attr("transform",(function(t){return t.value?"translate("+h(t.value.date)+","+g(t.value.value)+")":""})).attr("x",5).style("font-family","monospace").style("text-anchor","start").style("font-size","12px").text((function(t){return t.id.charAt(0).toUpperCase()+t.id.slice(1)})),d.selectAll("myDots").data(f).enter().append("g").style("fill",(function(t){return t.color})).attr("class",(function(t){return t.id})).selectAll("myPoints").data((function(t){return t.values})).enter().append("circle").attr("cx",(function(t){return h(t.date)})).attr("cy",(function(t){return g(t.value)})).attr("r",5).attr("stroke","white").on("mousemove",(function(t){w.transition().style("opacity",.9),w.html('<span class="grid-container"><span class="grid-item">'.concat(t.label,':</span><span class="grid-item">').concat(t.value,'</span>\n                           <span class="grid-item">Dated:</span><span class="grid-item">').concat(u(t.date),'</span>\n                           <span class="grid-row">Click here to ').concat(r?"go back":"drill down","</span></span>")).style("left",j.e.pageX-50+"px").style("top",j.e.pageY-45+"px")})).on("mouseout",(function(t){w.transition().style("opacity",0)})).on("click",(function(t){w.transition().style("opacity",0),k.subGraph(P(P({},t),{},{date:u(t.date)}))})),w=j.o(this.lineChart.current).append("div").attr("class","line_tooltip").style("opacity",0);case 26:case"end":return t.stop()}}),t,this)}))),function(t,e){return r.apply(this,arguments)})},{key:"createCritera",value:function(t){var e=P(P({},this.state),t);return Object.entries(e).filter((function(t){return null!=t[1]})).map((function(t){var e=n()(t,2),a=e[0],r=e[1];return"".concat(a,"=").concat(r)})).join("&")}},{key:"yearChange",value:(a=u()(c.a.mark((function t(e){var a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.preventDefault(),a=null,a="Default"===e.target.value?{year:null}:{year:e.target.value},t.next=5,j.g("".concat(G.a.apiUrl,"/testcases?").concat(this.createCritera(a)));case 5:this.actualData=t.sent,this.setState(a),this.mainGraph();case 8:case"end":return t.stop()}}),t,this)}))),function(t){return a.apply(this,arguments)})},{key:"suiteChange",value:(e=u()(c.a.mark((function t(e){var a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.preventDefault(),a=null,a=""===e.target.value?{suite:null}:{suite:e.target.value},t.next=5,j.g("".concat(G.a.apiUrl,"/testcases?").concat(this.createCritera(a)));case 5:this.actualData=t.sent,this.setState(a),this.mainGraph();case 8:case"end":return t.stop()}}),t,this)}))),function(t){return e.apply(this,arguments)})},{key:"render",value:function(){var t=this.props.years?this.props.years.map((function(t){return O.a.createElement("option",{key:t,value:t},t)})):O.a.createElement("option",null,"Default"),e=this.props.suites?this.props.suites.map((function(t){return O.a.createElement("option",{key:t,value:t},t)})):O.a.createElement("option",null);return O.a.createElement("div",{className:"chart"},O.a.createElement("select",{className:"dropdown",onChange:this.yearChange},t),O.a.createElement("select",{className:"dropdown",onChange:this.suiteChange},e),O.a.createElement("div",{ref:this.lineChart}))}}]),s}(C.Component);var _=Object(D.b)((function(t){var e=t.chart;return{years:e.years,suites:e.suites}}),{})(R);e.default=_},85:function(t,e,a){var r=a(37),n=a(86);"string"==typeof(n=n.__esModule?n.default:n)&&(n=[[t.i,n,""]]);var o={insert:"head",singleton:!1};r(n,o);t.exports=n.locals||{}},86:function(t,e,a){(e=a(38)(!1)).push([t.i,'div.tooltip{position:absolute;text-align:center;width:80px;height:60px;padding:2px 0px 0px 4px;font:10px sans-serif;background:lightsteelblue;border:0px;border-radius:6px;pointer-events:none}div.line_tooltip{position:absolute;text-align:center;width:auto;height:45px;padding:4px 2px 0px 2px;font:10px sans-serif;background:lightsteelblue;border:0px;border-radius:6px;pointer-events:none}.grid-container{display:grid;grid-template-columns:auto auto;margin:0px 0px -4px 0px}.grid-item{text-align:left}.grid-row::before{color:red;content:"* "}.grid-row{font-style:italic;padding:2px;grid-column-start:1;grid-column-end:3}.note{padding:50px}.chart select.dropdown{padding:0.5em;align-items:center}\n',""]),t.exports=e}}]);