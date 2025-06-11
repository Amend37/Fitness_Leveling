import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class AchievementViewElement extends LitElement {
  @property({ attribute: "achievement-id" }) id = "";

  render() {
    return html`
      <h2>Achievement ID: ${this.id}</h2>
    `;
  }
}

customElements.define("achievement-view", AchievementViewElement);
