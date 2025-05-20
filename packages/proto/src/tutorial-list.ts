import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import "./fit-tutorial";

interface Tutorial {
  title: string;
  target: string;
  steps: string[];
}

export class TutorialListElement extends LitElement {
  @property() src?: string;

  @state()
  tutorials: Tutorial[] = [];

  override connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  async hydrate(url: string) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch JSON");
      const data = await res.json();
      this.tutorials = data;
    } catch (err) {
      console.error("Error loading tutorials:", err);
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
              ${tut.steps.map((step) => html`<li>${step}</li>`)}
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
