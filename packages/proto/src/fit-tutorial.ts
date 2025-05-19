import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class FitTutorialElement extends LitElement {
  @property() title = "";
  @property() target = "";

  override render() {
    return html`
      <section>
        <h1>${this.title}</h1>
        <p>Target: ${this.target}</p>
        <p>Steps:</p>
        <ol>
          <slot></slot>
        </ol>
      </section>
    `;
  }

  static styles = css`
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
  `;
}
