import{n as f,i as d,x as o,a as p,d as h,F as m}from"./fit-tutorial-DbXCLEAY.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function y(a){return f({...a,state:!0,attribute:!1})}var g=Object.defineProperty,u=(a,r,t,l)=>{for(var e=void 0,s=a.length-1,c;s>=0;s--)(c=a[s])&&(e=c(r,t,e)||e);return e&&g(r,t,e),e};const n=class n extends d{constructor(){super(...arguments),this.tutorials=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}async hydrate(r){try{const t=await fetch(r);if(!t.ok)throw new Error("Failed to fetch JSON");const l=await t.json();this.tutorials=l}catch(t){console.error("Error loading tutorials:",t)}}render(){return o`
      <section>
        ${this.tutorials.map(r=>o`
            <fit-tutorial 
              title=${r.title} 
              target=${r.target}
            >
              ${r.steps.map(t=>o`<li>${t}</li>`)}
            </fit-tutorial>
          `)}
      </section>
    `}};n.styles=p`
    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
  `;let i=n;u([f()],i.prototype,"src");u([y()],i.prototype,"tutorials");h({"fit-tutorial":m,"tutorial-list":i});
