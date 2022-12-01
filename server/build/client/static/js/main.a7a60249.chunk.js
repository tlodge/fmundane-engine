(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{105:function(e,t,n){},135:function(e,t){},146:function(e,t,n){"use strict";n.r(t);var c=n(1),r=n.n(c),a=n(35),i=n.n(a),s=(n(105),n(3)),o=n.n(s),l=n(8),d=n(6),u=n(2),f=n(4),j=n(7),x=n(0);var b=function(e){var t=e.ready,n=e.names,c=e.handleAction,r=n.map((function(e){return Object(x.jsx)("button",{onClick:function(){return c(e)},className:"bg-blue-500 m-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",children:e},e)}));return t?Object(x.jsx)("div",{children:r}):Object(x.jsx)(x.Fragment,{})},h=n(14),p=n(10),m=n(39),O=n(75),v=n.n(O),g=n(5),y=n.n(g),w=n(147),k=n(77),N=v()(window.location.href),C=Object(m.b)({name:"experience",initialState:{layers:[],events:[],readyforinput:{},transcript:"",lastsenttranscript:"",authored:[],layerName:"",listening:{},rendering:!1},reducers:{setAuthored:function(e,t){e.authored=t.payload},setLayerName:function(e,t){e.layerName=t.payload},setLayers:function(e,t){e.layers=t.payload},setEvents:function(e,t){e.events=t.payload},setEvent:function(e,t){e.events=[].concat(Object(h.a)(e.events.filter((function(e){return e.id!==t.payload.id}))),[t.payload])},setTranscript:function(e,t){var n=t.payload,c=n.transcript;n.layerid;e.transcript=c},setReadyForInput:function(e,t){e.readyforinput=Object(u.a)(Object(u.a)({},e.readyforinput),t.payload)},setListening:function(e,t){var n=t.payload,c=n.layerid,r=n.listening;e.listening=Object(u.a)(Object(u.a)({},e.listening),{},Object(d.a)({},c,r))},sentTranscript:function(e){e.lastsenttranscript=e.transcript},resetReadiness:function(e){e.readyforinput={}},setRendering:function(e,t){e.rendering=t.payload}}}),S=C.actions,E=S.setRendering,R=S.setLayers,A=S.setLayerName,M=S.setEvent,L=S.setListening,W=S.setEvents,T=S.setTranscript,z=S.sentTranscript,F=S.setReadyForInput,q=S.setAuthored,J=S.resetReadiness;N.on("connect_error",(function(){console.log("attempting to reconnect!!"),setTimeout((function(){N.connect()}),1e3)}));var U=function(){return function(e){y.a.get("/author/authored").then((function(t){var n=t.body.layers;e(q(n))}))}},I=function(e){return Object(h.a)(e.experience.events||[]).sort((function(e,t){return e.id<t.id?-1:e.id>t.id?1:-1}))},Z=function(e){return e.experience.readyforinput},B=function(e){return e.experience.transcript},P=function(e){return e.experience.layers.reduce((function(e,t){return Object(u.a)(Object(u.a)({},e),{},Object(d.a)({},t.layerid,w.a().nodeSize([120,230])(k.b(t,(function(e){return e.children})))))}),{})},D=function(e){return e.experience.authored},H=function(e){return e.experience.layerName},_=function(e){return e.experience.rendering},Y=C.reducer;function $(e){var t=e.rules,n=e.ready,r=e.handleAction,a=e.handleChange,i=Object(c.useState)(""),s=Object(f.a)(i,2),o=s[0],l=s[1],d=function(e){a(e),l(e)},u=function(){l(""),r()},b=Object(j.c)(B);return Object(x.jsxs)("div",{className:"flex flex-col h-full w-full",children:[Object(x.jsx)("div",{style:{height:50},className:"flex text-xs font-bold justify-center items-center",children:""==b.trim()?"[listening for speech]":'"'.concat(b,'"')}),n&&Object(x.jsxs)("div",{className:"p-6 bg-black flex flex-grow flex-col",children:[Object(x.jsx)("div",{className:"font-semibold text-white text-base pb-2",children:"override"}),function(){var e=t.reduce((function(e,t){return[].concat(Object(h.a)(e),Object(h.a)((t.rule.operand||[]).map((function(e){return{operand:e,next:t.next}}))))}),[]);return 0===e.length?Object(x.jsxs)("div",{className:"flex flex-col overflow-auto",children:[Object(x.jsx)("input",{onChange:function(e){return d(e.target.value)},value:o,className:"h-10 pl-2 m-4 rounded",type:"text",placeholder:"simulate some words"}),Object(x.jsx)("button",{onClick:function(){u()},className:"bg-blue-500 mr-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",children:"say it!"})]}):e.map((function(e){return Object(x.jsx)("button",{onClick:function(){d(e.operand),u()},className:"bg-blue-500 m-2 text-xs hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2rounded",children:"".concat(e.operand," (").concat(e.next,")")},e.operand)}))}()]})]})}var G=function(e){var t=e.ready,n=e.names,c=e.handleAction,r=n.map((function(e){return Object(x.jsx)("button",{onClick:function(){return c(e)},className:"bg-green-500 m-2 text-xs hover:bg-green-700 text-white font-bold py-2 px-4 rounded",children:e},e)}));return t?Object(x.jsx)("div",{children:r}):Object(x.jsx)(x.Fragment,{})};var K=function(e){var t=e.id,n=Object(j.b)();return Object(x.jsxs)("div",{className:"w-full text-black  bg-gray-600 overflow-hidden shadow-lg flex flex-grow flex-col",style:{minHeight:280,overflow:"auto"},children:[Object(x.jsxs)("div",{className:"flex flex-row text-xs font-semibold p-4 bg-gray-400",children:[Object(x.jsxs)("div",{className:"flex flex-grow",children:["".concat(e.id," (").concat(e.data.type,")")," "]}),Object(x.jsx)("div",{onClick:function(){return e.toggleTree(e.id)},className:"flex",children:"tree"})]}),Object(x.jsx)("div",{className:"flex justify-center flex-grow",children:function(e){switch(e.type){case"button":return Object(x.jsx)(b,{ready:e.ready,names:e.data,handleAction:function(e){n(function(e,t){return function(n){console.log("button pressed!!",e,t),n(F(Object(d.a)({},t,!1))),y.a.get("/event/press").query({name:e,layer:t}).end((function(e,t){e&&console.log(e)}))}}(e,t))}});case"speech":return Object(x.jsx)($,{rules:e.rules,ready:e.ready,handleChange:function(e){n(T({transcript:e,layerid:t}))},handleAction:function(){n((function(e,t){var n=t().experience.transcript,c=t().experience.listening,r=function(){var n=Object(l.a)(o.a.mark((function n(){var r,a,i;return o.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:r=0,a=Object.keys(c);case 1:if(!(r<a.length)){n.next=10;break}if(i=a[r],!c[i]){n.next=7;break}return n.next=6,y.a.get("/event/speech").query({layer:i,speech:t().experience.transcript});case 6:e(z());case 7:r++,n.next=1;break;case 10:e(T({transcript:""}));case 11:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();""!==n.trim()&&r()}))}});case"webhook":return Object(x.jsx)(G,{ready:e.ready,names:e.data,handleAction:function(e){n(function(e,t){return function(){y.a.get("/event/webhook").query({trigger:e}).end((function(e,t){e&&console.log(e)}))}}(e))}});default:return JSON.stringify(e,null,4)}}(Object(u.a)(Object(u.a)({},e.data),{},{ready:e.ready||!1}))})]})},Q=function(e){var t=e.start,n=e.authored,c=e.toggleCreate,r=e.toggleUploadMedia,a=e.twineExport,i=e.renderSpeech,s=e.rendering,o=Object(j.c)(H);return Object(x.jsxs)("nav",{className:"flex items-center flex-wrap bg-teal-500 p-1",children:[Object(x.jsx)("div",{className:"flex items-center text-white",children:Object(x.jsxs)("svg",{width:"66",height:"42",viewBox:"0 0 33 21",style:{fillRule:"evenodd",clipRule:"evenodd",strokeLinecap:"round",strokeLinejoin:"round",strokeMiterlimit:"1.5"},children:[Object(x.jsx)("path",{d:"M1.425,11.233c1.484,-2.368 3.867,-5.752 8.591,-8.263c4.267,-2.268 9.378,-2.597 10.538,-2.634c11.581,-0.375 11.745,9.075 11.758,9.983c0.149,2.891 -0.988,5.991 -2.709,6.365c-2.557,0.556 -5.645,0.675 -8.484,0.823c-0,-0 -0.485,-2.705 -3.147,-2.523c-3.078,0.211 -3.057,2.749 -3.057,2.749l-5.478,0.034c-3.169,-0.217 -6.251,-0.923 -9.112,-2.878c0.099,-1.076 0.424,-2.577 1.1,-3.656Z",style:{fill:"none",stroke:"#fff",strokeWidth:.65}}),Object(x.jsx)("path",{d:"M18.03,16.213c1.187,0 2.15,0.921 2.15,2.056c0,1.135 -0.963,2.056 -2.15,2.056c-1.187,0 -2.151,-0.921 -2.151,-2.056c-0,-1.135 0.964,-2.056 2.151,-2.056Zm-0,1.273c0.452,-0 0.819,0.351 0.819,0.783c0,0.433 -0.367,0.784 -0.819,0.784c-0.453,-0 -0.82,-0.351 -0.82,-0.784c-0,-0.432 0.367,-0.783 0.82,-0.783Z",style:{fill:"none",stroke:"#fff",strokeWidth:.61}}),Object(x.jsx)("path",{d:"M3.191,11.01c-0,0 5.163,-9.036 17.356,-9.416c10.119,-0.316 10.542,8.541 10.542,8.541c-0.983,0.081 -1.454,0.569 -1.498,0.911c-0.093,0.724 0.607,1.131 1.224,1.14c-0.301,1.964 -0.921,2.796 -2.169,3.24c-1.608,0.572 -6.789,0.413 -6.789,0.413c-0,-0 -0.524,-2.554 -3.759,-2.522c-2.696,0.027 -3.614,2.85 -3.614,2.85c-4.652,0.473 -8.768,-0.024 -12.101,-1.954c0.019,-0.386 0.149,-0.733 0.372,-1.045c-0,-0 1.62,-0.073 1.658,-1.111c0.035,-0.959 -1.222,-1.047 -1.222,-1.047Z",style:{fill:"none",stroke:"#fff",strokeWidth:.65}}),Object(x.jsx)("path",{d:"M21.831,5.29c0.027,-0.872 0.996,-1.574 2.185,-1.574c1.207,0 2.186,0.723 2.186,1.612c0,0.051 -0.003,0.101 -0.009,0.151l0.297,7.926l-4.358,0.089l-0.317,-8.204l0.016,0Z",style:{fill:"none",stroke:"#fff",strokeWidth:.68}}),Object(x.jsx)("ellipse",{cx:"24.137",cy:"6.687",rx:"1.042",ry:"1.013",style:{fill:"none",stroke:"#fff",strokeWidth:.54}}),Object(x.jsx)("path",{d:"M17.87,5.83c-0.004,-0.204 -0.147,-0.367 -0.319,-0.363c-1.828,-0.053 -3.673,-0.044 -5.557,0.109c-0.172,0.003 -0.309,0.171 -0.305,0.375c0.092,0.837 0.1,1.693 0.051,2.564c0.004,0.203 0.147,0.366 0.319,0.363c1.87,-0.146 3.715,-0.137 5.557,-0.11c0.172,-0.003 0.308,-0.171 0.304,-0.375c-0.045,-0.854 -0.062,-1.709 -0.05,-2.563Z",style:{fill:"none",stroke:"#fff",strokeWidth:.61}})]})}),Object(x.jsx)("div",{children:Object(x.jsx)("span",{className:"font-semibold text-xl tracking-tight pl-4 text-white",children:"Future Mundane"})}),Object(x.jsx)("div",{className:"w-full block flex-grow lg:flex lg:items-center lg:w-auto pl-10",children:Object(x.jsxs)("div",{className:"text-sm lg: flex-grow",children:[""!=o.trim()&&Object(x.jsx)("a",{onClick:t,className:"block mt-4 lg:inline-block lg:mt-0 text-white  hover:font-bold mr-4",children:"Start"}),""!=o.trim()&&Object(x.jsx)("a",{target:"_blank",href:encodeURI("/author?layers=".concat(o)),className:"block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4",children:"Edit"})]})}),Object(x.jsxs)("div",{className:"flex flex-col",children:[Object(x.jsx)("div",{className:"flex flex-row",children:n.map((function(e){var t=o==e?"font-bold":"font-normal";return Object(x.jsx)("a",{className:"p-2 text-white ".concat(t," text-xs"),style:{opacity:o==e?1:.6},href:encodeURI("?layers=".concat(e)),children:e},e)}))}),Object(x.jsxs)("div",{className:"flex flex-row justify-end",children:[Object(x.jsx)("a",{className:"p-2 text-xs font-bold text-white",onClick:c,children:"upload experience"}),Object(x.jsx)("a",{className:"p-2 text-xs font-bold text-white",onClick:r,children:"upload media"}),""!=o.trim()&&Object(x.jsx)("a",{className:"p-2 text-xs font-bold text-white",onClick:a,children:"export (twine)"}),""!=o.trim()&&Object(x.jsx)("a",{className:"p-2 text-xs font-bold text-white",onClick:i,children:"".concat(s?"[rendering...]":"render speech")})]})]})]})},V=n(28),X=n(38);function ee(e){var t=e.close,n=void 0===t?function(){}:t,r=e.success,a=void 0===r?function(){}:r,i=Object(c.useState)(""),s=Object(f.a)(i,2),o=s[0],l=(s[1],Object(c.useState)()),d=Object(f.a)(l,2),u=d[0],j=d[1],b=function(e){j(e.target.files[0])},h=function(){console.log(u);var e=new FormData;e.append("mediaFile",u,u.name),y.a.post("/media/upload").send(e).end((function(e,t){console.log(e,t),e||(j(void 0),a(u.name))}))};return Object(x.jsx)("div",{style:{width:350},children:Object(x.jsxs)("div",{className:"text-center shadow-lg flex flex-col",children:[Object(x.jsxs)("div",{className:"flex flex-col p-4 items-center",children:[Object(x.jsx)("input",{type:"file",name:"file",onChange:b}),Object(x.jsxs)("div",{className:"flex flex-row p-4 items-center",children:[u&&Object(x.jsx)("div",{onClick:h,className:"m-2 p-2 bg-blue-500 text-white",children:"upload"}),Object(x.jsx)("div",{onClick:n,className:"m-2 p-2 bg-blue-500 text-white",children:"CANCEL"})]})]}),o&&Object(x.jsx)("div",{className:"text-red-600 p-4 text-bold justify-center",children:o})]})})}function te(e){var t=e.close,n=void 0===t?function(){}:t,r=e.done,a=void 0===r?function(){}:r,i=Object(c.useState)(),s=Object(f.a)(i,2),o=s[0],l=s[1];return Object(x.jsx)("div",{className:"relative flex justify-end",children:Object(x.jsxs)("div",{className:"text-center shadow-lg flex flex-col",style:{width:400},children:[Object(x.jsx)("textarea",{className:"border border-black",rows:4,onChange:function(e){return l(e.target.value)},value:o}),Object(x.jsxs)("div",{className:"flex flex-row p-4 items-center justify-center",children:[Object(x.jsx)("div",{onClick:function(){return a(o)},className:"m-2 p-2 bg-blue-500 text-white",children:"set"}),Object(x.jsx)("div",{onClick:n,className:"m-2 p-2 bg-blue-500 text-white",children:"CANCEL"})]})]})})}function ne(e){return-1!=e.indexOf("/image")?"image":-1!=e.indexOf("/speech")?"speech":""}function ce(e,t){return re.apply(this,arguments)}function re(){return(re=Object(l.a)(o.a.mark((function e(t,n){var c,r;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y.a.get("/placeholders/set").query({key:t,value:n});case 2:c=e.sent,r=c.text,console.log(JSON.parse(r));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ae(e){var t=e.placeholders,n=void 0===t?{}:t,r=e.close,a=void 0===r?function(){}:r,i=Object(c.useState)({}),s=Object(f.a)(i,2),j=s[0],b=s[1],h=Object(c.useState)({}),p=Object(f.a)(h,2),m=p[0],O=p[1],v=function(){var e=Object(l.a)(o.a.mark((function e(){var t,n,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y.a.get("/placeholders/");case 2:t=e.sent,n=t.text,c=void 0===n?"{}":n,b(JSON.parse(c));case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Object(c.useEffect)((function(){v()}),[]);var g=function(e,t){O(Object(u.a)(Object(u.a)({},m),{},Object(d.a)({},"".concat(e).concat(t),!m["".concat(e).concat(t)])))},w=function(e,t){ce(e,t),v()},k=function(e,t,n){var c,r;switch(ne(e)){case"speech":return c=t,r=n,Object(x.jsxs)("div",{className:"flex flex-col pt-2",children:[Object(x.jsx)("div",{onClick:function(){return g(r,c)},className:"text-sm text-blue-500",children:"current text: ".concat(j[c]||"[empty]")}),m["".concat(r).concat(c)]&&Object(x.jsxs)("div",{children:[Object(x.jsxs)("div",{className:"p-4",children:[" ","set speech for"," ",Object(x.jsx)("strong",{children:c})," ","placeholder"]}),Object(x.jsx)(te,{close:function(){g(r,c)},done:function(e){g(r,c),w(c,e)}})]})]},c);case"image":return function(e,t){return Object(x.jsxs)("div",{className:"flex flex-col pt-2",children:[Object(x.jsxs)("div",{onClick:function(){return g(t,e)},className:"p-4 text-blue-500",children:[" ","upload image for"," ",Object(x.jsx)("strong",{children:e})," ","placeholder"]}),Object(x.jsx)("div",{children:Object(x.jsx)("img",{width:"100px",src:"assets/".concat(j[e])})}),m["".concat(t).concat(e)]&&Object(x.jsx)("div",{children:Object(x.jsx)(ee,{close:function(){g(t,e)},success:function(n){g(t,e),w(e,n)}})})]},e)}(t,n)}},N=function(e,t){var n=Object.keys(t).map((function(n){return t[n].map((function(t){return k(n,t,e)}))}));return Object(x.jsxs)("div",{children:[Object(x.jsx)("div",{className:"uppercase font-semibold",children:e}),n]})};return Object(x.jsx)("div",{className:"flex absolute",style:{top:80,left:0,width:"100vw",height:"calc(100vh - 80px)",background:"#ffffff99"},children:Object(x.jsxs)("div",{className:"bg-white flex flex-col p-4 shadow-lg",style:{width:400,overflowY:"auto",height:"calc(100vh - 100px)"},children:[Object(x.jsx)("div",{onClick:function(e){a()},className:"flex justify-end justify-items-end m-2 p-2 text-black",children:Object(x.jsx)("div",{className:"flex justify-center items-center bg-gray-600 text-white",style:{paddingBottom:5,width:20,height:20,borderRadius:10},children:"x"})}),Object(x.jsx)("div",{className:"text-lg font-semibold text-center w-full",children:"Manage Dynamic Content"}),Object.keys(n).map((function(e){var t=n[e];return Object(x.jsx)("div",{className:"p-4",children:N(e,t)},e)}))]})})}var ie={},se=function e(t){return t.reduce((function(t,n){return t.concat(Array.isArray(n)?e(n):n)}),[])},oe=function e(t){return se([{links:t.data.links,trigger:t.data.trigger,from:{name:t.data.id,x:ie[t.data.id].x,y:ie[t.data.id].y+60},to:(t.children||[]).map((function(e){return{trigger:e.data.trigger,name:e.data.id,x:ie[e.data.id].x,y:ie[e.data.id].y-60}}))}].concat(Object(h.a)((t.children||[]).map((function(t){return e(t)})))))},le=function e(t){var n=Object.keys(t.data.links||{}).reduce((function(e,n){var c=t.data.links[n];return Object(u.a)(Object(u.a)({},e),{},Object(d.a)({},c.rid,c))}),{});return Object(u.a)(Object(u.a)({},n),(t.children||[]).reduce((function(t,n){return Object(u.a)(Object(u.a)({},t),e(n))}),{}))},de=function(e,t,n,c){return Object(x.jsx)("path",{d:"M ".concat(e," ").concat(t," C ").concat((e+n)/2," ").concat(t,", ").concat((e+n)/2," ").concat(c,", ").concat(n," ").concat(c),style:{stroke:"#000",strokeWidth:"2",fill:"none"}})},ue=function(e,t,n,c){return Object(x.jsx)("path",{d:"M ".concat(e," ").concat(t," C ").concat(e," ").concat(t+60,", ").concat(e-120," ").concat(c+60,", ").concat(n," ").concat(c),style:{stroke:"#444",strokeWidth:"1",fill:"none"}})},fe=function(e){return e.from.y>e.to.y};var je=function(e){var t=c.useRef(),n=c.useState(!1),a=Object(f.a)(n,2),i=a[0],s=a[1],j=c.useState(!1),b=Object(f.a)(j,2),p=b[0],m=b[1],O=c.useState({}),v=Object(f.a)(O,2),g=v[0],w=v[1],k=c.useState({}),N=Object(f.a)(k,2),C=N[0],S=N[1],E=c.useState({}),R=Object(f.a)(E,2),A=R[0],M=R[1],L=function e(t){return Object.keys(t.data.placeholders||{}).length>0?Object(u.a)(Object(d.a)({},t.data.id,t.data.placeholders),(t.children||[]).reduce((function(t,n){return Object(u.a)(Object(u.a)({},t),e(n))}),{})):(t.children||[]).length>0?t.children.reduce((function(t,n){return Object(u.a)(Object(u.a)({},t),e(n))}),{}):{}},W=function(){var t=Object(l.a)(o.a.mark((function t(){var n,c,r;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,y.a.get("/placeholders/");case 2:n=t.sent,c=n.text,r=void 0===c?"{}":c,M(JSON.parse(r)),S(L(e));case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();c.useEffect((function(){W()}),[]),c.useEffect((function(){!function(){var n=V.a(t.current),c=ie[e.id]||{x:0,y:0},r=c.x,a=c.y,i=0,s=0,o=n.select("g#dragbox").attr("transform");if(o){var l=o.split(/\s+/)[0].replace("translate(","").replace(")","").split(","),d=Object(f.a)(l,2);i=d[0],s=d[1]}n.transition().duration(2e3).attr("transform","translate(".concat(-a-i+200,",").concat(-r-s+e.height/2,")"))}()}),[e]);var T=function(e,t){var n=r.a.useRef();return r.a.useEffect((function(){return e(V.a(n.current)),function(){}}),t),n}((function(e){var t=e.select("g#dragbox");e.call(X.a().on("zoom",(function(e){var n=e.transform,c=n.x,r=n.y;t.attr("transform","translate(".concat(c,",").concat(r,")"))})))}),[]),z=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};w(e),s(!i)},F=function(){m(!p)},q=function(e,t){return Object(x.jsx)("div",{onClick:z,className:"flex absolute justify-center items-center",style:{top:0,left:0,width:"100vw",height:"100vh",background:"#ffffff99"},children:Object(x.jsx)("div",{onClick:function(e){return e.stopPropagation()},className:"flex bg-white rounded shadow-lg border-4 border-gray-300 p-6",children:function(e,t){switch(ne(e)){case"speech":return function(e){return Object(x.jsxs)("div",{className:"flex flex-col justify-center items-center",children:[Object(x.jsx)("div",{className:"text-sm",children:A[e]}),Object(x.jsxs)("div",{className:"p-4",children:[" ","set speech for"," ",Object(x.jsx)("strong",{children:e})," ","placeholder"]}),Object(x.jsx)(te,{close:z,done:function(t){z(),ce(e,t)}})]})}(t);case"image":return function(e){return Object(x.jsxs)("div",{className:"flex flex-col justify-center items-center",children:[Object(x.jsxs)("div",{className:"p-4",children:[" ","upload image for"," ",Object(x.jsx)("strong",{children:e})," ","placeholder"]}),Object(x.jsx)("div",{children:Object(x.jsx)("img",{width:"400px",src:"assets/".concat(A[e])})}),Object(x.jsx)(ee,{close:z,success:function(t){z(),ce(e,t)}})]})}(t);default:return}}(e,t)})})};return ie={},function e(t){ie[t.data.id]||(ie[t.data.id]={x:t.x,y:t.y},(t.children||[]).map((function(t){return e(t)})))}(e),console.log(A),Object(x.jsxs)("div",{className:"text-black bg-gray-200 rounded bg-white overflow-hidden shadow-lg",children:[Object(x.jsxs)("svg",{ref:T,height:e.height,style:{width:"calc(100vw - 280px)"},children:[Object(x.jsx)("circle",{onClick:function(){!function(e,t){var n=V.a(e.current),c=ie[t.id]||{x:0,y:0},r=c.x,a=c.y,i=0,s=0,o=n.select("g#dragbox").attr("transform");if(o){var l=o.split(/\s+/)[0].replace("translate(","").replace(")","").split(","),d=Object(f.a)(l,2);i=d[0],s=d[1]}n.attr("transform","translate(".concat(-a-i+200,",").concat(-r-s+t.height/2,")"))}(t,e)},cx:50,cy:50,r:"10",fill:"white",strokeWidth:2,stroke:"#000"}),Object(x.jsx)("circle",{onClick:F,cx:80,cy:50,r:"10",fill:"#E91475",strokeWidth:2,stroke:"#000"}),Object(x.jsx)("g",{ref:t,transform:"translate(120,".concat(e.height/2,")"),children:Object(x.jsxs)("g",{id:"dragbox",children:[function(e,t){var n={};return e.map((function(e){return e.to.map((function(c){if(n["".concat(e.from.name,",").concat(c.name)])return Object(x.jsx)("g",{});n["".concat(e.from.name,",").concat(c.name)]=!0;var r=(c.x-e.from.x)/2,a=(Math.max(c.y,e.from.y)-Math.min(c.y,e.from.y))/2,i="middle",s=t[c.trigger],o=20+20*(s.actions.length-1),l=s.actions.map((function(e,t){return Object(x.jsxs)("text",{fontSize:"x-small",textAnchor:"middle",x:c.y+60,y:c.x-o+18*t,children:[" ",Object(h.a)(new Set(e.map((function(e){return e.action})))).join(",")]},e.map((function(e){return e.action})).join(","))})),d=s.rule,u=void 0===d?{}:d,f=u.operator||"",j=u.operand||[],b="".concat(f,", ").concat(j),p=Object(x.jsxs)("g",{children:[Object(x.jsx)("rect",{x:e.from.y-20+a,y:e.from.x-13+r,width:40,height:12,style:{fill:"#edf2f7"}}),fe({from:e.from,to:c})?Object(x.jsx)("text",{fontSize:"x-small",fontWeight:"bold",fill:"#000",opacity:"0.5",textAnchor:i,y:e.from.x+r-5+70,x:e.from.y+(c.y-e.from.y)/2,children:b}):Object(x.jsx)("text",{fontSize:"x-small",fontWeight:"bold",fill:"black",textAnchor:i,y:e.from.x+r-5,x:e.from.y+a,children:b})]});return Object(x.jsxs)("g",{children:[fe({from:e.from,to:c})?ue(e.from.y,e.from.x,c.y,c.x):de(e.from.y,e.from.x,c.y,c.x),p,l]},"".concat(c.x,",").concat(c.y))}))}))}(oe(e),le(e)),function e(t,n,c,r){var a=!1;if(ie[t.data.id].x===t.x&&ie[t.data.id].y==t.y){a=c?n===t.data.id:n==t.data.id;var i=t.data.placeholders,s=void 0===i?{}:i,o=Object.keys(s).length>0;return Object(x.jsxs)("g",{children:[Object(x.jsx)("rect",{onClick:function(){return r(t.data.id)},x:t.y-60,y:t.x-10,width:120,height:20,rx:10,style:{fill:a?"#4299e1":"white",stroke:"black"}}),Object(x.jsx)("text",{onClick:function(){return r(t.data.id)},textAnchor:"middle",fontSize:"x-small",x:t.y,y:t.x+4,children:t.data.name}),o&&Object(x.jsx)("circle",{onClick:function(){return z(s)},cx:t.y,cy:t.x-30,r:10,fill:"#E91475",stroke:"#000"}),(t.children||[]).map((function(t){return e(t,n,c,r)}))]},"".concat(t.x,",").concat(t.y))}}(e,e.id,e.triggered,e.handleClick)]})})]}),i&&Object.keys(g).map((function(e){return q(e,g[e])})),p&&Object(x.jsx)(ae,{placeholders:C,close:F})]})};function xe(){var e=window;return{width:e.innerWidth,height:e.innerHeight}}function be(e){var t=e.save,n=e.cancel,r=Object(j.b)(),a=Object(c.useState)({}),i=Object(f.a)(a,2),s=i[0],d=i[1],u=Object(c.useState)(""),b=Object(f.a)(u,2),h=b[0],p=b[1],m=Object(c.useState)(""),O=Object(f.a)(m,2),v=O[0],g=O[1],y=Object(c.useState)(),w=Object(f.a)(y,2),k=w[0],N=w[1],C=function(e){N(e.target.files[0])},S=function(){var e=new FileReader;e.readAsText(k,"UTF-8"),e.onload=function(e){try{d(JSON.parse(e.target.result))}catch(t){}}},E=function(){var e=Object(l.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,p(""),""!=v.trim()){e.next=5;break}return p("Please provide a name for this file"),e.abrupt("return");case 5:return e.next=7,t(v,s);case 7:r(U()),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),p("Error with JSON file, please correct and try again");case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}}();return Object(x.jsx)("div",{className:"relative flex justify-end",children:Object(x.jsxs)("div",{className:"text-center shadow-lg flex flex-col",children:[Object.keys(s).length>0&&Object(x.jsxs)("div",{className:"flex flex-col text-center p-4 items-center justify-center",children:[Object(x.jsx)("input",{value:v,onChange:function(e){return g(e.target.value)},type:"text",placeholder:"give it a name",className:"w-64 p-2 bg-gray-400"}),Object(x.jsxs)("div",{className:"flex flex-row justify-center items-center",children:[Object(x.jsx)("div",{onClick:E,className:"m-2 p-2 bg-blue-500 text-white",children:"IMPORT!"}),Object(x.jsx)("div",{onClick:n,className:"m-2 p-2 bg-blue-500 text-white",children:"CANCEL"})]})]}),Object.keys(s).length<=0&&Object(x.jsxs)("div",{className:"flex flex-row p-4 items-center",children:[Object(x.jsx)("input",{type:"file",name:"file",onChange:C}),k&&Object(x.jsx)("div",{onClick:S,className:"m-2 p-2 bg-blue-500 text-white",children:"upload"}),Object(x.jsx)("div",{onClick:n,className:"m-2 p-2 bg-blue-500 text-white",children:"CANCEL"})]}),h&&Object(x.jsx)("div",{className:"text-red-600 p-4 text-bold justify-center",children:h})]})})}function he(){var e=Object(j.c)(I),t=Object(j.c)(Z),n=Object(j.c)(P),r=Object(j.c)(D),a=Object(j.c)(H),i=Object(j.c)(_),s=Object(c.useState)({}),b=Object(f.a)(s,2),h=b[0],m=b[1],O=Object(c.useState)(!1),v=Object(f.a)(O,2),g=v[0],w=v[1],k=Object(c.useState)(!1),C=Object(f.a)(k,2),S=C[0],z=C[1],q=function(){var e=Object(c.useState)(xe()),t=Object(f.a)(e,2),n=t[0],r=t[1];return Object(c.useEffect)((function(){function e(){r(xe())}return window.addEventListener("resize",e),function(){return window.removeEventListener("resize",e)}}),[]),n}().height,B=Object(j.b)(),Y=function(e){w(void 0!=e?e:!g)},$=function(e){z(void 0!=e?e:!S)},G=Object(c.useState)("start"),V=Object(f.a)(G,2),X=(V[0],V[1]);Object(c.useEffect)((function(){var e="undefined"!==typeof window&&(window.SpeechRecognition||window.webkitSpeechRecognition||window.mozSpeechRecognition||window.msSpeechRecognition||window.oSpeechRecognition),t=e?new e:{start:function(){}};t.continous=!0,t.interimResults=!0,t.lang="en-US",B(U()),B((function(e,t){N.on("event",(function(t){e(T({transcript:""})),e(L({layerid:t.id,listening:!1})),e(M(t))})),N.on("ready",(function(t){var n=t.event,c=t.layer;e(T({transcript:""})),console.log("setting ready for inout",n,c),e(F(Object(d.a)({},c,!0))),"speech"===n.type&&e(L({layerid:c,listening:!0}))}))})),B((window,function(){var e=Object(l.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:N.on("action",function(){var e=Object(l.a)(o.a.mark((function e(t){var n,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=Object(p.a)(t);try{for(n.s();!(c=n.n()).done;)c.value}catch(r){n.e(r)}finally{n.f()}case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));var n,c=new URLSearchParams(window.location.search),r=Object.fromEntries(c.entries()).layers,a=void 0===r?null:r;a&&B((n=a,function(e,t){y.a.get("/event/layers").query({layer:n}).then((function(t){var c=t.body.map((function(e){return Object(u.a)(Object(u.a)({},e.tree),{},{layerid:e.layerid})}));console.log(c),e(A(n)),e(R(c))})).catch((function(e){console.log("error resetting events",e)}))}))}),[]);var te=function(e){m(Object(u.a)(Object(u.a)({},h),{},Object(d.a)({},e,!h[e])))},ne=function(e,t){B(function(e,t){return function(){y.a.get("/event/trigger").query({layer:e,node:t}).end((function(e,t){e&&console.log(e)}))}}(e,t))},ce=Object.keys(h).reduce((function(e,t){return 1==h[t]?e+1:e}),0),re=(q-54-(e.length-ce>0?280:0))/ce-4*e.length,ae=e.sort((function(e,t){return h[e.id]&&!h[t.id]?-1:h[t.id]&&!h[e.id]?1:0})).map((function(e,c){return Object(x.jsxs)("div",{className:"flex flex-row m-1",children:[Object(x.jsx)("div",{className:"flex w-64 justify-center overflow-visible",style:{height:h[e.id]?re-2:280},children:Object(x.jsx)(K,Object(u.a)({},Object(u.a)(Object(u.a)({},e),{},{ready:t[e.id]||!1,toggleTree:te})))}),h[e.id]&&Object(x.jsx)(je,Object(u.a)({},Object(u.a)(Object(u.a)({},n[e.id]),{},{handleClick:function(t){ne(e.id,t)},height:re,id:e.data.id,triggered:e.triggered})))]},e.id)})),ie=function(){var e=Object(l.a)(o.a.mark((function e(t,n){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y.a.post("/author/save").set("Content-Type","application/json").send({name:t,layer:n});case 2:Y(!1);case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();return Object(x.jsxs)("div",{children:[Object(x.jsx)(Q,{rendering:i,authored:r,start:function(){B(function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return function(t){y.a.get("/event/start").then((function(n){t(J()),t(W(n.body)),t(T({transcript:"",layerid:e}))})).catch((function(e){console.log("error resetting events",e)}))}}()),X("reset")},toggleCreate:Y,toggleUploadMedia:$,twineExport:function(){y.a.get("/author/translate").query({name:a}).then((function(e){var t=e.body.html,n="data:text/html;chatset=utf-8,".concat(encodeURIComponent(t)),c=document.createElement("a");c.href=n,c.download="".concat(a,".html"),c.click()}))},renderSpeech:function(){B(function(){var e=Object(l.a)(o.a.mark((function e(t,n){var c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=n().experience.layerName,t(E(!0)),e.next=4,y.a.get("/author/render").query({name:c});case 4:t(E(!1));case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}())}}),Object(x.jsx)("div",{className:"flex row mb-4 border-b-2 flex-wrap",children:ae}),g&&Object(x.jsx)("div",{className:"absolute right-0",style:{top:80},children:Object(x.jsx)(be,{save:function(e,t){return ie(e,t)},cancel:function(){return Y(!1)}})}),S&&Object(x.jsx)("div",{className:"absolute right-0",style:{top:80},children:Object(x.jsx)(ee,{close:function(){return $(!1)}})})]})}var pe=function(){return Object(x.jsx)("div",{className:"App",children:Object(x.jsx)("header",{className:"App-header",children:Object(x.jsx)(he,{})})})},me=Object(m.a)({reducer:{experience:Y}});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(Object(x.jsx)(r.a.StrictMode,{children:Object(x.jsx)(j.a,{store:me,children:Object(x.jsx)(pe,{})})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[146,1,2]]]);
//# sourceMappingURL=main.a7a60249.chunk.js.map