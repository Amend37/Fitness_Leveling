"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/tutorials.ts
const express_1 = __importDefault(require("express"));
const tutorial_svc_1 = __importDefault(require("../services/tutorial-svc"));
const router = express_1.default.Router();
// GET all tutorials
router.get("/", (req, res) => {
    tutorial_svc_1.default.index()
        .then((list) => res.json(list))
        .catch((err) => res.status(500).send(err));
});
// GET tutorial by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    tutorial_svc_1.default.get(id)
        .then((tut) => res.json(tut))
        .catch((err) => res.status(404).send(err));
});
// POST (create) a new tutorial
router.post("/", (req, res) => {
    const newTutorial = req.body;
    tutorial_svc_1.default.create(newTutorial)
        .then((tut) => res.status(201).json(tut))
        .catch((err) => res.status(500).send(err));
});
// PUT (update) a tutorial by ID
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const newTutorial = req.body;
    tutorial_svc_1.default.update(id, newTutorial)
        .then((tut) => res.json(tut))
        .catch((err) => res.status(404).send(err));
});
// DELETE tutorial by ID
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    tutorial_svc_1.default.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});
exports.default = router;
