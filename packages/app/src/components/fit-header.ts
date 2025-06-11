import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";

export class FitHeader extends LitElement {
  @state() loggedIn = false;
  @state() username?: string;
  @state() menuOpen = false;
  @state() lightMode = false;

  _authObserver = new Observer<Auth.Model>(this, "fit:auth");

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe((auth: Auth.Model) => {
      const user = auth.user;
      if (user?.authenticated) {
        this.loggedIn = true;
        this.username = user.username;
      } else {
        this.loggedIn = false;
        this.username = undefined;
        this.menuOpen = false;
      }
    });

    const saved = localStorage.getItem("lightmode");
    this.lightMode = saved === "true";
    document.body.classList.toggle("light-mode", this.lightMode);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleOutsideClick);
  }

  toggleMenu = () => {
    this.menuOpen = !this.menuOpen;
  };

  handleOutsideClick = (e: MouseEvent) => {
    if (!this.shadowRoot?.contains(e.target as Node)) {
      this.menuOpen = false;
    }
  };

  signOut() {
    this.dispatchEvent(new CustomEvent("auth:message", {
      bubbles: true,
      composed: true,
      detail: ["auth/signout"]
    }));

    // Use client-side navigation
    setTimeout(() => {
      window.history.pushState({}, "", "/app/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, 100);
  }

  toggleLightMode(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    this.lightMode = checked;
    localStorage.setItem("lightmode", String(checked));
    document.body.classList.toggle("light-mode", checked);

    this.dispatchEvent(
      new CustomEvent("lightmode:toggle", {
        bubbles: true,
        detail: { checked }
      })
    );
  }

  static styles = css`
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
  `;

  render() {
    return html`
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
            ${this.loggedIn
              ? html`
                  <button class="user-button" @click=${this.toggleMenu}>
                    Hello, ${this.username} ☰
                  </button>
                  ${this.menuOpen
                    ? html`
                        <div class="dropdown-content">
                          <a href="/app">Home</a>
                          <a href="/app/workout/strength">Strength</a>
                          <a href="/app/workout/cardio">Cardio</a>
                          <a href="/app/workout/custom">Custom</a>
                          <a href="/app/achievement/first-workout">Achievements</a>
                          <button @click=${this.signOut}>Sign Out</button>
                        </div>
                      `
                    : null}
                `
              : html`<a href="/app/login">Sign In</a>`}
          </div>
        </div>
      </header>
    `;
  }
}
