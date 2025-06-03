import{i as m,x as c,b as d,n as p}from"./property-WXAYD-zS.js";var g=Object.defineProperty,l=(s,a,i,h)=>{for(var t=void 0,e=s.length-1,n;e>=0;e--)(n=s[e])&&(t=n(a,i,t)||t);return t&&g(a,i,t),t};const o=class o extends m{constructor(){super(...arguments),this.title="",this.target=""}render(){return c`
      <section>
        <h1>${this.title}</h1>
        <p>Target: ${this.target}</p>
        <p>Steps:</p>
        <ol>
          <slot name="step"></slot>
        </ol>
      </section>
    `}};o.styles=d`
    section {
      margin-top: 1rem;
      padding: 1rem;
      background-color: var(--color-muted);
      border: 1px solid var(--color-accent-alt);
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }
    p {
      margin: 0.25rem 0;
    }
    ol {
      margin-top: 0.5rem;
      padding-left: 1.5rem;
    }
  `;let r=o;l([p()],r.prototype,"title");l([p()],r.prototype,"target");export{r as F};
