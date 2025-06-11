// src/views/workout-plan-view.ts
import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class WorkoutPlanViewElement extends LitElement {
  @property() plan = "";

  render() {
    switch (this.plan.toLowerCase()) {
      case "cardio":
        return this.renderCardio();
      case "custom":
        return this.renderCustom();
      case "strength":
        return this.renderStrength();
      default:
        return html`<p>Unknown workout plan: ${this.plan}</p>`;
    }
  }

  renderCardio() {
    return html`
      <main class="wrapper">
        <h1>Cardio Workout Plan</h1>
        <p>Goal: Improve endurance and burn calories</p>
        <p>Level Required: 2</p>
        <h2>Weekly Schedule</h2>
        <table>
          <thead><tr><th>Day</th><th>Workout</th><th>Links</th></tr></thead>
          <tbody>
            <tr><td>Monday</td><td>Jumping Jacks + High Knees</td><td><a href="/app/tutorial/jumping-jacks">Jumping Jacks</a> | <a href="/app/tutorial/high-knees">High Knees</a></td></tr>
            <tr><td>Tuesday</td><td>Burpees</td><td><a href="/app/tutorial/burpees">Burpees</a></td></tr>
            <tr><td>Wednesday</td><td>Rest Day</td><td>-</td></tr>
            <tr><td>Thursday</td><td>High Knees + Jumping Jacks</td><td><a href="/app/tutorial/high-knees">High Knees</a> | <a href="/app/tutorial/jumping-jacks">Jumping Jacks</a></td></tr>
            <tr><td>Friday</td><td>Burpees</td><td><a href="/app/tutorial/burpees">Burpees</a></td></tr>
            <tr><td>Saturday</td><td>Free Cardio Choice</td><td><a href="/app/tutorial/high-knees">High Knees</a>, <a href="/app/tutorial/burpees">Burpees</a>, <a href="/app/tutorial/jumping-jacks">Jumping Jacks</a></td></tr>
            <tr><td>Sunday</td><td>Rest & Recovery</td><td>-</td></tr>
          </tbody>
        </table>
      </main>
    `;
  }

  renderCustom() {
    return html`
      <main class="wrapper">
        <h1>Create Your Custom Workout Plan</h1>
        <p>Select the exercises you want to do for each day of the week.</p>
        <form>
          <table>
            <thead><tr><th>Day</th><th>Choose Exercises</th></tr></thead>
            <tbody>
              ${["mon", "tue", "thu", "fri"].map(day => html`
                <tr><td>${this.dayName(day)}</td><td>
                  <input type="checkbox" name="${day}" value="Jumping Jacks" /> <a href="/app/tutorial/jumping-jacks">Jumping Jacks</a><br />
                  <input type="checkbox" name="${day}" value="High Knees" /> <a href="/app/tutorial/high-knees">High Knees</a><br />
                  <input type="checkbox" name="${day}" value="Burpees" /> <a href="/app/tutorial/burpees">Burpees</a>
                </td></tr>
              `)}
              <tr><td>Wednesday</td><td>Rest Day</td></tr>
              <tr><td>Saturday</td><td>Free Day! Do anything you like.</td></tr>
              <tr><td>Sunday</td><td>Rest & Recovery</td></tr>
            </tbody>
          </table>
          <br />
          <button type="submit" disabled>Save Plan (coming soon)</button>
        </form>
      </main>
    `;
  }

  renderStrength() {
    return html`
      <main class="wrapper">
        <h1>Strength Workout Plan</h1>
        <p>Goal: Build strength and muscle mass</p>
        <p>Level Required: 3</p>
        <h2>Weekly Schedule</h2>
        <table>
          <thead><tr><th>Day</th><th>Workout</th><th>Links</th></tr></thead>
          <tbody>
            <tr><td>Monday</td><td>Push-Ups + Squats</td><td><a href="/app/tutorial/pushup">Push-Ups</a> | <a href="/app/tutorial/squat">Squats</a></td></tr>
            <tr><td>Tuesday</td><td>Squats</td><td><a href="/app/tutorial/squat">Squats</a></td></tr>
            <tr><td>Wednesday</td><td>Rest Day</td><td>-</td></tr>
            <tr><td>Thursday</td><td>Push-Ups (Endurance Set)</td><td><a href="/app/tutorial/pushup">Push-Ups</a></td></tr>
            <tr><td>Friday</td><td>Push-Ups + Squats Combo</td><td><a href="/app/tutorial/pushup">Push-Ups</a> | <a href="/app/tutorial/squat">Squats</a></td></tr>
            <tr><td>Saturday</td><td>Optional Free Strength Day</td><td><a href="/app/tutorial/pushup">Push-Ups</a>, <a href="/app/tutorial/squat">Squats</a></td></tr>
            <tr><td>Sunday</td><td>Stretch & Recovery</td><td>-</td></tr>
          </tbody>
        </table>
      </main>
    `;
  }

  dayName(code: string) {
    return {
      mon: "Monday",
      tue: "Tuesday",
      thu: "Thursday",
      fri: "Friday"
    }[code] ?? code;
  }

  static styles = css`
    main {
      padding: 2rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #666;
      padding: 0.5rem;
      text-align: left;
    }
    a {
      color: var(--color-accent);
      text-decoration: underline;
    }
  `;
}

customElements.define("workout-plan-view", WorkoutPlanViewElement);