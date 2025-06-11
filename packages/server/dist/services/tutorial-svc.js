"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TutorialSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    target: { type: String, required: true, trim: true },
    steps: [String]
}, { collection: "tutorials" });
const TutorialModel = (0, mongoose_1.model)("Tutorial", TutorialSchema);
function index() {
    return TutorialModel.find();
}
function get(id) {
    return TutorialModel.findOne({ slug: id }).then((tut) => {
        if (!tut) {
            throw `${id} not found`;
        }
        return tut;
    });
}
function create(json) {
    const t = new TutorialModel(json);
    return t.save();
}
function update(id, tutorial) {
    return TutorialModel.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), tutorial, { new: true }).then((updated) => {
        if (!updated)
            throw `${id} not updated`;
        return updated;
    });
}
function remove(id) {
    return TutorialModel.findByIdAndDelete(new mongoose_1.Types.ObjectId(id)).then((deleted) => {
        if (!deleted)
            throw `${id} not deleted`;
    });
}
exports.default = { index, get, create, update, remove };
