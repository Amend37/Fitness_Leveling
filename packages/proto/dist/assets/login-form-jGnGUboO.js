import{i as u,x as m,b as f,n as l}from"./property-WXAYD-zS.js";import{r as p}from"./state-DO0X74YQ.js";var h=Object.defineProperty,n=(d,t,e,s)=>{for(var r=void 0,o=d.length-1,c;o>=0;o--)(c=d[o])&&(r=c(t,e,r)||r);return r&&h(t,e,r),r};const i=class i extends u{constructor(){super(...arguments),this.formData={},this.redirect="/"}connectedCallback(){super.connectedCallback(),console.log("✅ <login-form> connected")}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return m`
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
  `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,o=this.formData;switch(s){case"username":this.formData={...o,username:r};break;case"password":this.formData={...o,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200&&e.status!==201)throw"Failed";return e.json()}).then(({token:e})=>{const s=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:e,redirect:this.redirect}]});this.dispatchEvent(s)}).catch(e=>{console.error("Registration/Login failed",e),this.error=e.toString()})}};i.styles=f`
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
`;let a=i;n([p()],a.prototype,"formData");n([l()],a.prototype,"api");n([l()],a.prototype,"redirect");n([p()],a.prototype,"error");export{a as L};
