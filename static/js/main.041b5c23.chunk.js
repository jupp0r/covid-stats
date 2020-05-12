(this["webpackJsonpcovid-stats"]=this["webpackJsonpcovid-stats"]||[]).push([[0],{61:function(t,e,n){t.exports=n(89)},66:function(t,e,n){},72:function(t,e,n){},89:function(t,e,n){"use strict";n.r(e);var r=n(0),a=n.n(r),o=n(25),c=n.n(o),i=(n(66),n(6)),u=(n(72),n(73),n(14)),s=n.n(u),l=n(52),p=n.n(l),d=function(){var t=Object(i.c)((function(t){return t.progress}));return a.a.createElement("div",null,a.a.createElement("div",null,"loading covid: ",t.covid.done," / ",t.covid.total),a.a.createElement("div",null,"loading population: ",t.population.done," /"," ",t.population.total))},f=n(26),b=n.n(f),h=function(t){return t.ui.pickedCountries.map((function(e){return{name:e,data:t.data.where((function(t){return t.iso_code===e})).toArray().map((function(t){return[t.date.getTime(),1e6*t.total_cases/t.population]})),type:"line"}}))},j=function(){var t={title:{text:"Cases over time"},chart:{height:"50%",zoomType:"x"},xAxis:{type:"datetime",title:{text:"Date"},labels:{step:1}},yAxis:{type:"logarithmic",title:{text:"Cases per 1M population"}},series:Object(i.c)(h)};return a.a.createElement("div",{id:"cases"},a.a.createElement(b.a,{highcharts:s.a,options:t}))},O=n(2),m=n(13),g=n(23),v=function(t){return Object(O.a)(Object(O.a)({},t),{},{type:"progress"})},y=function(t){return t.data.select((function(t){return{iso_code:t.iso_code,location:t.location}})).distinct((function(t){return t.iso_code})).orderBy((function(t){return t.location})).toPairs().map((function(e){var n=Object(m.a)(e,2),r=(n[0],n[1]);return Object(O.a)(Object(O.a)({},r),{},{active:Object(g.includes)(r.iso_code)(t.ui.pickedCountries)})})).filter((function(e){return e.active||""!==t.ui.searchText&&e.location.toLowerCase().startsWith(t.ui.searchText.toLowerCase())}))},E=function(){var t=Object(i.b)(),e=Object(i.c)(y).map((function(e){var n,r=e.iso_code,o=e.location,c=e.active;return a.a.createElement("li",{key:r,style:(n=c,{fontWeight:n?"bold":"normal"}),onClick:function(e){return t({type:"country-toggled",countryCode:r})}},o)})),n=Object(i.c)((function(t){return t.ui.searchText}));return a.a.createElement("div",null,a.a.createElement("label",null,"Select Countries",a.a.createElement("br",null),a.a.createElement("input",{type:"text",name:"search",onChange:function(e){return t({type:"country-search-changed",search:e.target.value})},value:n}),a.a.createElement("ul",{id:"countries",style:{listStyleType:"none"}},e)))},w=function(t,e){t=Math.ceil(Math.abs(t));for(var n=[],r=0;r<e.length;r++){for(var a=Object(m.a)(e[r],1)[0],o=0,c=0,i=-1*t;i<=t;i++)void 0!==e[r+i]&&(c+=e[r+i][1],o+=1);n.push([a,c/o])}return console.log("smooth results: ",n),n},x=function(t){return t.ui.pickedCountries.map((function(e){var n=t.data.where((function(t){return t.iso_code===e})).select((function(t){return{iso_code:t.iso_code,total_deaths:t.total_deaths,population:t.population,new_deaths:t.new_deaths}}));return{name:e,type:"line",data:w(2,n.toArray().map((function(t){return[t.total_deaths/t.population,t.new_deaths/t.population]})).sort((function(t,e){var n=Object(m.a)(t,2),r=n[0],a=(n[1],Object(m.a)(e,2)),o=a[0];a[1];return r<o?-1:1}))).filter((function(t){var e=Object(m.a)(t,2),n=e[0],r=e[1];return 0!==n&&0!==r}))}}))},_=function(){var t={title:{text:"Death Curve"},chart:{height:"50%",zoomType:"xy"},xAxis:{type:"logarithmic",title:{text:"Fraction of dead population"},min:1e-6,tickInterval:1,labels:{step:1,formatter:function(){return this.value.toExponential(0)}}},yAxis:{type:"logarithmic",title:{text:"Fraction of dead population per day (smoothed)"},min:1e-7,tickInterval:1,labels:{step:1,formatter:function(){return this.value.toExponential(0)}}},series:Object(i.c)(x)};return a.a.createElement("div",{id:"deathcurve"},a.a.createElement(b.a,{highcharts:s.a,options:t}))},C=function(){return a.a.createElement("div",null,a.a.createElement(E,null),a.a.createElement(j,null),a.a.createElement(_,null))},S=function(){var t=Object(i.c)((function(t){return t.message}));return a.a.createElement("div",null,"Error: ",t)};function k(t){throw new Error("Unexpected object: "+t)}p()(s.a);var A,T={textAlign:"center"},I=function(){var t=Object(i.c)((function(t){return t}));return a.a.createElement(a.a.Fragment,null,a.a.createElement("a",{className:"github-fork-ribbon right-top",href:"https://github.com/jupp0r/covid-stats","data-ribbon":"Fork me on GitHub",title:"Fork me on GitHub"},"Fork me on GitHub"),a.a.createElement("div",{className:"App"},function(t){switch(t.type){case"loading":return a.a.createElement(d,null);case"loaded":return a.a.createElement(C,null);case"error":return a.a.createElement(S,null);default:return k(t)}}(t)),a.a.createElement("div",{style:T},"data from"," ",a.a.createElement("a",{href:"https://covid.ourworldindata.org"},"Our World In Data")," and"," ",a.a.createElement("a",{href:"https://github.com/datasets/population"},"datahub.io via the World Bank")))},L=n(58),U=n(59),z=n(27),F=n(54),D=n(55),G=n(39),M=function(t){return Object(F.a)(Object(G.b)(t)).pipe(Object(D.a)((function(t){return t.parseDates("date")})),Object(D.a)((function(t){return t.parseInts("total_cases")})),Object(D.a)((function(t){return t.parseInts("new_cases")})),Object(D.a)((function(t){return t.parseInts("total_deaths")})),Object(D.a)((function(t){return t.parseInts("new_deaths")})))},N=function(t){return Object(F.a)(Object(G.b)(t)).pipe(Object(D.a)((function(t){return t.parseInts(["Value","Year"])})),Object(D.a)((function(t){return t.renameSeries({Year:"year","Country Code":"iso_code",Value:"population"})})))},R=function(t,e){var n=function(t){return t.groupBy((function(t){return t.iso_code})).select((function(t){var e=t.summarize({year:G.a.max}).year,n=t.where((function(t){return t.year===e})).first().population;return{iso_code:t.first().iso_code,population:n}})).inflate()}(e);return console.log(t.toArray()),t.join(n,(function(t){return t.iso_code}),(function(t){return t.iso_code}),(function(t,e){return Object(O.a)(Object(O.a)({},t),{},{population:e?e.population:0})}))},W=function(t,e){var n=new URL(t),r=new URLSearchParams(n.search);return r.set("countries[]",JSON.stringify(e)),n.search=r.toString(),n.toString()},B=function(t,e){return t},H=function(t,e){switch(e.type){case"fetch-success":var n=function(t){var e=new URL(t),n=new URLSearchParams(e.search).get("countries[]");if(!n)return et;var r=JSON.parse(n);return Array.isArray(r)?r:(console.error("invalid url params"),et)}(t.routing.url);return Object(O.a)(Object(O.a)({},t),{},{type:"loaded",data:e.response,ui:{pickedCountries:n,searchText:""},routing:{url:W(t.routing.url,n)}});case"progress":return Object(O.a)(Object(O.a)({},t),{},{progress:Object(O.a)(Object(O.a)({},t.progress),{},Object(z.a)({},e.target,Object(O.a)({done:e.done,total:t.progress[e.target].total},0!==e.total&&{total:e.total})))});default:return t}},J=function(t,e){switch(e.type){case"country-toggled":var n=(r=e.countryCode,a=t.ui.pickedCountries,Object(g.includes)(r)(a)?Object(g.filter)((function(t){return t!==r}),a):[r].concat(Object(U.a)(a)));return Object(O.a)(Object(O.a)({},t),{},{ui:Object(O.a)(Object(O.a)({},t.ui),{},{pickedCountries:n}),routing:{url:W(t.routing.url,n)}});case"country-search-changed":return Object(O.a)(Object(O.a)({},t),{},{ui:Object(O.a)(Object(O.a)({},t.ui),{},{searchText:e.search})});default:return t}var r,a},P=n(95),V=n(3),Y=n(90),q=n(93),X=n(92),K=n(56),Q=n(94),Z=function(t){var e=new XMLHttpRequest;e.responseType="text";var n=new V.a((function(t){e.addEventListener("progress",(function(e){return t.next({done:e.loaded,total:e.total})}))})),r=new V.a((function(t){e.addEventListener("readystatechange",(function(n){4===e.readyState&&(200===e.status?(t.next(e.response),t.complete()):t.error(e.response))}))}));return e.open("GET",t),e.send(),{progress:n,result:r}},$=Object(Q.a)((function(t){var e=t.pipe(Object(X.a)((function(t){return"initialized"===t.type})),Object(K.a)((function(){var t=Z("https://covid.ourworldindata.org/data/owid-covid-data.csv"),e=t.progress,n=t.result,r=e.pipe(Object(D.a)((function(t){return v(Object(O.a)(Object(O.a)({},t),{},{target:"covid"}))}))),a=n.pipe(Object(K.a)(M),Object(D.a)((function(t){return{type:"success",data:t}})));return Object(Y.a)(r,a)}))),n=t.pipe(Object(X.a)((function(t){return"initialized"===t.type})),Object(K.a)((function(){var t=Z("https://raw.githubusercontent.com/datasets/population/master/data/population.csv"),e=t.progress,n=t.result,r=e.pipe(Object(D.a)((function(t){return v(Object(O.a)(Object(O.a)({},t),{},{target:"population"}))}))),a=n.pipe(Object(K.a)(N),Object(D.a)((function(t){return{type:"success",data:t}})));return Object(Y.a)(r,a)}))),r=Object(Y.a)(e,n).pipe(Object(X.a)((function(t){return"progress"===t.type})),Object(D.a)((function(t){return t}))),a=function(t){return t.pipe(Object(X.a)((function(t){return"success"===t.type})))},o=Object(q.a)(a(e),a(n)).pipe(Object(D.a)((function(t){var e=Object(m.a)(t,2),n=e[0],r=e[1];return console.log("happened"),"success"===n.type&&"success"===r.type?{type:"fetch-success",response:R(n.data,r.data)}:{type:"error-during-fetch",message:"Error: ".concat(n," or ").concat(r," failed to fetch")}})));return Object(Y.a)(r,o)})),tt={type:"loading",progress:{covid:{done:0,total:2542856},population:{done:0,total:487991}},routing:{url:window.location.toString()}},et=["USA","DEU","SWE","ITA","NGA"],nt=Object(P.a)(),rt=Object(L.a)({reducer:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:tt,e=arguments.length>1?arguments[1]:void 0;if("url-updated"===e.type)return Object(O.a)(Object(O.a)({},t),{},{routing:Object(O.a)(Object(O.a)({},t.routing),{},{url:e.url})});switch(t.type){case"error":return B(t);case"loading":return H(t,e);case"loaded":return J(t,e);default:return k(t)}},middleware:[nt]});nt.run($),A=rt,window.addEventListener("popstate",(function(){A.dispatch({type:"url-updated",url:window.location.toString()})})),A.subscribe((function(){var t=A.getState().routing.url;window.location.toString()!==t&&(window.history.pushState(null,"",t),document.body.scrollTop=0)})),rt.dispatch({type:"initialized"});var at=document.getElementById("root");c.a.render(a.a.createElement(i.a,{store:rt},a.a.createElement(a.a.StrictMode,null,a.a.createElement(I,null))),at)}},[[61,1,2]]]);
//# sourceMappingURL=main.041b5c23.chunk.js.map