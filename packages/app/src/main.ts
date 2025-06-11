import {
  Auth,
  define,
  History,
  Switch
} from "@calpoly/mustang";
import { html } from "lit";

// Import your components
import { FitHeader } from "./components/fit-header";
import { HomeViewElement } from "./views/home-view";
import { WorkoutPlanViewElement } from "./views/workout-plan-view";
import { AchievementViewElement } from "./views/achievement-view";
import { FitTutorialElement } from "./components/fit-tutorial";
import { TutorialListElement } from "./views/tutorials-view";
import { LoginViewElement } from "./views/login-view";
import { RegisterViewElement } from "./views/register-view";
import { LoginFormElement } from "./auth/login-form";
import { TutorialDetailViewElement } from "./views/tutorial-detail-view";

const routes: any[] = [
  {
    path: "/app/workout/:plan",
    view: (params: { plan: unknown; }) => html`<workout-plan-view plan=${params.plan}></workout-plan-view>`
  },
  {
    path: "/app/achievement/:id",
    view: (params: { id: unknown; }) => html`<achievement-view achievement-id=${params.id}></achievement-view>`
  },
  {
    path: "/app/tutorial/:id",
    view: (params: { id: unknown; }) => html`<tutorial-detail-view tutorial-id=${params.id}></tutorial-detail-view>`
  },
  {
    path: "/app/tutorials",
    view: () => html`<tutorials-view></tutorials-view>`
  },
  {
    path: "/app/login",
    view: () => html`<login-view></login-view>`
  },
  {
    path: "/app/register",
    view: () => html`<register-view></register-view>`
  },
  {
    path: "/app",
    view: () => html`<home-view></home-view>`
  },
  {
    path: "/",
    redirect: "/app"
  },
  {
  path: "/app/workout/:plan",
  view: (params: { plan: unknown; }) => html`<workout-plan-view plan=${params.plan}></workout-plan-view>`
  },
  {
  path: "/app/tutorial/:id",
  view: (params: { id: unknown; }) => html`<tutorial-detail-view tutorial-id=${params.id}></tutorial-detail-view>`
  }


];


// Register components
define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "fit:history", "fit:auth");
    }
  },
  "fit-header": FitHeader,
  "home-view": HomeViewElement,
  "workout-plan-view": WorkoutPlanViewElement,
  "achievement-view": AchievementViewElement,
  "fit-tutorial": FitTutorialElement,
  "tutorials-view": TutorialListElement,
  "login-view": LoginViewElement,
  "register-view": RegisterViewElement,
  "login-form": LoginFormElement,
  "tutorial-detail-view": TutorialDetailViewElement
});
