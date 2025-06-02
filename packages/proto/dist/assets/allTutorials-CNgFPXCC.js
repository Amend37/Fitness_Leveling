import{n as c,i as p,x as o,a as f,d,F as m}from"./fit-tutorial-BpDYqwe8.js";/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function h(i){return c({...i,state:!0,attribute:!1})}var $=Object.defineProperty,u=(i,t,s,g)=>{for(var e=void 0,a=i.length-1,n;a>=0;a--)(n=i[a])&&(e=n(t,s,e)||e);return e&&$(t,s,e),e};const l=class l extends p{constructor(){super(...arguments),this.tutorials=[]}async connectedCallback(){super.connectedCallback();const t=await fetch("/tutorials");this.tutorials=await t.json()}render(){return o`
    <section>
      ${this.tutorials.map(t=>o`
          <fit-tutorial 
            title=${t.title} 
            target=${t.target}
          >
            ${t.steps.map(s=>o`<li slot="step">${s}</li>`)}
          </fit-tutorial>
        `)}
    </section>
  `}};l.styles=f`
    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
  `;let r=l;u([c()],r.prototype,"src");u([h()],r.prototype,"tutorials");d({"fit-tutorial":m,"tutorial-list":r});
