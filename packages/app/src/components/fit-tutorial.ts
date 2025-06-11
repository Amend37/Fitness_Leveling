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
          <slot name="step"></slot>
        </ol>
      </section>
    `;
  }

  static styles = css`
  section {
    background-color: #222;
    border-radius: 0.5rem;
    padding: 1rem;
    color: white;
    border: 1px solid var(--color-accent-alt, #444);
  }

  h1 {
    font-size: 1.25rem;
    color: var(--color-accent, #90cdf4);
    margin: 0 0 0.25rem 0;
  }

  p {
    margin: 0.25rem 0;
  }

  ol {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
  }
`;
}