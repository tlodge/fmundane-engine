"use strict";(self.webpackChunkfmundane_docs=self.webpackChunkfmundane_docs||[]).push([[1682],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>p});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=o.createContext({}),h=function(e){var t=o.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=h(e.components);return o.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},c=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),c=h(n),p=r,m=c["".concat(l,".").concat(p)]||c[p]||u[p]||a;return n?o.createElement(m,i(i({ref:t},d),{},{components:n})):o.createElement(m,i({ref:t},d))}));function p(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=c;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var h=2;h<a;h++)i[h]=n[h];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}c.displayName="MDXCreateElement"},3795:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>h});var o=n(7462),r=(n(7294),n(3905));const a={sidebar_position:15},i="Future work, fixes and improvements",s={unversionedId:"todo",id:"todo",title:"Future work, fixes and improvements",description:"This is a list of all of the things that could be improved given time.",source:"@site/docs/todo.md",sourceDirName:".",slug:"/todo",permalink:"/fmundane-engine/docs/todo",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/todo.md",tags:[],version:"current",sidebarPosition:15,frontMatter:{sidebar_position:15},sidebar:"tutorialSidebar",previous:{title:"Modifications to core Twine",permalink:"/fmundane-engine/docs/twine/mods"}},l={},h=[{value:"In the caravan",id:"in-the-caravan",level:2},{value:"Caravan network",id:"caravan-network",level:3},{value:"The arm / drawer / door",id:"the-arm--drawer--door",level:3},{value:"Future mundane software (WoZ, engine, drivers)",id:"future-mundane-software-woz-engine-drivers",level:2},{value:"Code tidy",id:"code-tidy",level:3},{value:"WoZ and moving between states",id:"woz-and-moving-between-states",level:3},{value:"Error reporting",id:"error-reporting",level:3},{value:"Hue lights",id:"hue-lights",level:3},{value:"Nanoleaf lights",id:"nanoleaf-lights",level:3},{value:"WoZ interface",id:"woz-interface",level:3},{value:"Future mundane authoring environment",id:"future-mundane-authoring-environment",level:2}],d={toc:h};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"future-work-fixes-and-improvements"},"Future work, fixes and improvements"),(0,r.kt)("p",null,"This is a list of all of the things that could be improved given time."),(0,r.kt)("h2",{id:"in-the-caravan"},"In the caravan"),(0,r.kt)("h3",{id:"caravan-network"},"Caravan network"),(0,r.kt)("p",null,"We have seen the local caravan network struggle with bandwidth. In areas where there is lots of interference the system slows right down. We have found, for example, having the go-pro on the network is one device too far. We have also found that when the apple mac (speech machine) is on the wireless network it can take a very long time for the speech commands to be transmitted to the mac, which throws out the timings of the experience. This is why the mac is now wired to the router ",(0,r.kt)("strong",{parentName:"p"},". At some point it may be worth looking to upgrade to a more performant router if the issues persist.")),(0,r.kt)("h3",{id:"the-arm--drawer--door"},"The arm / drawer / door"),(0,r.kt)("p",null,"This has consistently been problematic. Here is a list of issues and how they might be fixed."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Button press does not open the door")),(0,r.kt)("p",null,"We still see this from time to time, but we have found that once it works it continues to work. When it doesn't work, the working theory is that it's due to signal interference. We need to look at switching the door directly. Alternatively the new laser cutter control board that runs the motor that opens and closes the door has another motor output which could be used with another stepper motor that opens and closes the door (i.e. get rid of the system currently in place). This would be (in my opinion) much much more reliable!"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"The arm sometimes doesn't work")),(0,r.kt)("p",null,"As already mentioned, in the interests of getting the arm to work before a deployment we had to write a hack to get round a race condition issue. When the Lenovo boots up, it assigns addresses to the devices connected to its USB ports. However (probably dependent on what device it discovers first), it sometimes gives the arm address /dev/ttyUSB0 and at other times it gives it /dev/ttyUSB1. I'm not entirely convinced that it won't use numbers higher than this too. The fix has just been to write the Robot Arm commands to both outputs in parallel, so that it will work for the one that is connected and be disregarded by the other. Clearly this is not ideal. Instead the system should interrogate the port info, find out which one the arm is connected to and use that. Should be easy enough using a few linux system commands. Another option is to try and query the arm on various ports and if you get a response on one then you know it is the correct port. I briefly tried sending a serial command that should get a response (\"#1 QT\\r\"), but wasn't able to get one."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Drawer sometimes gets confused whether it's open or closed.")),(0,r.kt)("p",null,"The stepper motor that opens and closes the drawer is controlled using GCODE. Sometimes the stepper motor thinks that it is in one position (i.e. closed) when it is actually in the other. This tends to happen if the system is powered off when the drawer is open, for example. Need to get some system feedback to make sure that he driver and the controller and motor remain in sync."),(0,r.kt)("h2",{id:"future-mundane-software-woz-engine-drivers"},"Future mundane software (WoZ, engine, drivers)"),(0,r.kt)("h3",{id:"code-tidy"},"Code tidy"),(0,r.kt)("p",null,"There is a bunch of refactoring that could be done and basic tidying of the code \u2013 it has more or less developed as the project has so is overdue a first refactor."),(0,r.kt)("h3",{id:"woz-and-moving-between-states"},"WoZ and moving between states"),(0,r.kt)("p",null,"In general, the WoZ interface will only show a button for moving to a next state once all actions have completed. Actions are seen as completed once a request to an endpoint returns. There is one exception, video/media, which runs out of the browser and there is currently no neat way for the browser to feed back to the engine that the video has finished. We'd need to make it work by having the engine call the /play endpoint, the /play endpoint tell the browser to play a video, and then wait until the browser says the video is finished before returning. But having a long running query like this feels wrong, so some other notification system might be better."),(0,r.kt)("h3",{id:"error-reporting"},"Error reporting"),(0,r.kt)("p",null,"By default all drivers should be written with a /status endpoint that can be interrogated by the WoZ as a way of providing status updates and troubleshooting. The arm driver has this support but other drivers need it. Would also be good to stream the logs from /var/log/ooi to the WoZ for easy realtime debugging/feedback."),(0,r.kt)("h3",{id:"hue-lights"},"Hue lights"),(0,r.kt)("p",null,"Currently the lights API offers colour changes. It would be nice to have some higher level api calls that do things such as 'flicker', 'flash', 'fade up' \u2013 should be quite easy to add these in!"),(0,r.kt)("h3",{id:"nanoleaf-lights"},"Nanoleaf lights"),(0,r.kt)("p",null,"These sit under the caravan seats on the floor. They don't quite sync in colour with the hue lights. Double check the code that sets the colours and see if the formula is correct."),(0,r.kt)("h3",{id:"woz-interface"},"WoZ interface"),(0,r.kt)("p",null,"Lots of improvements could be made here. The motion between nodes is a little clunky. There need to be an option to manage the experiences that are available. There should be a standard 'testing' panel that allows a user to manually test all devices in the caravan."),(0,r.kt)("h2",{id:"future-mundane-authoring-environment"},"Future mundane authoring environment"),(0,r.kt)("p",null,"As noted \u2013 this is a modified version of Twine. Twine is great for some things, but it is still not a brilliant experience creating new experiences. A couple of things would hugely improve the authoring process."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Better timing support")),(0,r.kt)("p",null,"Twine is great for creating the branching paths, but we have found that a significant amount of authoring effort goes into coordinating times, making sure for example that the voice speaks at the right time when media is playing or that the lights change colour in sync with playing media and so on and so forth. Ideally what we want is an interface within each node (or in twine parlance \u2013 passage) that looks more like an audio/video editing track, i.e. where it's easy to click markers on a timeline to set when events need to happen."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Simulated run throughs")),(0,r.kt)("p",null,"There is currently no easy way to test an experience properly outside the caravan. Usually the thing that needs to be tested is the timing and the interplay between sensors. It would be great (and a really nice project) to write a Twine story-format that does this. In essence, once a user has created a bunch of passages they'd click on 'play' and all of the device actions would be simulated alongside the WoZ interface."))}u.isMDXComponent=!0}}]);