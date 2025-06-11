"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongo_1 = require("./services/mongo");
const tutorial_svc_1 = __importDefault(require("./services/tutorial-svc"));
const tutorials_1 = __importDefault(require("./routes/tutorials"));
const auth_1 = require("./routes/auth");
const auth_2 = __importDefault(require("./routes/auth"));
const promises_1 = __importDefault(require("fs/promises"));
(0, mongo_1.connect)("fitness");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const staticDir = path_1.default.resolve(__dirname, "../../app/dist");
app.use(express_1.default.json());
// API routes
app.use("/auth", auth_2.default);
app.use("/api/tutorials", auth_1.authenticateUser, tutorials_1.default);
app.use("/app", async (req, res) => {
    const indexHtml = path_1.default.resolve(staticDir, "index.html");
    const html = await promises_1.default.readFile(indexHtml, "utf8");
    res.send(html);
});
// Public pages
app.get("/", (req, res) => {
    res.redirect("/login.html");
});
app.use(express_1.default.static(staticDir));
app.get("/login.html", (req, res) => {
    res.sendFile("login.html", { root: staticDir });
});
app.get("/newuser.html", (req, res) => {
    res.sendFile("newuser.html", { root: staticDir });
});
app.get("/:file.html", auth_1.authenticateUser, (req, res) => {
    res.sendFile(req.params.file + ".html", { root: staticDir });
});
// Example API
app.get("/tutorials", async (req, res) => {
    const data = await tutorial_svc_1.default.index();
    res.json(data);
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
