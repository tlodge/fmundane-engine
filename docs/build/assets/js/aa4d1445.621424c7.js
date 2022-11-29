"use strict";(self.webpackChunkfmundane_docs=self.webpackChunkfmundane_docs||[]).push([[883],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>c});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),d=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=d(e.components);return n.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),u=d(r),c=a,g=u["".concat(p,".").concat(c)]||u[c]||m[c]||l;return r?n.createElement(g,i(i({ref:t},s),{},{components:r})):n.createElement(g,i({ref:t},s))}));function c(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,i=new Array(l);i[0]=u;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var d=2;d<l;d++)i[d]=r[d];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},7861:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>m,frontMatter:()=>l,metadata:()=>o,toc:()=>d});var n=r(7462),a=(r(7294),r(3905));const l={sidebar_position:1},i="Screen driver",o={unversionedId:"drivers/screen",id:"drivers/screen",title:"Screen driver",description:"The screen driver has been added to overtime and is a little overloaded with functionality. It is the driver that displays stuff in the web browser (on the main screen in the caravan). The driver is split into server and clientYou can also run the client in dev mode using:",source:"@site/docs/drivers/screen.md",sourceDirName:"drivers",slug:"/drivers/screen",permalink:"/fmundane-engine/docs/drivers/screen",draft:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Caravan Drivers",permalink:"/fmundane-engine/docs/category/caravan-drivers"},next:{title:"Dyson driver",permalink:"/fmundane-engine/docs/drivers/dyson"}},p={},d=[],s={toc:d};function m(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"screen-driver"},"Screen driver"),(0,a.kt)("p",null,"The screen driver has been added to overtime and is a little overloaded with functionality. It is the driver that displays stuff in the web browser (on the main screen in the caravan). The driver is split into server and clientYou can also run the client in dev mode using:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"npm run start\n")),(0,a.kt)("p",null,"and when you are happy, run"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"npm run build\n")),(0,a.kt)("p",null,"Which will put the newly compiled files in the relevant directory for the server. To run the server, in the server directory just run"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"node main.js\n")),(0,a.kt)("p",null,"Then point your browser at ",(0,a.kt)("a",{parentName:"p",href:"http://localhost:9102/"},"http://localhost:9102")),(0,a.kt)("p",null,"The server communicates with the browser over web-sockets. It also communicates with the main engine over MQTT. By calling endpoints on the server, the content being displayed in the browser can be changed. The following is a list of possibilities:"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"th"},"endpoint")),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"th"},"method")),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"th"},"description")),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"th"},"params")))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/api/home"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Show the future mundane log on a black background"),(0,a.kt)("td",{parentName:"tr",align:null})),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/api/camera"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Stream the output from the browser webcam"),(0,a.kt)("td",{parentName:"tr",align:null})),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/api/camera/scan"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Show the output from the browser webcam and overlay face scan results"),(0,a.kt)("td",{parentName:"tr",align:null})),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/api/web"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Display arbitrary HTML"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},"snippet:")," name of an arbitrary bit of html. Stored in the screen","_","driver/server/public/snippets directory")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/api/media/play"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Play some media"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("ul",null,(0,a.kt)("li",null,(0,a.kt)("strong",{parentName:"td"},"media:")," name of a media file in the media directory"),(0,a.kt)("li",null," ",(0,a.kt)("strong",{parentName:"td"},"delay")," : number of milliseconds to wait before playing (defaults to 500).")))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/api/air"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Show the dyson air quality screen"),(0,a.kt)("td",{parentName:"tr",align:null})),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/api/qrcode"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Show a large qrcode on the screen"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},"qrcode:")," the url to be encoded as a qrcode.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/api/image"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Show an image, fullscreen"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},"image:")," the url of the image")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/api/message"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Flash up a message on the bottom of the screen for a few seconds"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"td"},"message:")," the message to display")))))}m.isMDXComponent=!0}}]);