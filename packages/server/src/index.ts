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

app.use(express.json());

// API routes
app.use("/auth", auth);
app.use("/api/tutorials", authenticateUser, tutorials);

// Public pages
app.get("/", (req: Request, res: Response) => {
  res.redirect("/login.html");
});

app.use(express.static(staticDir));

app.get("/login.html", (req: Request, res: Response) => {
  res.sendFile("login.html", { root: staticDir });
});

app.get("/newuser.html", (req: Request, res: Response) => {
  res.sendFile("newuser.html", { root: staticDir });
});

app.get("/:file.html", authenticateUser, (req: Request, res: Response) => {
  res.sendFile(req.params.file + ".html", { root: staticDir });
});

// Example API
app.get("/tutorials", async (req: Request, res: Response) => {
  const data = await Tutorials.index();
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
