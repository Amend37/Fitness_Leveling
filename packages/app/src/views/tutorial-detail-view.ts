// src/views/tutorial-detail-view.ts
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";

interface Tutorial {
  title: string;
  target: string;
  steps: string[];
}

export class TutorialDetailViewElement extends LitElement {
  @property({ attribute: "tutorial-id" }) tutorialId = "";
  @state() tutorial?: Tutorial;
  @state() error?: string;
  _authObserver = new Observer<Auth.Model>(this, "fit:auth");
  _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth) => {
      this._user = auth.user;
      this.fetchTutorial();
    });
  }

  async fetchTutorial() {
    if (!this.tutorialId) return;

    try {
      const res = await fetch(`/api/tutorials/${this.tutorialId}`, {
        headers: this.authorization
      });

      if (!res.ok) throw new Error("Tutorial not found or unauthorized");
      this.tutorial = await res.json();
    } catch (err) {
      this.error = (err as Error).message;
    }
  }

  get authorization(): HeadersInit {
    if (this._user && this._user.authenticated) {
      return {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      };
    }
    return {};
  }

  render() {
    if (this.error) return html`<p class="error"> ${this.error}</p>`;
    if (!this.tutorial) return html`<p>Loading tutorial...</p>`;

    return html`
      <main class="wrapper">
        <h1>${this.tutorial.title}</h1>
        <p><strong>Target:</strong> ${this.tutorial.target}</p>
        <h2>Steps</h2>
        <ol>
          ${this.tutorial.steps.map((step) => html`<li>${step}</li>`)}
        </ol>
        <p><a href="/app/tutorials">← Back to All Tutorials</a></p>
      </main>
    `;
  }

  static styles = css`
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
  `;
}

customElements.define("tutorial-detail-view", TutorialDetailViewElement);