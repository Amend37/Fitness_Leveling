"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var tutorial_svc_exports = {};
__export(tutorial_svc_exports, {
  default: () => tutorial_svc_default
});
module.exports = __toCommonJS(tutorial_svc_exports);
var import_mongoose = require("mongoose");
const TutorialSchema = new import_mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    target: { type: String, required: true, trim: true },
    steps: [String]
  },
  { collection: "tutorials" }
);
const TutorialModel = (0, import_mongoose.model)("Tutorial", TutorialSchema);
function index() {
  return TutorialModel.find();
}
function get(title) {
  return TutorialModel.findOne({ title });
}
var tutorial_svc_default = { index, get };
