import { LitElement, html, css } from "lit";

export class ThemeToggle extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    const saved = localStorage.getItem("lightmode");
    if (saved === "true") {
      document.body.classList.add("light-mode");
    }
  }

  toggle(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    localStorage.setItem("lightmode", checked.toString());
    document.body.classList.toggle("light-mode", checked);
  }

  render() {
    const isChecked = localStorage.getItem("lightmode") === "true";
    return html`
      <label>
        <input type="checkbox" ?checked=${isChecked} @change=${this.toggle} />
        Light Mode
      </label>
    `;
  }
}

customElements.define("theme-toggle", ThemeToggle);
