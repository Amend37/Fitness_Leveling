// src/routes/tutorials.ts
import express, { Request, Response } from "express";
import { Tutorial } from "../models/tutorial";
import Tutorials from "../services/tutorial-svc";

const router = express.Router();

// GET all tutorials
router.get("/", (req: Request, res: Response) => {
  Tutorials.index()
    .then((list: Tutorial[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET tutorial by ID
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Tutorials.get(id)
    .then((tut: Tutorial) => res.json(tut))
    .catch((err) => res.status(404).send(err));
});

// POST (create) a new tutorial
router.post("/", (req: Request, res: Response) => {
  const newTutorial = req.body;

  Tutorials.create(newTutorial)
    .then((tut: Tutorial) => res.status(201).json(tut))
    .catch((err) => res.status(500).send(err));
});

// PUT (update) a tutorial by ID
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const newTutorial = req.body;

  Tutorials.update(id, newTutorial)
    .then((tut: Tutorial) => res.json(tut))
    .catch((err) => res.status(404).send(err));
});

// DELETE tutorial by ID
router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Tutorials.remove(id)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
