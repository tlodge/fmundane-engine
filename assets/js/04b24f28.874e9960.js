"use strict";(self.webpackChunkfmundane_docs=self.webpackChunkfmundane_docs||[]).push([[4826],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(n),m=i,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||o;return n?r.createElement(f,a(a({ref:t},u),{},{components:n})):r.createElement(f,a({ref:t},u))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,a[1]=s;for(var c=2;c<o;c++)a[c]=n[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},69:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>p,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=n(7462),i=(n(7294),n(3905));const o={sidebar_position:2},a="Modifications to core Twine",s={unversionedId:"twine/mods",id:"twine/mods",title:"Modifications to core Twine",description:"These are the places in the src tree where modifications have been made to core twine",source:"@site/docs/twine/mods.md",sourceDirName:"twine",slug:"/twine/mods",permalink:"/docs/twine/mods",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/twine/mods.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Overview",permalink:"/docs/twine/overview"},next:{title:"Future work, fixes and improvements",permalink:"/docs/todo"}},l={},c=[{value:"Building for static twine site (i.e. on github pages)",id:"building-for-static-twine-site-ie-on-github-pages",level:2}],u={toc:c};function p(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"modifications-to-core-twine"},"Modifications to core Twine"),(0,i.kt)("p",null,"These are the places in the src tree where modifications have been made to core twine"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"src/components/rules ")),(0,i.kt)("p",null,"the files that deal with the rule creation interface"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"src/components/onstart ")),(0,i.kt)("p",null,"the files that deal with the onstart creation interface"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"src/util/caravan ")),(0,i.kt)("p",null,"the code that translated between twine and the format required by the future mundane state machine"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"src/routes/story-list/toolbar/story/export-stories-button ")),(0,i.kt)("p",null,"the code for the ui that handles exporting to the caravan"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"src/routes/story-list/toolbar/story/story-actions")),(0,i.kt)("p",null,"downloads and attempts to export to caravan: "),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"await request.post('/author/save').set('Content-Type', 'application/json').send({name,layer:_stories});")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"NB - not using choosetype anymore as this is selected in the rules interface ")),(0,i.kt)("h2",{id:"building-for-static-twine-site-ie-on-github-pages"},"Building for static twine site (i.e. on github pages)"),(0,i.kt)("p",null,"Run the following:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"npm run build:web\n")),(0,i.kt)("p",null,"This will build minimised files in dist and copy them to the ../twineweb directory.  The twineweb directory is the dirstibution of a static twine web site that can be hosted on, for example github pages.  To push to github pages:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"cd ../twineweb\ngit add .\ngit commit -m 'my commit message'\ngit push\n")))}p.isMDXComponent=!0}}]);