var S=Object.defineProperty;var g=(e,t)=>{for(var o in t)S(e,o,{get:t[o],enumerable:!0})};var l=e=>{throw new Error("Not initialized yet")},f=typeof window>"u"&&typeof globalThis.WebSocketPair>"u";typeof Deno>"u"&&(self.Deno={args:[],build:{arch:"x86_64"},env:{get(){}}});var p=new Map,d=0;f&&(globalThis.syscall=async(e,...t)=>await new Promise((o,n)=>{d++,p.set(d,{resolve:o,reject:n}),l({type:"sys",id:d,name:e,args:t})}));function y(e,t,o){f&&(l=o,self.addEventListener("message",n=>{(async()=>{let i=n.data;switch(i.type){case"inv":{let c=e[i.name];if(!c)throw new Error(`Function not loaded: ${i.name}`);try{let s=await Promise.resolve(c(...i.args||[]));l({type:"invr",id:i.id,result:s})}catch(s){console.error("An exception was thrown as a result of invoking function",i.name,"error:",s.message),l({type:"invr",id:i.id,error:s.message})}}break;case"sysr":{let c=i.id,s=p.get(c);if(!s)throw Error("Invalid request id");p.delete(c),i.error?s.reject(new Error(i.error)):s.resolve(i.result)}break}})().catch(console.error)}),l({type:"manifest",manifest:t}))}function C(e){let t=atob(e),o=t.length,n=new Uint8Array(o);for(let i=0;i<o;i++)n[i]=t.charCodeAt(i);return n}function h(e){typeof e=="string"&&(e=new TextEncoder().encode(e));let t="",o=e.byteLength;for(let n=0;n<o;n++)t+=String.fromCharCode(e[n]);return btoa(t)}async function F(e,t){if(typeof e!="string"){let o=new Uint8Array(await e.arrayBuffer()),n=o.length>0?h(o):void 0;t={method:e.method,headers:Object.fromEntries(e.headers.entries()),base64Body:n},e=e.url}return syscall("sandboxFetch.fetch",e,t)}globalThis.nativeFetch=globalThis.fetch;function k(){globalThis.fetch=async function(e,t){let o=t&&t.body?h(new Uint8Array(await new Response(t.body).arrayBuffer())):void 0,n=await F(e,t&&{method:t.method,headers:t.headers,base64Body:o});return new Response(n.base64Body?C(n.base64Body):null,{status:n.status,headers:n.headers})}}f&&k();var a={};g(a,{confirm:()=>re,copyToClipboard:()=>pe,deleteLine:()=>fe,dispatch:()=>ee,downloadFile:()=>B,filterBox:()=>Q,flashNotification:()=>W,fold:()=>ie,foldAll:()=>ce,getCurrentPage:()=>M,getCursor:()=>T,getSelection:()=>R,getText:()=>$,getUiOption:()=>oe,goHistory:()=>j,hidePanel:()=>G,insertAtCursor:()=>Z,insertAtPos:()=>z,moveCursor:()=>J,moveCursorToLine:()=>X,navigate:()=>D,openCommandPalette:()=>q,openPageNavigator:()=>H,openSearchPanel:()=>de,openUrl:()=>I,prompt:()=>te,redo:()=>me,reloadConfigAndCommands:()=>L,reloadPage:()=>K,reloadUI:()=>_,replaceRange:()=>Y,save:()=>E,setSelection:()=>N,setText:()=>U,setUiOption:()=>ne,showPanel:()=>V,toggleFold:()=>ae,undo:()=>le,unfold:()=>se,unfoldAll:()=>ue,uploadFile:()=>O,vimEx:()=>ge});typeof self>"u"&&(self={syscall:()=>{throw new Error("Not implemented here")}});function r(e,...t){return globalThis.syscall(e,...t)}function M(){return r("editor.getCurrentPage")}function $(){return r("editor.getText")}function U(e){return r("editor.setText",e)}function T(){return r("editor.getCursor")}function R(){return r("editor.getSelection")}function N(e,t){return r("editor.setSelection",e,t)}function E(){return r("editor.save")}function D(e,t=!1,o=!1){return r("editor.navigate",e,t,o)}function H(e="page"){return r("editor.openPageNavigator",e)}function q(){return r("editor.openCommandPalette")}function K(){return r("editor.reloadPage")}function _(){return r("editor.reloadUI")}function L(){return r("editor.reloadConfigAndCommands")}function I(e,t=!1){return r("editor.openUrl",e,t)}function j(e){return r("editor.goHistory",e)}function B(e,t){return r("editor.downloadFile",e,t)}function O(e,t){return r("editor.uploadFile",e,t)}function W(e,t="info"){return r("editor.flashNotification",e,t)}function Q(e,t,o="",n=""){return r("editor.filterBox",e,t,o,n)}function V(e,t,o,n=""){return r("editor.showPanel",e,t,o,n)}function G(e){return r("editor.hidePanel",e)}function z(e,t){return r("editor.insertAtPos",e,t)}function Y(e,t,o){return r("editor.replaceRange",e,t,o)}function J(e,t=!1){return r("editor.moveCursor",e,t)}function X(e,t=1,o=!1){return r("editor.moveCursorToLine",e,t,o)}function Z(e){return r("editor.insertAtCursor",e)}function ee(e){return r("editor.dispatch",e)}function te(e,t=""){return r("editor.prompt",e,t)}function re(e){return r("editor.confirm",e)}function oe(e){return r("editor.getUiOption",e)}function ne(e,t){return r("editor.setUiOption",e,t)}function ie(){return r("editor.fold")}function se(){return r("editor.unfold")}function ae(){return r("editor.toggleFold")}function ce(){return r("editor.foldAll")}function ue(){return r("editor.unfoldAll")}function le(){return r("editor.undo")}function me(){return r("editor.redo")}function de(){return r("editor.openSearchPanel")}function pe(e){return r("editor.copyToClipboard",e)}function fe(){return r("editor.deleteLine")}function ge(e){return r("editor.vimEx",e)}var m={};g(m,{applyAttributeExtractors:()=>Ae,getEnv:()=>ke,getMode:()=>Me,getSpaceConfig:()=>Se,getVersion:()=>$e,invokeCommand:()=>xe,invokeFunction:()=>Pe,invokeSpaceFunction:()=>we,listCommands:()=>ve,listSyscalls:()=>be,reloadConfig:()=>Fe,reloadPlugs:()=>Ce});function Pe(e,...t){return r("system.invokeFunction",e,...t)}function xe(e,t){return r("system.invokeCommand",e,t)}function ve(){return r("system.listCommands")}function be(){return r("system.listSyscalls")}function we(e,...t){return r("system.invokeSpaceFunction",e,...t)}function Ae(e,t,o){return r("system.applyAttributeExtractors",e,t,o)}async function Se(e,t){return await r("system.getSpaceConfig",e)??t}function Ce(){return r("system.reloadPlugs")}function Fe(){return r("system.reloadConfig")}function ke(){return r("system.getEnv")}function Me(){return r("system.getMode")}function $e(){return r("system.getVersion")}async function P(){await a.hidePanel("lhs")}async function x(){let e=await a.prompt("Search Hacker News:");e&&await v(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(e)}`,`Hacker News Results for "${e}"`,`\u{1F50D} HN ${e}`)}async function v(e,t,o){if(!e){await a.flashNotification("Unable to fetch empty URL");return}if(!t){await a.flashNotification("Unknown Page Title","error");return}if(!o){await a.flashNotification("Unknown File","error");return}try{let n=await Be(e);if(n.length===0){await a.flashNotification(`No results for ${t}`,"info");return}let i=await m.getSpaceConfig("isHtml");if(console.log("isHtml",i,!!i),i){let c=n.map(s=>`- [\u{1F310} ${s.title} (${s.points} points)](${s.source_url}) - [\u{1F4AC} (${s.comment_count} points)](${s.url})`).join(`
`);await a.navigate({kind:"page",page:o}),await a.insertAtCursor(`
## ${t}
URI: [${e}](${e})
${c}
`)}else{let c=n.map(u=>`<br> <a href="${u.source_url}}">\u{1F310} ${u.title} (${u.points} points)</a> - <a href="${u.url}}">\u{1F4AC} (${u.comment_count} points)</a> `).join("<br>"),s=await a.getText();if(s){let u=s.split(`
`).length;await a.moveCursor(u)}console.log(`<h1 onclick="syscall('system.invokeFunction', 'hello.hide');"> ${t} \u274C </h1> <br> <h2>URI</h2>: <a href="${e}">${e}</a> ${c}`),await a.showPanel("lhs",1,`<h1 onclick="syscall('system.invokeFunction', 'hello.hide');"> ${t} \u274C </h1> <br> <h2>URI</h2>: <a href="${e}">${e}</a> ${c}`)}`${t}${e}${e}${output}`,await a.flashNotification(`${t} inserted!`,"info")}catch(n){return console.error("Error In searchAndSave:",n),await a.flashNotification(`Error getting ${t}!`,"error"),[]}}async function Be(e){if(!e)return[];try{let o=await(await fetch(`${e}`)).json();return console.log(o),await a.flashNotification(`There are ${o.nbHits} hits`,"info"),o.hits.map(n=>({title:n.title,url:`https://news.ycombinator.com/item?id=${n.objectID}`,points:n.points,comment_count:n.num_comments,source_url:n.url}))}catch(t){return console.error("Error fetching Hacker News data:",t),[]}}async function b(){let e=new Date().toISOString().split("T")[0];await v("https://hn.algolia.com/api/v1/search_by_date?tags=front_page",`\u{1F3C6} Front Page ${e}`,"Front Page")}var w={searchHackerNews:x,queryTopStories:b,hide:P},A={name:"hello",requiredPermissions:["fetch"],config:{"schema.config.properties":{maxResults:{type:null,nullable:!0,default:10},minPoints:{type:null,nullable:!0,default:10}}},functions:{searchHackerNews:{path:"sb-hacker-news.ts:searchHackerNews",command:{name:"HN Search"}},queryTopStories:{path:"sb-hacker-news.ts:frontPage",command:{name:"HN Front Page"}},hide:{path:"sb-hacker-news.ts:hide"}},assets:{}},bt={manifest:A,functionMapping:w};y(w,A,self.postMessage);export{bt as plug};
