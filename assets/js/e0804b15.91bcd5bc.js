"use strict";(self.webpackChunkfmundane_docs=self.webpackChunkfmundane_docs||[]).push([[7916],{3905:(e,r,n)=>{n.d(r,{Zo:()=>u,kt:()=>f});var t=n(7294);function i(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function a(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){i(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function c(e,r){if(null==e)return{};var n,t,i=function(e,r){if(null==e)return{};var n,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(i[n]=e[n]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=t.createContext({}),l=function(e){var r=t.useContext(s),n=r;return e&&(n="function"==typeof e?e(r):a(a({},r),e)),n},u=function(e){var r=l(e.components);return t.createElement(s.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=l(n),f=i,m=d["".concat(s,".").concat(f)]||d[f]||p[f]||o;return n?t.createElement(m,a(a({ref:r},u),{},{components:n})):t.createElement(m,a({ref:r},u))}));function f(e,r){var n=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=d;var c={};for(var s in r)hasOwnProperty.call(r,s)&&(c[s]=r[s]);c.originalType=e,c.mdxType="string"==typeof e?e:i,a[1]=c;for(var l=2;l<o;l++)a[l]=n[l];return t.createElement.apply(null,a)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7244:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>s,contentTitle:()=>a,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>l});var t=n(7462),i=(n(7294),n(3905));const o={sidebar_position:7},a="Miniscreen driver",c={unversionedId:"drivers/miniscreen",id:"drivers/miniscreen",title:"Miniscreen driver",description:"As with the screen driver, but runs on the small HDMI screens. Since they run of Pis, they're not connected to cameras so /api/camera and /api/camera/scan won't work.",source:"@site/docs/drivers/miniscreen.md",sourceDirName:"drivers",slug:"/drivers/miniscreen",permalink:"/fmundane-engine/docs/drivers/miniscreen",draft:!1,tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"tutorialSidebar",previous:{title:"Nanoleaf driver",permalink:"/fmundane-engine/docs/drivers/nanoleaf"},next:{title:"Media driver",permalink:"/fmundane-engine/docs/drivers/media"}},s={},l=[],u={toc:l};function p(e){let{components:r,...n}=e;return(0,i.kt)("wrapper",(0,t.Z)({},u,n,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"miniscreen-driver"},"Miniscreen driver"),(0,i.kt)("p",null,"As with the screen driver, but runs on the small HDMI screens. Since they run of Pis, they're not connected to cameras so /api/camera and /api/camera/scan won't work."))}p.isMDXComponent=!0}}]);