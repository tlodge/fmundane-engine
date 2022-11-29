"use strict";(self.webpackChunkfmundane_docs=self.webpackChunkfmundane_docs||[]).push([[8744],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>h});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=o.createContext({}),c=function(e){var t=o.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=c(e.components);return o.createElement(u.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,u=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=c(n),h=r,p=d["".concat(u,".").concat(h)]||d[h]||f[h]||a;return n?o.createElement(p,i(i({ref:t},l),{},{components:n})):o.createElement(p,i({ref:t},l))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var u in t)hasOwnProperty.call(t,u)&&(s[u]=t[u]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},5261:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>f,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var o=n(7462),r=(n(7294),n(3905));const a={sidebar_position:1},i="No Wizard of Oz interface",s={unversionedId:"troubleshooting/wizard-of-oz",id:"troubleshooting/wizard-of-oz",title:"No Wizard of Oz interface",description:"The WoZ interface should be found at http3001/ If you are not getting anything, first double check that your machine is on the caravan network. If you are on the caravan network and see nothing then check to see if you can get the interface running on the actual Lenovo machine. Click on the browser in the Lenvo, open a tab and go to 127.0.0.1:3001. If you see something then the problem is with your machine and the network (or perhaps the browser \u2013 maybe try a different browser). If you do not see anything then the server software is not running (unlikely as we have not seen this before). Have a look at `/var/log/fmundane.log` and `/var/log/fmundane.err` to see if it has errored.",source:"@site/docs/troubleshooting/wizard-of-oz.md",sourceDirName:"troubleshooting",slug:"/troubleshooting/wizard-of-oz",permalink:"/docs/troubleshooting/wizard-of-oz",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/troubleshooting/wizard-of-oz.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Try this first",permalink:"/docs/troubleshooting/first"},next:{title:"The door, drawer and arm",permalink:"/docs/troubleshooting/arm"}},u={},c=[{value:"WoZ interface runs, but after clicking on a button, the buttons disappear and the system doesn&#39;t move on",id:"woz-interface-runs-but-after-clicking-on-a-button-the-buttons-disappear-and-the-system-doesnt-move-on",level:3},{value:"WoZ interface runs, but events don&#39;t seem to fire",id:"woz-interface-runs-but-events-dont-seem-to-fire",level:3}],l={toc:c};function f(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"no-wizard-of-oz-interface"},"No Wizard of Oz interface"),(0,r.kt)("p",null,"The WoZ interface should be found at ",(0,r.kt)("a",{parentName:"p",href:"http://192.168.1.204:3001/"},"http://192.168.1.204:3001/")," If you are not getting anything, first double check that your machine is on the caravan network. If you are on the caravan network and see nothing then check to see if you can get the interface running on the actual Lenovo machine. Click on the browser in the Lenvo, open a tab and go to 127.0.0.1:3001. If you see something then the problem is with your machine and the network (or perhaps the browser \u2013 maybe try a different browser). If you do not see anything then the server software is not running (unlikely as we have not seen this before). Have a look at ",(0,r.kt)("inlineCode",{parentName:"p"},"/var/log/fmundane.log")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"/var/log/fmundane.err")," to see if it has errored."),(0,r.kt)("h3",{id:"woz-interface-runs-but-after-clicking-on-a-button-the-buttons-disappear-and-the-system-doesnt-move-on"},"WoZ interface runs, but after clicking on a button, the buttons disappear and the system doesn't move on"),(0,r.kt)("p",null,"In most cases, the interface will not allow you to move onto the next state until the actions that it needs to perform have finished (i.e. the actions specified in the onstart part of the experience file). If, then a device endpoint is being called and is hanging or not returning success when it should, then the WoZ interface won't let you move on."),(0,r.kt)("h3",{id:"woz-interface-runs-but-events-dont-seem-to-fire"},"WoZ interface runs, but events don't seem to fire"),(0,r.kt)("p",null,"If events are not firing - check you have mqtt running!"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"docker ps\n")),(0,r.kt)("p",null,"(and look for mosquitto) if not there do a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"docker ps -a\n")),(0,r.kt)("p",null,"and see if it has quit. To start a new instance do a:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"sudo docker run -it --name mosquitto -p 1883:1883 eclipse-mosquitto:1.6\n")))}f.isMDXComponent=!0}}]);