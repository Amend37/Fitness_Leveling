import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state() formData: LoginFormData = {};
  @property() api?: string;
  @property() redirect: string = "/";
  @state() error?: string;

  connectedCallback() {
  super.connectedCallback();
  console.log("✅ <login-form> connected");
}


  get canSubmit(): boolean {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }

override render() {
  return html`
    <form
      @change=${(e: InputEvent) => this.handleChange(e)}
      @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
    >
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" name="username" autocomplete="off" />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" type="password" name="password" />
      </div>

      <button ?disabled=${!this.canSubmit} type="submit">Login</button>
      <p class="error">${this.error}</p>
    </form>
  `;
}



  static styles = css`
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    align-items: flex-start;
  }

  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  input {
    padding: 0.6rem;
    border: 1px solid #444;
    background: #1c122a;
    color: #eee;
    border-radius: 6px;
    font-size: 1rem;
    width: 100%;
  }

  button {
    background-color: #b491f5;
    color: white;
    padding: 0.75rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  button:hover {
    background-color: #a37df4;
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .error:not(:empty) {
    color: #ff6b6b;
    margin-top: 1rem;
    text-align: center;
  }
`


  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;

    switch (name) {
      case "username":
        this.formData = { ...prevData, username: value };
        break;
      case "password":
        this.formData = { ...prevData, password: value };
        break;
    }
  }

  handleSubmit(submitEvent: SubmitEvent) {
  submitEvent.preventDefault();

  if (this.canSubmit) {
    fetch(this.api!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.formData)
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) throw "Failed";
        return res.json();
      })
      .then(({ token }: { token: string }) => {
        const event = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: this.redirect }]
        });
        this.dispatchEvent(event);
      })
      .catch((err) => {
        console.error("Registration/Login failed", err);
        this.error = err.toString();
      });
  }
}
}
