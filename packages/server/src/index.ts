import express, { Request, Response } from "express";
import path from "path";
import { connect } from "./services/mongo";
import Tutorials from "./services/tutorial-svc";
import tutorials from "./routes/tutorials";
import { authenticateUser } from "./routes/auth";
import auth from "./routes/auth";

connect("fitness");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = path.resolve(__dirname, "../../proto/dist");
app.use("/auth", auth);
app.use(express.json());

app.use("/api/tutorials", authenticateUser, tutorials);

// Redirect root to login page
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// Serve public HTML pages without auth
app.get("/login.html", (req, res) => {
  res.sendFile("login.html", { root: staticDir });
});

app.get("/newuser.html", (req, res) => {
  res.sendFile("newuser.html", { root: staticDir });
});

// Protect all other HTML pages
app.get("/:file.html", authenticateUser, (req, res) => {
  const file = req.path.substring(1);
  res.sendFile(file, { root: staticDir });
});

// API route for client-side fetch (unrelated to auth)
app.get("/tutorials", (req: Request, res: Response) => {
  Tutorials.index().then((data) => {
    res.set("Content-Type", "application/json").send(JSON.stringify(data));
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
