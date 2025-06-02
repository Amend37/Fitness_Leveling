import{i as d,x as m,b as l,n as c}from"./property-B9hbC3tx.js";import{r as u}from"./state-C5UoNPOO.js";var f=Object.defineProperty,i=(h,s,t,o)=>{for(var e=void 0,r=h.length-1,p;r>=0;r--)(p=h[r])&&(e=p(s,t,e)||e);return e&&f(s,t,e),e};const n=class n extends d{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return m`
      <form
        @change=${s=>this.handleChange(s)}
        @submit=${s=>this.handleSubmit(s)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(s){const t=s.target,o=t==null?void 0:t.name,e=t==null?void 0:t.value,r=this.formData;switch(o){case"username":this.formData={...r,username:e};break;case"password":this.formData={...r,password:e};break}}handleSubmit(s){s.preventDefault(),this.canSubmit&&fetch(this.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==200&&t.status!==201)throw"Login or Registration failed";return t.json()}).then(t=>{const{token:o}=t,e=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:o,redirect:this.redirect}]});console.log("dispatching message",e),this.dispatchEvent(e)}).catch(t=>{console.log(t),this.error=t.toString()})}};n.styles=l`
  .error:not(:empty) {
    color: red;
    border: 1px solid red;
    padding: 1rem;
  }
`;let a=n;i([u()],a.prototype,"formData");i([c()],a.prototype,"api");i([c()],a.prototype,"redirect");i([u()],a.prototype,"error");export{a as L};
