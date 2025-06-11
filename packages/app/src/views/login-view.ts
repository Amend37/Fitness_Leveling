import { html, css, LitElement } from "lit";
import "../auth/login-form";

// Ensure the form is defined

export class LoginViewElement extends LitElement {
  render() {
    return html`
      <div class="card">
        <h2>Log In</h2>
        <login-form api="/auth/login" redirect="/app"></login-form>
        <p>Need an account? <a href="/app/register">Sign up</a></p>
      </div>
    `;
  }

  static styles = css`
    .card {
      margin: 4rem auto;
      max-width: 360px;
      padding: 2rem;
      border: 1px solid #444;
      border-radius: 1rem;
      background-color: #1c122a;
      color: white;
      font-family: 'Inter', sans-serif;
    }

    h2 {
      font-family: 'Bebas Neue', cursive;
      font-size: 2rem;
      text-align: center;
    }

    p {
      margin-top: 1rem;
      text-align: center;
    }

    a {
      color: #90cdf4;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `;
}

customElements.define("login-view", LoginViewElement);
