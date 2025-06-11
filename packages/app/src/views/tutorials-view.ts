import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang"; // ADD THIS
import "../components/fit-tutorial";

interface Tutorial {
  title: string;
  target: string;
  steps: string[];
}

export class TutorialListElement extends LitElement {
  @state() tutorials: Array<Tutorial> = [];

  _authObserver = new Observer<Auth.Model>(this, "fit:auth"); // ADD THIS
  _user?: Auth.User;

  get authorization(): HeadersInit {
  if (this._user && this._user.authenticated) {
    return {
      Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`,
    };
  } else {
    return {}; 
  }
}


  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth) => {
      this._user = auth.user;
      this.fetchTutorials();
    });
  }

  async fetchTutorials() {
    try {
      const res = await fetch("/api/tutorials", {
        headers: this.authorization
      });

      if (!res.ok) throw new Error("Unauthorized or failed fetch");

      this.tutorials = await res.json();
    } catch (err) {
      console.error("Failed to load tutorials:", err);
    }
  }

  override render() {
    return html`
      <section>
        ${this.tutorials.map(
          (tut) => html`
            <fit-tutorial
              title=${tut.title}
              target=${tut.target}
            >
              ${tut.steps.map(
                (step) => html`<li slot="step">${step}</li>`
              )}
            </fit-tutorial>
          `
        )}
      </section>
    `;
  }

  static styles = css`
    section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
  `;
}
