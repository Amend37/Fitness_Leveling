import{i as p,x as a,b as f,n as u,d as m}from"./property-B9hbC3tx.js";import{F as d}from"./fit-tutorial-BbBrI9vi.js";import{r as h}from"./state-C5UoNPOO.js";var $=Object.defineProperty,c=(l,t,e,g)=>{for(var r=void 0,s=l.length-1,n;s>=0;s--)(n=l[s])&&(r=n(t,e,r)||r);return r&&$(t,e,r),r};const o=class o extends p{constructor(){super(...arguments),this.tutorials=[]}async connectedCallback(){super.connectedCallback();const t=await fetch("/tutorials");this.tutorials=await t.json()}render(){return a`
    <section>
      ${this.tutorials.map(t=>a`
          <fit-tutorial 
            title=${t.title} 
            target=${t.target}
          >
            ${t.steps.map(e=>a`<li slot="step">${e}</li>`)}
          </fit-tutorial>
        `)}
    </section>
  `}};o.styles=f`
    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
  `;let i=o;c([u()],i.prototype,"src");c([h()],i.prototype,"tutorials");m({"fit-tutorial":d,"tutorial-list":i});
