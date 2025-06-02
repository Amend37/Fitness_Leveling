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
tutorials: Array<Tutorial> = [];

async connectedCallback() {
  super.connectedCallback();
  const res = await fetch("/tutorials");
  this.tutorials = await res.json();
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
