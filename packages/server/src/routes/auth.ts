import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import credentials from "../services/credential-svc";

dotenv.config();
const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_SECRET";
const router = express.Router();

function create(username: string, password: string, userId?: string): Promise<Credential> {


router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string")
    res.status(400).send("Invalid input");
  else
    credentials.create(username, password)
      .then(creds => generateAccessToken(creds.username))
      .then(token => res.status(201).send({ token }))
      .catch(err => res.status(409).send({ error: err.message }));
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    res.status(400).send("Invalid input");
  else
    credentials.verify(username, password)
      .then(user => generateAccessToken(user))
      .then(token => res.status(200).send({ token }))
      .catch(() => res.status(401).send("Unauthorized"));
});

function generateAccessToken(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign({ username }, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err || !token) reject(err);
      else resolve(token);
    });
  });
}

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) res.status(401).end();
  else
    jwt.verify(token, TOKEN_SECRET, (err: any) => {
      if (err) res.status(403).end();
      else next();
    });
}

export default router;
