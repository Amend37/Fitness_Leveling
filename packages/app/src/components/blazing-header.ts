import { LitElement, html, css } from "lit";

export class HeaderElement extends LitElement {
  static styles = css`
    header {
      padding: 1rem;
      font-size: 1.5rem;
      background: #222;
      color: white;
    }
  `;

  render() {
    return html`<header>Fitness Leveling</header>`;
  }
}
