(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();var Y,Te;class ct extends Error{}ct.prototype.name="InvalidTokenError";function Ys(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let r=e.charCodeAt(0).toString(16).toUpperCase();return r.length<2&&(r="0"+r),"%"+r}))}function Gs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ys(t)}catch{return atob(t)}}function as(i,t){if(typeof i!="string")throw new ct("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,r=i.split(".")[e];if(typeof r!="string")throw new ct(`Invalid token specified: missing part #${e+1}`);let s;try{s=Gs(r)}catch(n){throw new ct(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(s)}catch(n){throw new ct(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Zs="mu:context",ee=`${Zs}:change`;class Qs{constructor(t,e){this._proxy=Xs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ls extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Qs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ee,t),t}detach(t){this.removeEventListener(ee,t)}}function Xs(i,t){return new Proxy(i,{get:(r,s,n)=>{if(s==="then")return;const o=Reflect.get(r,s,n);return console.log(`Context['${s}'] => `,o),o},set:(r,s,n,o)=>{const l=i[s];console.log(`Context['${s.toString()}'] <= `,n);const a=Reflect.set(r,s,n,o);if(a){let d=new CustomEvent(ee,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:s,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${s}] was not set to ${n}`);return a}})}function tr(i,t){const e=hs(t,i);return new Promise((r,s)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>r(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function hs(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const r=t.closest(e);if(r)return r;const s=t.getRootNode();if(s instanceof ShadowRoot)return hs(i,s.host)}class er extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function cs(i="mu:message"){return(t,...e)=>t.dispatchEvent(new er(e,i))}class oe{constructor(t,e,r="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=r,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const r=e.detail;this.consume(r)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function sr(i){return t=>({...t,...i})}const se="mu:auth:jwt",us=class ds extends oe{constructor(t,e){super((r,s)=>this.update(r,s),t,ds.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:r,redirect:s}=t[1];return e(ir(r)),Yt(s);case"auth/signout":return e(nr()),Yt(this._redirectForLogin);case"auth/redirect":return Yt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};us.EVENT_TYPE="auth:message";let ps=us;const fs=cs(ps.EVENT_TYPE);function Yt(i,t={}){if(!i)return;const e=window.location.href,r=new URL(i,e);return Object.entries(t).forEach(([s,n])=>r.searchParams.set(s,n)),()=>{console.log("Redirecting to ",i),window.location.assign(r)}}class rr extends ls{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=tt.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ps(this.context,this.redirect).attach(this)}}class ft{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(se),t}}class tt extends ft{constructor(t){super();const e=as(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new tt(t);return localStorage.setItem(se,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(se);return t?tt.authenticate(t):new ft}}function ir(i){return sr({user:tt.authenticate(i),token:i})}function nr(){return i=>{const t=i.user;return{user:t&&t.authenticated?ft.deauthenticate(t):t,token:""}}}function or(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function ar(i){return i.authenticated?as(i.token||""):{}}const lr=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:tt,Provider:rr,User:ft,dispatch:fs,headers:or,payload:ar},Symbol.toStringTag,{value:"Module"}));function re(i,t,e){const r=i.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,s),r.dispatchEvent(s),i.stopPropagation()}function Re(i,t="*"){return i.composedPath().find(r=>{const s=r;return s.tagName&&s.matches(t)})}function ms(i,...t){const e=i.map((s,n)=>n?[t[n-1],s]:[s]).flat().join("");let r=new CSSStyleSheet;return r.replaceSync(e),r}const hr=new DOMParser;function I(i,...t){const e=t.map(l),r=i.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),s=hr.parseFromString(r,"text/html"),n=s.head.childElementCount?s.head.children:s.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ue(a);case"bigint":case"boolean":case"number":case"symbol":return Ue(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ue(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function It(i,t={mode:"open"}){const e=i.attachShadow(t),r={template:s,styles:n};return r;function s(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),r}function n(...o){e.adoptedStyleSheets=o}}Y=class extends HTMLElement{constructor(){super(),this._state={},It(this).template(Y.template).styles(Y.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,r=t.value;e&&(this._state[e]=r)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),re(i,"mu-form:submit",this._state)})}set init(i){this._state=i||{},cr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}},Y.template=I`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,Y.styles=ms`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function cr(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;case"date":o.value=s.toISOString().substr(0,10);break;default:o.value=s;break}}}return i}const gs=class ys extends oe{constructor(t){super((e,r)=>this.update(e,r),t,ys.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:r,state:s}=t[1];e(dr(r,s));break}case"history/redirect":{const{href:r,state:s}=t[1];e(pr(r,s));break}}}};gs.EVENT_TYPE="history:message";let ae=gs;class Ne extends ls{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ur(t);if(e){const r=new URL(e.href);r.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),le(e,"history/navigate",{href:r.pathname+r.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ae(this.context).attach(this)}}function ur(i){const t=i.currentTarget,e=r=>r.tagName=="A"&&r.href;if(i.button===0)if(i.composed){const s=i.composedPath().find(e);return s||void 0}else{for(let r=i.target;r;r===t?null:r.parentElement)if(e(r))return r;return}}function dr(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function pr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const le=cs(ae.EVENT_TYPE),fr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ne,Provider:Ne,Service:ae,dispatch:le},Symbol.toStringTag,{value:"Module"}));class D{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,r)=>{if(this._provider){const s=new Me(this._provider,t);this._effects.push(s),e(s)}else tr(this._target,this._contextLabel).then(s=>{const n=new Me(s,t);this._provider=s,this._effects.push(n),s.attach(o=>this._handleChange(o)),e(n)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Me{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const vs=class _s extends HTMLElement{constructor(){super(),this._state={},this._user=new ft,this._authObserver=new D(this,"blazing:auth"),It(this).template(_s.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",r=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;mr(s,this._state,e,this.authorization).then(n=>ot(n,this)).then(n=>{const o=`mu-rest-form:${r}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[r]:n,url:s}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:s,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const r=e.name,s=e.value;r&&(this._state[r]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ot(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Le(this.src,this.authorization).then(e=>{this._state=e,ot(e,this)}))})}attributeChangedCallback(t,e,r){switch(t){case"src":this.src&&r&&r!==e&&!this.isNew&&Le(this.src,this.authorization).then(s=>{this._state=s,ot(s,this)});break;case"new":r&&(this._state={},ot({},this));break}}};vs.observedAttributes=["src","new","action"];vs.template=I`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Le(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function ot(i,t){const e=Object.entries(i);for(const[r,s]of e){const n=t.querySelector(`[name="${r}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!s;break;default:o.value=s;break}}}return i}function mr(i,t,e="PUT",r={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...r},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const gr=class $s extends oe{constructor(t,e){super(e,t,$s.EVENT_TYPE,!1)}};gr.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,he=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ce=Symbol(),je=new WeakMap;let bs=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==ce)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(he&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=je.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&je.set(e,t))}return t}toString(){return this.cssText}};const yr=i=>new bs(typeof i=="string"?i:i+"",void 0,ce),vr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new bs(e,i,ce)},_r=(i,t)=>{if(he)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Pt.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},He=he?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return yr(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$r,defineProperty:br,getOwnPropertyDescriptor:wr,getOwnPropertyNames:Ar,getOwnPropertySymbols:Er,getPrototypeOf:Sr}=Object,et=globalThis,Ie=et.trustedTypes,xr=Ie?Ie.emptyScript:"",ze=et.reactiveElementPolyfillSupport,ut=(i,t)=>i,Ot={toAttribute(i,t){switch(t){case Boolean:i=i?xr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ue=(i,t)=>!$r(i,t),De={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),et.litPropertyMetadata??(et.litPropertyMetadata=new WeakMap);let Z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=De){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&br(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=wr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return s==null?void 0:s.call(this)},set(o){const l=s==null?void 0:s.call(this);n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??De}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Sr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,r=[...Ar(e),...Er(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(He(s))}else t!==void 0&&e.push(He(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _r(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,s);if(n!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Ot).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,n=s._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=s.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:Ot;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??ue)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const r=this._$AL;try{e=this.shouldUpdate(r),e?(this.willUpdate(r),(t=this._$EO)==null||t.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(r)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(r)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[ut("elementProperties")]=new Map,Z[ut("finalized")]=new Map,ze==null||ze({ReactiveElement:Z}),(et.reactiveElementVersions??(et.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Rt=Tt.trustedTypes,qe=Rt?Rt.createPolicy("lit-html",{createHTML:i=>i}):void 0,ws="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,As="?"+P,kr=`<${As}>`,q=document,mt=()=>q.createComment(""),gt=i=>i===null||typeof i!="object"&&typeof i!="function",de=Array.isArray,Pr=i=>de(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Gt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Be=/-->/g,Fe=/>/g,M=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ve=/'/g,We=/"/g,Es=/^(?:script|style|textarea|title)$/i,Cr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),lt=Cr(1),st=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Je=new WeakMap,j=q.createTreeWalker(q,129);function Ss(i,t){if(!de(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(t):t}const Or=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=at;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,h=0;for(;h<a.length&&(o.lastIndex=h,f=o.exec(a),f!==null);)h=o.lastIndex,o===at?f[1]==="!--"?o=Be:f[1]!==void 0?o=Fe:f[2]!==void 0?(Es.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=M):f[3]!==void 0&&(o=M):o===M?f[0]===">"?(o=s??at,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?M:f[3]==='"'?We:Ve):o===We||o===Ve?o=M:o===Be||o===Fe?o=at:(o=M,s=void 0);const c=o===M&&i[l+1].startsWith("/>")?" ":"";n+=o===at?a+kr:u>=0?(r.push(d),a.slice(0,u)+ws+a.slice(u)+P+c):a+P+(u===-2?l:c)}return[Ss(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};let ie=class xs{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Or(t,e);if(this.el=xs.createElement(d,r),j.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=j.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(ws)){const h=f[o++],c=s.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(h);a.push({type:1,index:n,name:p[2],strings:c,ctor:p[1]==="."?Rr:p[1]==="?"?Ur:p[1]==="@"?Nr:zt}),s.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(Es.test(s.tagName)){const u=s.textContent.split(P),h=u.length-1;if(h>0){s.textContent=Rt?Rt.emptyScript:"";for(let c=0;c<h;c++)s.append(u[c],mt()),j.nextNode(),a.push({type:2,index:++n});s.append(u[h],mt())}}}else if(s.nodeType===8)if(s.data===As)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const r=q.createElement("template");return r.innerHTML=t,r}};function rt(i,t,e=i,r){var s,n;if(t===st)return t;let o=r!==void 0?(s=e.o)==null?void 0:s[r]:e.l;const l=gt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,r)),r!==void 0?(e.o??(e.o=[]))[r]=o:e.l=o),o!==void 0&&(t=rt(i,o._$AS(i,t.values),o,r)),t}class Tr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??q).importNode(e,!0);j.currentNode=s;let n=j.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new At(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Mr(n,this,t)),this._$AV.push(d),a=r[++l]}o!==(a==null?void 0:a.index)&&(n=j.nextNode(),o++)}return j.currentNode=q,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class At{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,r,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),gt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){var e;const{values:r,_$litType$:s}=t,n=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=ie.createElement(Ss(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(r);else{const o=new Tr(n,this),l=o.u(this.options);o.p(r),this.T(l),this._$AH=o}}_$AC(t){let e=Je.get(t.strings);return e===void 0&&Je.set(t.strings,e=new ie(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new At(this.O(mt()),this.O(mt()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=rt(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==st,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=rt(this,l[r+a],e,a),d===st&&(d=this._$AH[a]),o||(o=!gt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Rr extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Ur extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Nr extends zt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??$)===st)return;const r=this._$AH,s=t===$&&r!==$||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==$&&(r===$||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Mr{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}}const Ke=Tt.litHtmlPolyfillSupport;Ke==null||Ke(ie,At),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.2.0");const Lr=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new At(t.insertBefore(mt(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let X=class extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Lr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return st}};X._$litElement$=!0,X.finalized=!0,(Te=globalThis.litElementHydrateSupport)==null||Te.call(globalThis,{LitElement:X});const Ye=globalThis.litElementPolyfillSupport;Ye==null||Ye({LitElement:X});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jr={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:ue},Hr=(i=jr,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function ks(i){return(t,e)=>typeof e=="object"?Hr(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ps(i){return ks({...i,state:!0,attribute:!1})}function Ir(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function zr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Cs={};(function(i){var t=function(){var e=function(u,h,c,p){for(c=c||{},p=u.length;p--;c[u[p]]=h);return c},r=[1,9],s=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(h,c,p,g,m,v,Ft){var E=v.length-1;switch(m){case 1:return new g.Root({},[v[E-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[E-1],v[E]]);break;case 4:case 5:this.$=v[E];break;case 6:this.$=new g.Literal({value:v[E]});break;case 7:this.$=new g.Splat({name:v[E]});break;case 8:this.$=new g.Param({name:v[E]});break;case 9:this.$=new g.Optional({},[v[E-1]]);break;case 10:this.$=h;break;case 11:case 12:this.$=h.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:r,13:s,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:r,12:[1,16],13:s,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(h,c){if(c.recoverable)this.trace(h);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(h,c)}},parse:function(h){var c=this,p=[0],g=[null],m=[],v=this.table,Ft="",E=0,Pe=0,Vs=2,Ce=1,Ws=m.slice.call(arguments,1),_=Object.create(this.lexer),U={yy:{}};for(var Vt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Vt)&&(U.yy[Vt]=this.yy[Vt]);_.setInput(h,U.yy),U.yy.lexer=_,U.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Wt=_.yylloc;m.push(Wt);var Js=_.options&&_.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ks=function(){var K;return K=_.lex()||Ce,typeof K!="number"&&(K=c.symbols_[K]||K),K},w,N,S,Jt,J={},xt,x,Oe,kt;;){if(N=p[p.length-1],this.defaultActions[N]?S=this.defaultActions[N]:((w===null||typeof w>"u")&&(w=Ks()),S=v[N]&&v[N][w]),typeof S>"u"||!S.length||!S[0]){var Kt="";kt=[];for(xt in v[N])this.terminals_[xt]&&xt>Vs&&kt.push("'"+this.terminals_[xt]+"'");_.showPosition?Kt="Parse error on line "+(E+1)+`:
`+_.showPosition()+`
Expecting `+kt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Kt="Parse error on line "+(E+1)+": Unexpected "+(w==Ce?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Kt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Wt,expected:kt})}if(S[0]instanceof Array&&S.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+w);switch(S[0]){case 1:p.push(w),g.push(_.yytext),m.push(_.yylloc),p.push(S[1]),w=null,Pe=_.yyleng,Ft=_.yytext,E=_.yylineno,Wt=_.yylloc;break;case 2:if(x=this.productions_[S[1]][1],J.$=g[g.length-x],J._$={first_line:m[m.length-(x||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(x||1)].first_column,last_column:m[m.length-1].last_column},Js&&(J._$.range=[m[m.length-(x||1)].range[0],m[m.length-1].range[1]]),Jt=this.performAction.apply(J,[Ft,Pe,E,U.yy,S[1],g,m].concat(Ws)),typeof Jt<"u")return Jt;x&&(p=p.slice(0,-1*x*2),g=g.slice(0,-1*x),m=m.slice(0,-1*x)),p.push(this.productions_[S[1]][0]),g.push(J.$),m.push(J._$),Oe=v[p[p.length-2]][p[p.length-1]],p.push(Oe);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(c,p){if(this.yy.parser)this.yy.parser.parseError(c,p);else throw new Error(c)},setInput:function(h,c){return this.yy=c||this.yy||{},this._input=h,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var h=this._input[0];this.yytext+=h,this.yyleng++,this.offset++,this.match+=h,this.matched+=h;var c=h.match(/(?:\r\n?|\n).*/g);return c?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),h},unput:function(h){var c=h.length,p=h.split(/(?:\r\n?|\n)/g);this._input=h+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-c),this.offset-=c;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-c},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-c]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(h){this.unput(this.match.slice(h))},pastInput:function(){var h=this.matched.substr(0,this.matched.length-this.match.length);return(h.length>20?"...":"")+h.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var h=this.match;return h.length<20&&(h+=this._input.substr(0,20-h.length)),(h.substr(0,20)+(h.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var h=this.pastInput(),c=new Array(h.length+1).join("-");return h+this.upcomingInput()+`
`+c+"^"},test_match:function(h,c){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=h[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+h[0].length},this.yytext+=h[0],this.match+=h[0],this.matches=h,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(h[0].length),this.matched+=h[0],p=this.performAction.call(this,this.yy,this,c,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var h,c,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(p=this._input.match(this.rules[m[v]]),p&&(!c||p[0].length>c[0].length)){if(c=p,g=v,this.options.backtrack_lexer){if(h=this.test_match(p,m[v]),h!==!1)return h;if(this._backtrack){c=!1;continue}else return!1}else if(!this.options.flex)break}return c?(h=this.test_match(c,m[g]),h!==!1?h:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var c=this.next();return c||this.lex()},begin:function(c){this.conditionStack.push(c)},popState:function(){var c=this.conditionStack.length-1;return c>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(c){return c=this.conditionStack.length-1-Math.abs(c||0),c>=0?this.conditionStack[c]:"INITIAL"},pushState:function(c){this.begin(c)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(c,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof zr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Cs);function G(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Os={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},Ts=Cs.parser;Ts.yy=Os;var Dr=Ts,qr=Object.keys(Os);function Br(i){return qr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Rs=Br,Fr=Rs,Vr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Us(i){this.captures=i.captures,this.re=i.re}Us.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(r,s){typeof t[s+1]>"u"?e[r]=void 0:e[r]=decodeURIComponent(t[s+1])}),e};var Wr=Fr({Concat:function(i){return i.children.reduce((function(t,e){var r=this.visit(e);return{re:t.re+r.re,captures:t.captures.concat(r.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Vr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Us({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Jr=Wr,Kr=Rs,Yr=Kr({Concat:function(i,t){var e=i.children.map((function(r){return this.visit(r,t)}).bind(this));return e.some(function(r){return r===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Gr=Yr,Zr=Dr,Qr=Jr,Xr=Gr;Et.prototype=Object.create(null);Et.prototype.match=function(i){var t=Qr.visit(this.ast),e=t.match(i);return e||!1};Et.prototype.reverse=function(i){return Xr.visit(this.ast,i)};function Et(i){var t;if(this?t=this:t=Object.create(Et.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Zr.parse(i),t}var ti=Et,ei=ti,si=ei;const ri=Ir(si);var ii=Object.defineProperty,Ns=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&ii(t,e,s),s};const Ms=class extends X{constructor(t,e,r=""){super(),this._cases=[],this._fallback=()=>lt` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new ri(s.path)})),this._historyObserver=new D(this,e),this._authObserver=new D(this,r)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),lt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(fs(this,"auth/redirect"),lt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):lt` <h1>Authenticating</h1> `;if("redirect"in e){const r=e.redirect;if(typeof r=="string")return this.redirect(r),lt` <h1>Redirecting to ${r}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:r}=t,s=new URLSearchParams(e),n=r+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:r,params:l,query:s}}}redirect(t){le(this,"history/redirect",{href:t})}};Ms.styles=vr`
    :host,
    main {
      display: contents;
    }
  `;let Ut=Ms;Ns([Ps()],Ut.prototype,"_user");Ns([Ps()],Ut.prototype,"_match");const ni=Object.freeze(Object.defineProperty({__proto__:null,Element:Ut,Switch:Ut},Symbol.toStringTag,{value:"Module"})),oi=class Ls extends HTMLElement{constructor(){if(super(),It(this).template(Ls.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};oi.template=I`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const js=class ne extends HTMLElement{constructor(){super(),this._array=[],It(this).template(ne.template).styles(ne.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Hs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const r=new Event("change",{bubbles:!0}),s=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=s,this.dispatchEvent(r)}}}),this.addEventListener("click",t=>{Re(t,"button.add")?re(t,"input-array:add"):Re(t,"button.remove")&&re(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ai(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const r=Array.from(this.children).indexOf(e);this._array.splice(r,1),e.remove()}}};js.template=I`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;js.styles=ms`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function ai(i,t){t.replaceChildren(),i.forEach((e,r)=>t.append(Hs(e)))}function Hs(i,t){const e=i===void 0?I`<input />`:I`<input value="${i}" />`;return I`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function li(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var hi=Object.defineProperty,ci=Object.getOwnPropertyDescriptor,ui=(i,t,e,r)=>{for(var s=ci(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&hi(t,e,s),s};class di extends X{constructor(t){super(),this._pending=[],this._observer=new D(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([r,s])=>{console.log("Dispatching queued event",s,r),r.dispatchEvent(s)}),e.setEffect(()=>{var r;if(console.log("View effect",this,e,(r=this._context)==null?void 0:r.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const r=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",r),e.dispatchEvent(r)):(console.log("Queueing message event",r),this._pending.push([e,r]))}ref(t){return this.model?this.model[t]:void 0}}ui([ks()],di.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,pe=Ct.ShadowRoot&&(Ct.ShadyCSS===void 0||Ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),Ge=new WeakMap;let Is=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=Ge.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Ge.set(e,t))}return t}toString(){return this.cssText}};const pi=i=>new Is(typeof i=="string"?i:i+"",void 0,fe),T=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new Is(e,i,fe)},fi=(i,t)=>{if(pe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),s=Ct.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Ze=pe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return pi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:mi,defineProperty:gi,getOwnPropertyDescriptor:yi,getOwnPropertyNames:vi,getOwnPropertySymbols:_i,getPrototypeOf:$i}=Object,O=globalThis,Qe=O.trustedTypes,bi=Qe?Qe.emptyScript:"",Zt=O.reactiveElementPolyfillSupport,dt=(i,t)=>i,Nt={toAttribute(i,t){switch(t){case Boolean:i=i?bi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},me=(i,t)=>!mi(i,t),Xe={attribute:!0,type:String,converter:Nt,reflect:!1,useDefault:!1,hasChanged:me};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),O.litPropertyMetadata??(O.litPropertyMetadata=new WeakMap);let Q=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Xe){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&gi(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:n}=yi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:s,set(o){const l=s==null?void 0:s.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Xe}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=$i(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,r=[...vi(e),..._i(e)];for(const s of r)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const s of r)e.unshift(Ze(s))}else t!==void 0&&e.push(Ze(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var n;const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:Nt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){var n,o;const r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const l=r.getPropertyOptions(s),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Nt;this._$Em=s,this[s]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(s))??null,this._$Em=null}}requestUpdate(t,e,r){var s;if(t!==void 0){const n=this.constructor,o=this[t];if(r??(r=n.getPropertyOptions(t)),!((r.hasChanged??me)(o,e)||r.useDefault&&r.reflect&&o===((s=this._$Ej)==null?void 0:s.get(t))&&!this.hasAttribute(n._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:n},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[n,o]of s){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(r=this._$EO)==null||r.forEach(s=>{var n;return(n=s.hostUpdate)==null?void 0:n.call(s)}),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[dt("elementProperties")]=new Map,Q[dt("finalized")]=new Map,Zt==null||Zt({ReactiveElement:Q}),(O.reactiveElementVersions??(O.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=globalThis,Mt=pt.trustedTypes,ts=Mt?Mt.createPolicy("lit-html",{createHTML:i=>i}):void 0,zs="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Ds="?"+C,wi=`<${Ds}>`,B=document,yt=()=>B.createComment(""),vt=i=>i===null||typeof i!="object"&&typeof i!="function",ge=Array.isArray,Ai=i=>ge(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,ht=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,es=/-->/g,ss=/>/g,L=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),rs=/'/g,is=/"/g,qs=/^(?:script|style|textarea|title)$/i,Ei=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),y=Ei(1),it=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ns=new WeakMap,H=B.createTreeWalker(B,129);function Bs(i,t){if(!ge(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ts!==void 0?ts.createHTML(t):t}const Si=(i,t)=>{const e=i.length-1,r=[];let s,n=t===2?"<svg>":t===3?"<math>":"",o=ht;for(let l=0;l<e;l++){const a=i[l];let d,f,u=-1,h=0;for(;h<a.length&&(o.lastIndex=h,f=o.exec(a),f!==null);)h=o.lastIndex,o===ht?f[1]==="!--"?o=es:f[1]!==void 0?o=ss:f[2]!==void 0?(qs.test(f[2])&&(s=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=s??ht,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?L:f[3]==='"'?is:rs):o===is||o===rs?o=L:o===es||o===ss?o=ht:(o=L,s=void 0);const c=o===L&&i[l+1].startsWith("/>")?" ":"";n+=o===ht?a+wi:u>=0?(r.push(d),a.slice(0,u)+zs+a.slice(u)+C+c):a+C+(u===-2?l:c)}return[Bs(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class _t{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Si(t,e);if(this.el=_t.createElement(d,r),H.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(s=H.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const u of s.getAttributeNames())if(u.endsWith(zs)){const h=f[o++],c=s.getAttribute(u).split(C),p=/([.?@])?(.*)/.exec(h);a.push({type:1,index:n,name:p[2],strings:c,ctor:p[1]==="."?ki:p[1]==="?"?Pi:p[1]==="@"?Ci:Dt}),s.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(u));if(qs.test(s.tagName)){const u=s.textContent.split(C),h=u.length-1;if(h>0){s.textContent=Mt?Mt.emptyScript:"";for(let c=0;c<h;c++)s.append(u[c],yt()),H.nextNode(),a.push({type:2,index:++n});s.append(u[h],yt())}}}else if(s.nodeType===8)if(s.data===Ds)a.push({type:2,index:n});else{let u=-1;for(;(u=s.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){const r=B.createElement("template");return r.innerHTML=t,r}}function nt(i,t,e=i,r){var o,l;if(t===it)return t;let s=r!==void 0?(o=e._$Co)==null?void 0:o[r]:e._$Cl;const n=vt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??(e._$Co=[]))[r]=s:e._$Cl=s),s!==void 0&&(t=nt(i,s._$AS(i,t.values),s,r)),t}class xi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=((t==null?void 0:t.creationScope)??B).importNode(e,!0);H.currentNode=s;let n=H.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new St(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Oi(n,this,t)),this._$AV.push(d),a=r[++l]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=B,s}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class St{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),vt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==it&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ai(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(B.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=_t.createElement(Bs(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(e);else{const o=new xi(s,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=ns.get(t.strings);return e===void 0&&ns.set(t.strings,e=new _t(t)),e}k(t){ge(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const n of t)s===e.length?e.push(r=new St(this.O(yt()),this.O(yt()),this,this.options)):r=e[s],r._$AI(n),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=b}_$AI(t,e=this,r,s){const n=this.strings;let o=!1;if(n===void 0)t=nt(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==it,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=nt(this,l[r+a],e,a),d===it&&(d=this._$AH[a]),o||(o=!vt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!s&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ki extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Pi extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Ci extends Dt{constructor(t,e,r,s,n){super(t,e,r,s,n),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??b)===it)return;const r=this._$AH,s=t===b&&r!==b||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==b&&(r===b||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Oi{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}}const Xt=pt.litHtmlPolyfillSupport;Xt==null||Xt(_t,St),(pt.litHtmlVersions??(pt.litHtmlVersions=[])).push("3.3.0");const Ti=(i,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let s=r._$litPart$;if(s===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=s=new St(t.insertBefore(yt(),n),n,void 0,e??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const z=globalThis;class A extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ti(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return it}}var os;A._$litElement$=!0,A.finalized=!0,(os=z.litElementHydrateSupport)==null||os.call(z,{LitElement:A});const te=z.litElementPolyfillSupport;te==null||te({LitElement:A});(z.litElementVersions??(z.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ri={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:me},Ui=(i=Ri,t,e)=>{const{kind:r,metadata:s}=e;let n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),r==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(r==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+r)};function R(i){return(t,e)=>typeof e=="object"?Ui(i,t,e):((r,s,n)=>{const o=s.hasOwnProperty(n);return s.constructor.createProperty(n,r),o?Object.getOwnPropertyDescriptor(s,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function k(i){return R({...i,state:!0,attribute:!1})}var Ni=Object.defineProperty,qt=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ni(t,e,s),s};const _e=class _e extends A{constructor(){super(...arguments),this.loggedIn=!1,this.menuOpen=!1,this.lightMode=!1,this._authObserver=new D(this,"fit:auth"),this.toggleMenu=()=>{this.menuOpen=!this.menuOpen},this.handleOutsideClick=t=>{var e;(e=this.shadowRoot)!=null&&e.contains(t.target)||(this.menuOpen=!1)}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{const r=e.user;r!=null&&r.authenticated?(this.loggedIn=!0,this.username=r.username):(this.loggedIn=!1,this.username=void 0,this.menuOpen=!1)});const t=localStorage.getItem("lightmode");this.lightMode=t==="true",document.body.classList.toggle("light-mode",this.lightMode)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.handleOutsideClick)}signOut(){this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signout"]})),setTimeout(()=>{window.history.pushState({},"","/app/login"),window.dispatchEvent(new PopStateEvent("popstate"))},100)}toggleLightMode(t){const e=t.target.checked;this.lightMode=e,localStorage.setItem("lightmode",String(e)),document.body.classList.toggle("light-mode",e),this.dispatchEvent(new CustomEvent("lightmode:toggle",{bubbles:!0,detail:{checked:e}}))}render(){return y`
      <header>
        <div>
          <h1>Fitness Level Tracker</h1>
        </div>
        <div class="right">
          <nav>
            <a href="/app/tutorials">Tutorials</a>
          </nav>

          <label class="light-toggle">
            <input
              type="checkbox"
              .checked=${this.lightMode}
              @change=${this.toggleLightMode}
            />
            Light Mode
          </label>

          <div class="user">
            ${this.loggedIn?y`
                  <button class="user-button" @click=${this.toggleMenu}>
                    Hello, ${this.username} ☰
                  </button>
                  ${this.menuOpen?y`
                        <div class="dropdown-content">
                          <a href="/app">Home</a>
                          <a href="/app/workout/strength">Strength</a>
                          <a href="/app/workout/cardio">Cardio</a>
                          <a href="/app/workout/custom">Custom</a>
                          <a href="/app/achievement/first-workout">Achievements</a>
                          <button @click=${this.signOut}>Sign Out</button>
                        </div>
                      `:null}
                `:y`<a href="/app/login">Sign In</a>`}
          </div>
        </div>
      </header>
    `}};_e.styles=T`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #222;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }

    h1 {
      font-size: 1.5rem;
      margin: 0;
    }

    nav a {
      color: white;
      text-decoration: none;
      margin-left: 1rem;
      font-weight: bold;
    }

    .right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user {
      position: relative;
    }

    .user-button {
      background: none;
      color: white;
      border: none;
      font: inherit;
      cursor: pointer;
    }

    .dropdown-content {
      position: absolute;
      top: 2.5rem;
      right: 0;
      background: #333;
      border: 1px solid #555;
      border-radius: 6px;
      padding: 0.5rem 0;
      display: flex;
      flex-direction: column;
      min-width: 180px;
      z-index: 10;
    }

    .dropdown-content a,
    .dropdown-content button {
      color: white;
      background: none;
      border: none;
      padding: 0.75rem 1rem;
      text-align: left;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .dropdown-content a:hover,
    .dropdown-content button:hover {
      background: #444;
    }

    .light-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
    }

    .light-toggle input[type="checkbox"] {
      transform: scale(1.2);
    }
  `;let F=_e;qt([k()],F.prototype,"loggedIn");qt([k()],F.prototype,"username");qt([k()],F.prototype,"menuOpen");qt([k()],F.prototype,"lightMode");const $e=class $e extends A{render(){return y`
      <div class="dashboard-layout">
        <aside class="profile-box">
          <p><strong>Level:</strong> 4</p>
          <p><strong>XP:</strong> 1250</p>
        </aside>

        <section class="main-content">
          <h2>My Workout Plans</h2>
          <ul>
            <li>
              <svg class="icon"><use href="/icons/workouts.svg#icon-dumbbell" /></svg>
              <a href="/app/workout/strength">Strength Plan</a>
            </li>
            <li>
              <svg class="icon"><use href="/icons/workouts.svg#icon-heart" /></svg>
              <a href="/app/workout/cardio">Cardio Plan</a>
            </li>
            <li>
              <svg class="icon"><use href="/icons/workouts.svg#icon-yoga" /></svg>
              <a href="/app/workout/custom">Custom Plan</a>
            </li>
          </ul>
          <h2>Tutorials</h2>
        <ul>
          <li>
              <a href="/app/tutorials">View All Tutorials</a>
          </li>
        </ul>

          

          <h2>My Achievements</h2>
          <ul>
            <li>
              <svg class="icon"><use href="/icons/workouts.svg#icon-stars" /></svg>
              <a href="/app/achievement/first-workout">First Workout Badge</a>
            </li>
          </ul>
        </section>
      </div>
    `}};$e.styles=T`
    .dashboard-layout {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 2rem;
    }

    aside.profile-box {
      width: 200px;
      background: #333;
      color: #fff;
      padding: 1rem;
      border-radius: 0.5rem;
      font-family: 'Inter', sans-serif;
    }

    section.main-content {
      flex: 1;
      color: white;
      font-family: 'Inter', sans-serif;
    }

    h2 {
      font-size: 1.5rem;
      margin-top: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
    }

    .icon {
      width: 1.2rem;
      height: 1.2rem;
      margin-right: 0.5rem;
      fill: white;
    }

    a {
      color: #90cdf4;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `;let Lt=$e;customElements.define("home-view",Lt);var Mi=Object.defineProperty,Li=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Mi(t,e,s),s};const be=class be extends A{constructor(){super(...arguments),this.plan=""}render(){switch(this.plan.toLowerCase()){case"cardio":return this.renderCardio();case"custom":return this.renderCustom();case"strength":return this.renderStrength();default:return y`<p>Unknown workout plan: ${this.plan}</p>`}}renderCardio(){return y`
      <main class="wrapper">
        <h1>Cardio Workout Plan</h1>
        <p>Goal: Improve endurance and burn calories</p>
        <p>Level Required: 2</p>
        <h2>Weekly Schedule</h2>
        <table>
          <thead><tr><th>Day</th><th>Workout</th><th>Links</th></tr></thead>
          <tbody>
            <tr><td>Monday</td><td>Jumping Jacks + High Knees</td><td><a href="/app/tutorial/jumping-jacks">Jumping Jacks</a> | <a href="/app/tutorial/high-knees">High Knees</a></td></tr>
            <tr><td>Tuesday</td><td>Burpees</td><td><a href="/app/tutorial/burpees">Burpees</a></td></tr>
            <tr><td>Wednesday</td><td>Rest Day</td><td>-</td></tr>
            <tr><td>Thursday</td><td>High Knees + Jumping Jacks</td><td><a href="/app/tutorial/high-knees">High Knees</a> | <a href="/app/tutorial/jumping-jacks">Jumping Jacks</a></td></tr>
            <tr><td>Friday</td><td>Burpees</td><td><a href="/app/tutorial/burpees">Burpees</a></td></tr>
            <tr><td>Saturday</td><td>Free Cardio Choice</td><td><a href="/app/tutorial/high-knees">High Knees</a>, <a href="/app/tutorial/burpees">Burpees</a>, <a href="/app/tutorial/jumping-jacks">Jumping Jacks</a></td></tr>
            <tr><td>Sunday</td><td>Rest & Recovery</td><td>-</td></tr>
          </tbody>
        </table>
      </main>
    `}renderCustom(){return y`
      <main class="wrapper">
        <h1>Create Your Custom Workout Plan</h1>
        <p>Select the exercises you want to do for each day of the week.</p>
        <form>
          <table>
            <thead><tr><th>Day</th><th>Choose Exercises</th></tr></thead>
            <tbody>
              ${["mon","tue","thu","fri"].map(t=>y`
                <tr><td>${this.dayName(t)}</td><td>
                  <input type="checkbox" name="${t}" value="Jumping Jacks" /> <a href="/app/tutorial/jumping-jacks">Jumping Jacks</a><br />
                  <input type="checkbox" name="${t}" value="High Knees" /> <a href="/app/tutorial/high-knees">High Knees</a><br />
                  <input type="checkbox" name="${t}" value="Burpees" /> <a href="/app/tutorial/burpees">Burpees</a>
                </td></tr>
              `)}
              <tr><td>Wednesday</td><td>Rest Day</td></tr>
              <tr><td>Saturday</td><td>Free Day! Do anything you like.</td></tr>
              <tr><td>Sunday</td><td>Rest & Recovery</td></tr>
            </tbody>
          </table>
          <br />
          <button type="submit" disabled>Save Plan (coming soon)</button>
        </form>
      </main>
    `}renderStrength(){return y`
      <main class="wrapper">
        <h1>Strength Workout Plan</h1>
        <p>Goal: Build strength and muscle mass</p>
        <p>Level Required: 3</p>
        <h2>Weekly Schedule</h2>
        <table>
          <thead><tr><th>Day</th><th>Workout</th><th>Links</th></tr></thead>
          <tbody>
            <tr><td>Monday</td><td>Push-Ups + Squats</td><td><a href="/app/tutorial/pushup">Push-Ups</a> | <a href="/app/tutorial/squat">Squats</a></td></tr>
            <tr><td>Tuesday</td><td>Squats</td><td><a href="/app/tutorial/squat">Squats</a></td></tr>
            <tr><td>Wednesday</td><td>Rest Day</td><td>-</td></tr>
            <tr><td>Thursday</td><td>Push-Ups (Endurance Set)</td><td><a href="/app/tutorial/pushup">Push-Ups</a></td></tr>
            <tr><td>Friday</td><td>Push-Ups + Squats Combo</td><td><a href="/app/tutorial/pushup">Push-Ups</a> | <a href="/app/tutorial/squat">Squats</a></td></tr>
            <tr><td>Saturday</td><td>Optional Free Strength Day</td><td><a href="/app/tutorial/pushup">Push-Ups</a>, <a href="/app/tutorial/squat">Squats</a></td></tr>
            <tr><td>Sunday</td><td>Stretch & Recovery</td><td>-</td></tr>
          </tbody>
        </table>
      </main>
    `}dayName(t){return{mon:"Monday",tue:"Tuesday",thu:"Thursday",fri:"Friday"}[t]??t}};be.styles=T`
    main {
      padding: 2rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #666;
      padding: 0.5rem;
      text-align: left;
    }
    a {
      color: var(--color-accent);
      text-decoration: underline;
    }
  `;let $t=be;Li([R()],$t.prototype,"plan");customElements.define("workout-plan-view",$t);var ji=Object.defineProperty,Hi=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&ji(t,e,s),s};class ye extends A{constructor(){super(...arguments),this.id=""}render(){return y`
      <h2>Achievement ID: ${this.id}</h2>
    `}}Hi([R({attribute:"achievement-id"})],ye.prototype,"id");customElements.define("achievement-view",ye);var Ii=Object.defineProperty,Fs=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Ii(t,e,s),s};const we=class we extends A{constructor(){super(...arguments),this.title="",this.target=""}render(){return y`
      <section>
        <h1>${this.title}</h1>
        <p>Target: ${this.target}</p>
        <p>Steps:</p>
        <ol>
          <slot name="step"></slot>
        </ol>
      </section>
    `}};we.styles=T`
  section {
    background-color: #222;
    border-radius: 0.5rem;
    padding: 1rem;
    color: white;
    border: 1px solid var(--color-accent-alt, #444);
  }

  h1 {
    font-size: 1.25rem;
    color: var(--color-accent, #90cdf4);
    margin: 0 0 0.25rem 0;
  }

  p {
    margin: 0.25rem 0;
  }

  ol {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
  }
`;let bt=we;Fs([R()],bt.prototype,"title");Fs([R()],bt.prototype,"target");var zi=Object.defineProperty,Di=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&zi(t,e,s),s};const Ae=class Ae extends A{constructor(){super(...arguments),this.tutorials=[],this._authObserver=new D(this,"fit:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.fetchTutorials()})}async fetchTutorials(){try{const t=await fetch("/api/tutorials",{headers:this.authorization});if(!t.ok)throw new Error("Unauthorized or failed fetch");this.tutorials=await t.json()}catch(t){console.error("Failed to load tutorials:",t)}}render(){return y`
      <section>
        ${this.tutorials.map(t=>y`
            <fit-tutorial
              title=${t.title}
              target=${t.target}
            >
              ${t.steps.map(e=>y`<li slot="step">${e}</li>`)}
            </fit-tutorial>
          `)}
      </section>
    `}};Ae.styles=T`
    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
  `;let jt=Ae;Di([k()],jt.prototype,"tutorials");var qi=Object.defineProperty,Bt=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&qi(t,e,s),s};const Ee=class Ee extends A{constructor(){super(...arguments),this.formData={},this.redirect="/"}connectedCallback(){super.connectedCallback(),console.log("✅ <login-form> connected")}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return y`
    <form
      @change=${t=>this.handleChange(t)}
      @submit=${t=>this.handleSubmit(t)}
    >
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" name="username" autocomplete="off" />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" type="password" name="password" />
      </div>

      <button ?disabled=${!this.canSubmit} type="submit">Login</button>
      <p class="error">${this.error}</p>
    </form>
  `}handleChange(t){const e=t.target,r=e==null?void 0:e.name,s=e==null?void 0:e.value,n=this.formData;switch(r){case"username":this.formData={...n,username:s};break;case"password":this.formData={...n,password:s};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200&&e.status!==201)throw"Failed";return e.json()}).then(({token:e})=>{const r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e,redirect:this.redirect}]});this.dispatchEvent(r)}).catch(e=>{console.error("Registration/Login failed",e),this.error=e.toString()})}};Ee.styles=T`
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    align-items: flex-start;
  }

  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  input {
    padding: 0.6rem;
    border: 1px solid #444;
    background: #1c122a;
    color: #eee;
    border-radius: 6px;
    font-size: 1rem;
    width: 100%;
  }

  button {
    background-color: #b491f5;
    color: white;
    padding: 0.75rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  button:hover {
    background-color: #a37df4;
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .error:not(:empty) {
    color: #ff6b6b;
    margin-top: 1rem;
    text-align: center;
  }
`;let V=Ee;Bt([k()],V.prototype,"formData");Bt([R()],V.prototype,"api");Bt([R()],V.prototype,"redirect");Bt([k()],V.prototype,"error");const Se=class Se extends A{render(){return y`
      <div class="card">
        <h2>Log In</h2>
        <login-form api="/auth/login" redirect="/app"></login-form>
        <p>Need an account? <a href="/app/register">Sign up</a></p>
      </div>
    `}};Se.styles=T`
    .card {
      margin: 4rem auto;
      max-width: 360px;
      padding: 2rem;
      border: 1px solid #444;
      border-radius: 1rem;
      background-color: #1c122a;
      color: white;
      font-family: 'Inter', sans-serif;
    }

    h2 {
      font-family: 'Bebas Neue', cursive;
      font-size: 2rem;
      text-align: center;
    }

    p {
      margin-top: 1rem;
      text-align: center;
    }

    a {
      color: #90cdf4;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `;let wt=Se;customElements.define("login-view",wt);const xe=class xe extends A{render(){return y`
      <div class="card">
        <h2>Create Account</h2>
        <login-form api="/auth/register" redirect="/app"></login-form>
        <p>Already have an account? <a href="/app/login">Log in</a></p>
      </div>
    `}};xe.styles=wt.styles;let Ht=xe;customElements.define("register-view",Ht);var Bi=Object.defineProperty,ve=(i,t,e,r)=>{for(var s=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(s=o(t,e,s)||s);return s&&Bi(t,e,s),s};const ke=class ke extends A{constructor(){super(...arguments),this.tutorialId="",this._authObserver=new D(this,"fit:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.fetchTutorial()})}async fetchTutorial(){if(this.tutorialId)try{const t=await fetch(`/api/tutorials/${this.tutorialId}`,{headers:this.authorization});if(!t.ok)throw new Error("Tutorial not found or unauthorized");this.tutorial=await t.json()}catch(t){this.error=t.message}}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}render(){return this.error?y`<p class="error"> ${this.error}</p>`:this.tutorial?y`
      <main class="wrapper">
        <h1>${this.tutorial.title}</h1>
        <p><strong>Target:</strong> ${this.tutorial.target}</p>
        <h2>Steps</h2>
        <ol>
          ${this.tutorial.steps.map(t=>y`<li>${t}</li>`)}
        </ol>
        <p><a href="/app/tutorials">← Back to All Tutorials</a></p>
      </main>
    `:y`<p>Loading tutorial...</p>`}};ke.styles=T`
    .wrapper {
      padding: 2rem;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    p {
      font-size: 1rem;
    }
    ol {
      margin-top: 1rem;
      padding-left: 1.5rem;
    }
    .error {
      color: red;
      font-weight: bold;
    }
    a {
      color: var(--color-accent);
      text-decoration: underline;
    }
  `;let W=ke;ve([R({attribute:"tutorial-id"})],W.prototype,"tutorialId");ve([k()],W.prototype,"tutorial");ve([k()],W.prototype,"error");customElements.define("tutorial-detail-view",W);const Fi=[{path:"/app/workout/:plan",view:i=>y`<workout-plan-view plan=${i.plan}></workout-plan-view>`},{path:"/app/achievement/:id",view:i=>y`<achievement-view achievement-id=${i.id}></achievement-view>`},{path:"/app/tutorial/:id",view:i=>y`<tutorial-detail-view tutorial-id=${i.id}></tutorial-detail-view>`},{path:"/app/tutorials",view:()=>y`<tutorials-view></tutorials-view>`},{path:"/app/login",view:()=>y`<login-view></login-view>`},{path:"/app/register",view:()=>y`<register-view></register-view>`},{path:"/app",view:()=>y`<home-view></home-view>`},{path:"/",redirect:"/app"},{path:"/app/workout/:plan",view:i=>y`<workout-plan-view plan=${i.plan}></workout-plan-view>`},{path:"/app/tutorial/:id",view:i=>y`<tutorial-detail-view tutorial-id=${i.id}></tutorial-detail-view>`}];li({"mu-auth":lr.Provider,"mu-history":fr.Provider,"mu-switch":class extends ni.Element{constructor(){super(Fi,"fit:history","fit:auth")}},"fit-header":F,"home-view":Lt,"workout-plan-view":$t,"achievement-view":ye,"fit-tutorial":bt,"tutorials-view":jt,"login-view":wt,"register-view":Ht,"login-form":V,"tutorial-detail-view":W});
