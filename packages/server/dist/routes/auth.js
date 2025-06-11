"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const credential_svc_1 = __importDefault(require("../services/credential-svc"));
dotenv_1.default.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";
const router = express_1.default.Router();
router.post("/register", (req, res) => {
    console.log("POST /auth/login hit");
    const { username, password } = req.body;
    if (typeof username !== "string" || typeof password !== "string")
        res.status(400).send("Invalid input");
    else
        credential_svc_1.default.create(username, password)
            .then(creds => generateAccessToken(creds.username))
            .then(token => res.status(201).send({ token }))
            .catch(err => res.status(409).send({ error: err.message }));
});
router.post("/login", (req, res) => {
    console.log("POST /auth/login hit");
    const { username, password } = req.body;
    if (!username || !password)
        res.status(400).send("Invalid input");
    else
        credential_svc_1.default.verify(username, password)
            .then(user => generateAccessToken(user.username))
            .then(token => res.status(200).send({ token }))
            .catch(() => res.status(401).send("Unauthorized"));
});
function generateAccessToken(username) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ username }, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
            if (err || !token)
                reject(err);
            else
                resolve(token);
        });
    });
}
function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
        res.status(401).end();
    else
        jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (err) => {
            if (err)
                res.status(403).end();
            else
                next();
        });
}
exports.default = router;
