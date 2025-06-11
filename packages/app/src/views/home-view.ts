import { html, css, LitElement } from "lit";

export class HomeViewElement extends LitElement {
  static styles = css`
    .dashboard-layout {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 2rem;
    }

    aside.profile-box {
      width: 200px;
      background: #333;
      color: #fff;
      padding: 1rem;
      border-radius: 0.5rem;
      font-family: 'Inter', sans-serif;
    }

    section.main-content {
      flex: 1;
      color: white;
      font-family: 'Inter', sans-serif;
    }

    h2 {
      font-size: 1.5rem;
      margin-top: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
    }

    .icon {
      width: 1.2rem;
      height: 1.2rem;
      margin-right: 0.5rem;
      fill: white;
    }

    a {
      color: #90cdf4;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <div class="dashboard-layout">
        <aside class="profile-box">
          <p><strong>Level:</strong> 4</p>
          <p><strong>XP:</strong> 1250</p>
        </aside>

        <section class="main-content">
          <h2>My Workout Plans</h2>
          <ul>
            <li>
              <svg class="icon"><use href="/icons/workouts.svg#icon-dumbbell" /></svg>
              <a href="/app/workout/strength">Strength Plan</a>
            </li>
            <li>
              <svg class="icon"><use href="/icons/workouts.svg#icon-heart" /></svg>
              <a href="/app/workout/cardio">Cardio Plan</a>
            </li>
            <li>
              <svg class="icon"><use href="/icons/workouts.svg#icon-yoga" /></svg>
              <a href="/app/workout/custom">Custom Plan</a>
            </li>
          </ul>
          <h2>Tutorials</h2>
        <ul>
          <li>
              <a href="/app/tutorials">View All Tutorials</a>
          </li>
        </ul>

          

          <h2>My Achievements</h2>
          <ul>
            <li>
              <svg class="icon"><use href="/icons/workouts.svg#icon-stars" /></svg>
              <a href="/app/achievement/first-workout">First Workout Badge</a>
            </li>
          </ul>
        </section>
      </div>
    `;
  }
}

customElements.define("home-view", HomeViewElement);
