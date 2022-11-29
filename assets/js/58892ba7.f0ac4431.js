"use strict";(self.webpackChunkfmundane_docs=self.webpackChunkfmundane_docs||[]).push([[8982],{3905:(e,t,r)=>{r.d(t,{Zo:()=>m,kt:()=>c});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),d=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},m=function(e){var t=d(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,s=e.parentName,m=i(e,["components","mdxType","originalType","parentName"]),u=d(r),c=a,f=u["".concat(s,".").concat(c)]||u[c]||p[c]||l;return r?n.createElement(f,o(o({ref:t},m),{},{components:r})):n.createElement(f,o({ref:t},m))}));function c(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,o=new Array(l);o[0]=u;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var d=2;d<l;d++)o[d]=r[d];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},4573:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>p,frontMatter:()=>l,metadata:()=>i,toc:()=>d});var n=r(7462),a=(r(7294),r(3905));const l={sidebar_position:5},o="Smell driver",i={unversionedId:"drivers/smell",id:"drivers/smell",title:"Smell driver",description:"The smell code just runs directly on controllers (Feather M0) \u2013 the code for the controllers can be found at//github.com/tlodge/fmundane-arduino/blob/main/smell/air\\freshner\\v3.ino",source:"@site/docs/drivers/smell.md",sourceDirName:"drivers",slug:"/drivers/smell",permalink:"/fmundane-engine/docs/drivers/smell",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/drivers/smell.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Arm driver",permalink:"/fmundane-engine/docs/drivers/arm"},next:{title:"Window driver",permalink:"/fmundane-engine/docs/drivers/windows"}},s={},d=[],m={toc:d};function p(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"smell-driver"},"Smell driver"),(0,a.kt)("p",null,"The smell code just runs directly on controllers (Feather M0) \u2013 the code for the controllers can be found at: ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/tlodge/fmundane-arduino/blob/main/smell/air_freshner_v3.ino"},"https://github.com/tlodge/fmundane-arduino/blob/main/smell/air","_","freshner","_","v3.ino")),(0,a.kt)("p",null,"To smell controllers can be called as follows:"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"th"},"endpoint")),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"th"},"method")),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"th"},"description")),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("strong",{parentName:"th"},"params")))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/on1"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Set smell fan on at low speed"),(0,a.kt)("td",{parentName:"tr",align:null})),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/on1"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Set smell fan on at medium speed"),(0,a.kt)("td",{parentName:"tr",align:null})),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/on1"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Set smell fan on at high speed"),(0,a.kt)("td",{parentName:"tr",align:null})),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"/off"),(0,a.kt)("td",{parentName:"tr",align:null},"GET"),(0,a.kt)("td",{parentName:"tr",align:null},"Turn off the fan"),(0,a.kt)("td",{parentName:"tr",align:null})))))}p.isMDXComponent=!0}}]);