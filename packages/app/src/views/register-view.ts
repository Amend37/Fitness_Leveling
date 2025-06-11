import { html, css, LitElement } from "lit";
import "../auth/login-form";
import { LoginViewElement } from "./login-view";


export class RegisterViewElement extends LitElement {
  render() {
    return html`
      <div class="card">
        <h2>Create Account</h2>
        <login-form api="/auth/register" redirect="/app"></login-form>
        <p>Already have an account? <a href="/app/login">Log in</a></p>
      </div>
    `;
  }

  static styles = LoginViewElement.styles;
}

customElements.define("register-view", RegisterViewElement);
