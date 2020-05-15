(this["webpackJsonpcovid-stats"]=this["webpackJsonpcovid-stats"]||[]).push([[0],{109:function(e,t,n){e.exports=n(136)},114:function(e,t,n){},119:function(e,t,n){},136:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(9),o=n.n(c),i=(n(114),n(13)),u=(n(119),n(120),function(){var e=Object(i.c)((function(e){return e.progress}));return r.a.createElement("div",null,r.a.createElement("div",null,"loading covid: ",e.covid.done," / ",e.covid.total),r.a.createElement("div",null,"loading population: ",e.population.done," /"," ",e.population.total))}),l=n(25),s=n.n(l),d=n(40),p=n.n(d),b=n(7),f=function(e){return Object(b.a)(Object(b.a)({},e),{},{type:"progress"})},h=n(172),m=n(184),g=function(e){return e.ui.pickedCountries.map((function(t){return{name:t,data:e.data.where((function(e){return e.iso_code===t})).toArray().map((function(e){return[e.date.getTime(),1e6*e.total_cases/e.population]})),type:"line"}}))},j=function(){var e=Object(i.c)(g),t=Object(i.c)((function(e){return e.ui.caseChart.logSetting})),n={title:{text:"Cases over time"},chart:{height:"50%",zoomType:"x"},xAxis:{type:"datetime",title:{text:"Date"},labels:{step:1}},yAxis:{type:t,title:{text:"Cases per 1M population"}},series:e,credits:{enabled:!1}},a=Object(i.b)();return r.a.createElement("div",{id:"cases"},r.a.createElement("h2",null,"Cases over Time"),r.a.createElement(m.a,{value:t,onChange:function(e,t){t&&("linear"!==t&&"logarithmic"!==t||a(function(e){return{type:"case-chart-log-setting-changed",newSetting:e}}(t)))},exclusive:!0,"aria-label":"log axis setting"},r.a.createElement(h.a,{value:"logarithmic","aria-label":"logarithmic"},"log"),r.a.createElement(h.a,{value:"linear","aria-label":"linear"},"linear")),r.a.createElement(p.a,{highcharts:s.a,options:n}))},O=n(27),v=n(21),y=n(54),E=n(173),w=n(183),x=n(181),C=n(174),_=Object(v.a)((function(e){return e.data}),(function(e){return e.ui.pickedCountries}),(function(e){return e.ui.searchText}),(function(e,t,n){return e.select((function(e){return{iso_code:e.iso_code,location:e.location}})).distinct((function(e){return e.iso_code})).orderBy((function(e){return e.location})).toPairs().map((function(e){var n=Object(O.a)(e,2),a=(n[0],n[1]);return Object(b.a)(Object(b.a)({},a),{},{active:Object(y.includes)(a.iso_code)(t)})})).filter((function(e){return e.active||""!==n&&e.location.toLowerCase().startsWith(n.toLowerCase())}))})),S=function(){var e=Object(i.b)(),t={width:"180px"},n=Object(i.c)(_).map((function(n){var a=n.iso_code,c=n.location,o=n.active;return r.a.createElement(E.a,{button:!0,key:a,onClick:function(t){return e({type:"country-toggled",countryCode:a})},style:t},r.a.createElement(w.a,{edge:"start",checked:o,tabIndex:-1,disableRipple:!0,inputProps:{"aria-labelledby":a}}),c)})),a=Object(i.c)((function(e){return e.ui.searchText}));return r.a.createElement("div",null,r.a.createElement("label",null,r.a.createElement("br",null),r.a.createElement(x.a,{type:"text",name:"search",placeholder:"Search Countries",onChange:function(t){return e({type:"country-search-changed",search:t.target.value})},value:a}),r.a.createElement(C.a,{id:"countries",style:{display:"flex",padding:0,flexWrap:"wrap",alignItems:"center",justifyContent:"center"}},n)))},k=n(95),A=n(96),T=n(74),I=function(e){return Object(k.a)(Object(T.b)(e)).pipe(Object(A.a)((function(e){return e.parseDates("date")})),Object(A.a)((function(e){return e.parseInts("total_cases")})),Object(A.a)((function(e){return e.parseInts("new_cases")})),Object(A.a)((function(e){return e.parseInts("total_deaths")})),Object(A.a)((function(e){return e.parseInts("new_deaths")})))},L=function(e){return Object(k.a)(Object(T.b)(e)).pipe(Object(A.a)((function(e){return e.parseInts(["Value","Year"])})),Object(A.a)((function(e){return e.renameSeries({Year:"year","Country Code":"iso_code",Value:"population"})})))},D=function(e,t){var n=function(e){return e.groupBy((function(e){return e.iso_code})).select((function(e){var t=e.summarize({year:T.a.max}).year,n=e.where((function(e){return e.year===t})).first().population;return{iso_code:e.first().iso_code,population:n}})).inflate()}(t);return e.join(n,(function(e){return e.iso_code}),(function(e){return e.iso_code}),(function(e,t){return Object(b.a)(Object(b.a)({},e),{},{population:t?t.population:0})}))},R=function(e,t){e=Math.ceil(Math.abs(e));for(var n=[],a=0;a<t.length;a++){for(var r=Object(O.a)(t[a],1)[0],c=0,o=0,i=-1*e;i<=e;i++)void 0!==t[a+i]&&(o+=t[a+i][1],c+=1);n.push([r,o/c])}return n},U=function(e){return e.ui.pickedCountries.map((function(t){var n=e.data.where((function(e){return e.iso_code===t})).select((function(e){return{iso_code:e.iso_code,total_deaths:e.total_deaths,population:e.population,new_deaths:e.new_deaths}}));return{name:t,type:"line",data:R(2,n.toArray().map((function(e){return[e.total_deaths/e.population,e.new_deaths/e.population]})).sort((function(e,t){var n=Object(O.a)(e,2),a=n[0],r=(n[1],Object(O.a)(t,2)),c=r[0];r[1];return a<c?-1:1}))).filter((function(e){var t=Object(O.a)(e,2),n=t[0],a=t[1];return 0!==n&&0!==a}))}}))},z=function(){var e={title:{text:"Death Curve"},chart:{height:"50%",zoomType:"xy"},xAxis:{type:"logarithmic",title:{text:"Fraction of dead population"},min:1e-6,tickInterval:1,labels:{step:1,formatter:function(){return this.value.toExponential(0)}}},yAxis:{type:"logarithmic",title:{text:"Fraction of dead population per day (smoothed)"},min:1e-7,tickInterval:1,labels:{step:1,formatter:function(){return this.value.toExponential(0)}}},series:Object(i.c)(U),credits:{enabled:!1}};return r.a.createElement("div",{id:"deathcurve"},r.a.createElement("h2",null,"Robins Death Curve",r.a.createElement("span",{role:"img","aria-label":"tm"},"\u2122\ufe0f")),r.a.createElement(p.a,{highcharts:s.a,options:e}))},F=n(175),M=function(){var e=Object(i.c)((function(e){return e.ui.pickedCountries})),t=Object(i.c)((function(e){return e.data})),n=e.map((function(e){var n={name:e,type:"column",data:t.where((function(t){return t.iso_code===e&&t.date>new Date("03-01-2020")})).toArray().map((function(e){return[e.date.getTime(),e.new_cases]})).sort()},a={name:"7 day average",data:R(3,n.data),type:"line",enableMouseTracking:!1},c={chart:{height:"200",width:"300"},title:{text:e},xAxis:{type:"datetime",tickInterval:6048e5},yAxis:{title:{text:"daily new cases"}},legend:{enabled:!1},series:[n,a],credits:{enabled:!1}};return r.a.createElement(F.a,{item:!0,key:e},r.a.createElement(p.a,{highcharts:s.a,options:c}))}));return r.a.createElement("div",null,r.a.createElement("h2",null,"New Cases"),r.a.createElement(F.a,{container:!0,justify:"center",spacing:5,style:{width:"100%"}},n))},N={textAlign:"center"},G=function(){return r.a.createElement("div",null,r.a.createElement("h1",null,"Covid Stats"),r.a.createElement(S,null),r.a.createElement("hr",null),r.a.createElement(M,null),r.a.createElement("hr",null),r.a.createElement(j,null),r.a.createElement("hr",null),r.a.createElement(z,null),r.a.createElement("div",{style:N},"data from"," ",r.a.createElement("a",{href:"https://covid.ourworldindata.org"},"Our World In Data")," and"," ",r.a.createElement("a",{href:"https://github.com/datasets/population"},"datahub.io via the World Bank")))},W=function(){var e=Object(i.c)((function(e){return e.message}));return r.a.createElement("div",null,"Error: ",e)};function B(e){throw new Error("Unexpected object: "+e)}var H=n(97);n.n(H)()(s.a);var J,P=function(){var e=Object(i.c)((function(e){return e.type}));return r.a.createElement(r.a.Fragment,null,r.a.createElement("a",{className:"github-fork-ribbon right-top",href:"https://github.com/jupp0r/covid-stats","data-ribbon":"Fork me on GitHub",title:"Fork me on GitHub"},"Fork me on GitHub"),r.a.createElement("div",{className:"App"},function(e){switch(e){case"loading":return r.a.createElement(u,null);case"loaded":return r.a.createElement(G,null);case"error":return r.a.createElement(W,null);default:return B(e)}}(e)))},V=n(102),Y=n(101),q=n(56),X=function(e,t){var n=new URL(e),a=new URLSearchParams(n.search);return a.set("countries[]",JSON.stringify(t)),n.search=a.toString(),n.toString()},K=function(e,t){return e},Q=function(e,t){switch(t.type){case"fetch-success":var n=function(e){var t=new URL(e),n=new URLSearchParams(t.search).get("countries[]");if(!n)return le;var a=JSON.parse(n);return Array.isArray(a)?a:(console.error("invalid url params"),le)}(e.routing.url);return Object(b.a)(Object(b.a)({},e),{},{type:"loaded",data:t.response,ui:{pickedCountries:n,searchText:"",caseChart:{logSetting:"logarithmic"}},routing:{url:X(e.routing.url,n)}});case"progress":return Object(b.a)(Object(b.a)({},e),{},{progress:Object(b.a)(Object(b.a)({},e.progress),{},Object(q.a)({},t.target,Object(b.a)({done:t.done,total:e.progress[t.target].total},0!==t.total&&{total:t.total})))});default:return e}},Z=function(e,t){switch(t.type){case"country-toggled":var n=(a=t.countryCode,r=e.ui.pickedCountries,Object(y.includes)(a)(r)?Object(y.filter)((function(e){return e!==a}),r):[a].concat(Object(Y.a)(r)));return Object(b.a)(Object(b.a)({},e),{},{ui:Object(b.a)(Object(b.a)({},e.ui),{},{pickedCountries:n}),routing:{url:X(e.routing.url,n)}});case"country-search-changed":return Object(b.a)(Object(b.a)({},e),{},{ui:Object(b.a)(Object(b.a)({},e.ui),{},{searchText:t.search})});case"case-chart-log-setting-changed":return Object(b.a)(Object(b.a)({},e),{},{ui:Object(b.a)(Object(b.a)({},e.ui),{},{caseChart:Object(b.a)(Object(b.a)({},e.ui.caseChart),{},{logSetting:t.newSetting})})});default:return e}var a,r},$=n(182),ee=n(8),te=n(138),ne=n(177),ae=n(176),re=n(98),ce=n(178),oe=function(e){var t=new XMLHttpRequest;t.responseType="text";var n=new ee.a((function(e){t.addEventListener("progress",(function(t){return e.next({done:t.loaded,total:t.total})}))})),a=new ee.a((function(e){t.addEventListener("readystatechange",(function(n){4===t.readyState&&(200===t.status?(e.next(t.response),e.complete()):e.error(t.response))}))}));return t.open("GET",e),t.send(),{progress:n,result:a}},ie=Object(ce.a)((function(e){var t=e.pipe(Object(ae.a)((function(e){return"initialized"===e.type})),Object(re.a)((function(){var e=oe("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv"),t=e.progress,n=e.result,a=t.pipe(Object(A.a)((function(e){return f(Object(b.a)(Object(b.a)({},e),{},{target:"covid"}))}))),r=n.pipe(Object(re.a)(I),Object(A.a)((function(e){return{type:"success",data:e}})));return Object(te.a)(a,r)}))),n=e.pipe(Object(ae.a)((function(e){return"initialized"===e.type})),Object(re.a)((function(){var e=oe("https://raw.githubusercontent.com/datasets/population/master/data/population.csv"),t=e.progress,n=e.result,a=t.pipe(Object(A.a)((function(e){return f(Object(b.a)(Object(b.a)({},e),{},{target:"population"}))}))),r=n.pipe(Object(re.a)(L),Object(A.a)((function(e){return{type:"success",data:e}})));return Object(te.a)(a,r)}))),a=Object(te.a)(t,n).pipe(Object(ae.a)((function(e){return"progress"===e.type})),Object(A.a)((function(e){return e}))),r=function(e){return e.pipe(Object(ae.a)((function(e){return"success"===e.type})))},c=Object(ne.a)(r(t),r(n)).pipe(Object(A.a)((function(e){var t=Object(O.a)(e,2),n=t[0],a=t[1];return"success"===n.type&&"success"===a.type?{type:"fetch-success",response:D(n.data,a.data)}:{type:"error-during-fetch",message:"Error: ".concat(n," or ").concat(a," failed to fetch")}})));return Object(te.a)(a,c)})),ue={type:"loading",progress:{covid:{done:0,total:2542856},population:{done:0,total:487991}},routing:{url:window.location.toString()}},le=["USA","DEU","SWE","ITA","NGA"],se=Object($.a)(),de=Object(V.a)({reducer:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ue,t=arguments.length>1?arguments[1]:void 0;if("url-updated"===t.type)return Object(b.a)(Object(b.a)({},e),{},{routing:Object(b.a)(Object(b.a)({},e.routing),{},{url:t.url})});switch(e.type){case"error":return K(e);case"loading":return Q(e,t);case"loaded":return Z(e,t);default:return B(e)}},middleware:[se]});se.run(ie),J=de,window.addEventListener("popstate",(function(){J.dispatch({type:"url-updated",url:window.location.toString()})})),J.subscribe((function(){var e=J.getState().routing.url;window.location.toString()!==e&&(window.history.pushState(null,"",e),document.body.scrollTop=0)})),de.dispatch({type:"initialized"});var pe=n(99),be=n(179),fe=n(180),he=document.getElementById("root"),me=Object(pe.a)({palette:{type:"light"}});o.a.render(r.a.createElement(i.a,{store:de},r.a.createElement(r.a.StrictMode,null,r.a.createElement(be.a,{theme:me},r.a.createElement(fe.a,null),r.a.createElement(P,null)))),he)}},[[109,1,2]]]);
//# sourceMappingURL=main.43097142.chunk.js.map