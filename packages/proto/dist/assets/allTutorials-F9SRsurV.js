import{i as n,O as h,x as s,b as c,d as f,a as d}from"./property-WXAYD-zS.js";import{F as p}from"./fit-header-BQNaNTfB.js";import{F as m}from"./fit-tutorial-BT_UTIWf.js";import{r as v}from"./state-DO0X74YQ.js";var _=Object.defineProperty,b=(u,t,e,$)=>{for(var r=void 0,a=u.length-1,l;a>=0;a--)(l=u[a])&&(r=l(t,e,r)||r);return r&&_(t,e,r),r};const o=class o extends n{constructor(){super(...arguments),this.tutorials=[],this._authObserver=new h(this,"fit:auth")}get authorization(){return this._user&&this._user.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._user=t.user,this.fetchTutorials()})}async fetchTutorials(){try{const t=await fetch("/api/tutorials",{headers:this.authorization});if(!t.ok)throw new Error("Unauthorized or failed fetch");this.tutorials=await t.json()}catch(t){console.error("Failed to load tutorials:",t)}}render(){return s`
      <section>
        ${this.tutorials.map(t=>s`
            <fit-tutorial
              title=${t.title}
              target=${t.target}
            >
              ${t.steps.map(e=>s`<li slot="step">${e}</li>`)}
            </fit-tutorial>
          `)}
      </section>
    `}};o.styles=c`
    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
  `;let i=o;b([v()],i.prototype,"tutorials");f({"mu-auth":d.Provider,"fit-header":p,"fit-tutorial":m,"tutorial-list":i});
