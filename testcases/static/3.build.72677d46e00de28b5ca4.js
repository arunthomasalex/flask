(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{153:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return w}));var r=n(92),a=n.n(r),o=n(93),i=n.n(o),u=n(13),c=n.n(u),p=n(14),s=n.n(p),l=n(15),d=n.n(l),f=n(16),h=n.n(f),g=n(11),x=n.n(g),m=n(0),y=n.n(m),v=n(94);n(85);function b(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=x()(t);if(e){var a=x()(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return h()(this,n)}}var w=function(t){d()(r,t);var e,n=b(r);function r(){var t;return c()(this,r),(t=n.call(this)).areaChart=y.a.createRef(),t}return s()(r,[{key:"getData",value:function(t){return new Promise((function(e,n){return v.d(t).then((function(t){return e(t)}))}))}},{key:"componentDidMount",value:(e=i()(a.a.mark((function t(){var e,n,r,o,i,u,c,p,s,l,d,f,h,g,x;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e={top:30,right:30,bottom:30,left:60},n=this.props,r=n.h,o=n.w,i=o-e.left-e.right,u=r-e.top-e.bottom,(c=v.o(this.areaChart.current).append("svg").attr("width",i+e.left+e.right).attr("height",u+e.top+e.bottom).append("g").attr("transform","translate("+e.left+","+e.top+")")).append("text").attr("x",i/2).attr("y",0-e.top/2).attr("text-anchor","middle").style("font-size","16px").style("text-decoration","underline").text("STACKED AREA CHART ONE"),t.next=8,this.getData("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv");case 8:p=t.sent,s=v.j().key((function(t){return t.year})).entries(p),l=["Helen","Amanda","Ashley","Dorothy"],d=[1,2,3,4],f=v.p().keys(d).value((function(t,e){return t.values[e].n}))(s),h=v.l().domain(v.f(p,(function(t){return t.year}))).range([0,i]),c.append("g").attr("transform","translate(0,"+u+")").call(v.b(h).ticks(5)),g=v.l().domain([0,1.2*v.i(p,(function(t){return+t.n}))]).range([u,0]),c.append("g").call(v.c(g)),x=v.m().domain(l).range(["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"]),c.selectAll("mylayers").data(f).enter().append("path").style("fill",(function(t){return name=l[t.key-1],x(name)})).attr("d",v.a().x((function(t){return h(t.data.key)})).y0((function(t){return g(t[0])})).y1((function(t){return g(t[1])})));case 19:case"end":return t.stop()}}),t,this)}))),function(){return e.apply(this,arguments)})},{key:"render",value:function(){return y.a.createElement("div",{ref:this.areaChart})}}]),r}(m.Component)},85:function(t,e,n){var r=n(37),a=n(86);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[t.i,a,""]]);var o={insert:"head",singleton:!1};r(a,o);t.exports=a.locals||{}},86:function(t,e,n){(e=n(38)(!1)).push([t.i,'div.tooltip{position:absolute;text-align:center;width:80px;height:60px;padding:2px 0px 0px 4px;font:10px sans-serif;background:lightsteelblue;border:0px;border-radius:6px;pointer-events:none}div.line_tooltip{position:absolute;text-align:center;width:auto;height:45px;padding:4px 2px 0px 2px;font:10px sans-serif;background:lightsteelblue;border:0px;border-radius:6px;pointer-events:none}.grid-container{display:grid;grid-template-columns:auto auto;margin:0px 0px -4px 0px}.grid-item{text-align:left}.grid-row::before{color:red;content:"* "}.grid-row{font-style:italic;padding:2px;grid-column-start:1;grid-column-end:3}.note{padding:50px}.chart select.dropdown{padding:0.5em;align-items:center}\n',""]),t.exports=e}}]);