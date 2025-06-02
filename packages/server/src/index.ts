import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Tutorials from "./services/tutorial-svc";
import tutorials from "./routes/tutorials";
connect("fitness");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "../proto/dist";
app.use(express.static(staticDir));
app.use(express.json());
app.use("/api/tutorials", tutorials);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: staticDir });
});

app.get("/tutorials", (req: Request, res: Response) => {
  Tutorials.index().then((data) => {
    res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
  });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
