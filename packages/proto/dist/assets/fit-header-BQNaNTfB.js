import{i as g,O as u,b as m,x as s}from"./property-WXAYD-zS.js";import{r}from"./state-DO0X74YQ.js";var p=Object.defineProperty,l=(d,t,e,i)=>{for(var o=void 0,a=d.length-1,c;a>=0;a--)(c=d[a])&&(o=c(t,e,o)||o);return o&&p(t,e,o),o};const h=class h extends g{constructor(){super(...arguments),this.loggedIn=!1,this.menuOpen=!1,this.lightMode=!1,this._authObserver=new u(this,"fit:auth"),this.toggleMenu=()=>{this.menuOpen=!this.menuOpen},this.handleOutsideClick=t=>{var e;(e=this.shadowRoot)!=null&&e.contains(t.target)||(this.menuOpen=!1)}}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{const i=e.user;i!=null&&i.authenticated?(this.loggedIn=!0,this.username=i.username):(this.loggedIn=!1,this.username=void 0,this.menuOpen=!1)});const t=localStorage.getItem("lightmode");this.lightMode=t==="true",document.body.classList.toggle("light-mode",this.lightMode)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.handleOutsideClick)}signOut(){this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signout"]})),setTimeout(()=>{window.location.href="/login.html"},100)}toggleLightMode(t){const e=t.target.checked;this.lightMode=e,localStorage.setItem("lightmode",String(e)),document.body.classList.toggle("light-mode",e),this.dispatchEvent(new CustomEvent("lightmode:toggle",{bubbles:!0,detail:{checked:e}}))}render(){return s`
    <header>
      <div>
        <h1>Fitness Level Tracker</h1>
      </div>
      <div class="right">
        <nav>
          <a href="all-tutorials.html">Tutorials</a>
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
          ${this.loggedIn?s`
                <button class="user-button" @click=${this.toggleMenu}>
                  Hello, ${this.username} ⌄
                </button>
                ${this.menuOpen?s`
                      <div class="dropdown-content">
                        <a href="index.html">Home</a>
                        <a href="workout-plan-strength.html">Strength</a>
                        <a href="workout-plan-cardio.html">Cardio</a>
                        <a href="workout-plan-custom.html">Custom</a>
                        <a href="/achievement-first-workout.html">Achievements</a>
                        <button @click=${this.signOut}>Sign Out</button>
                      </div>
                    `:null}
              `:s`<a href="/login.html">Sign In</a>`}
        </div>
      </div>
    </header>
  `}};h.styles=m`
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
  `;let n=h;l([r()],n.prototype,"loggedIn");l([r()],n.prototype,"username");l([r()],n.prototype,"menuOpen");l([r()],n.prototype,"lightMode");export{n as F};
