import { Schema, model, Types } from "mongoose";
import { Tutorial } from "../models/tutorial";

const TutorialSchema = new Schema<Tutorial>(
  {
    title: { type: String, required: true, trim: true },
    target: { type: String, required: true, trim: true },
    steps: [String]
  },
  { collection: "tutorials" }
);

const TutorialModel = model<Tutorial>("Tutorial", TutorialSchema);

function index(): Promise<Tutorial[]> {
  return TutorialModel.find();
}

function get(id: any) {
  return TutorialModel.findOne({ slug: id }).then((tut) => {
    if (!tut) {
      throw `${id} not found`;
    }
    return tut;
  });
}

function create(json: Tutorial): Promise<Tutorial> {
  const t = new TutorialModel(json);
  return t.save();
}

function update(id: string, tutorial: Tutorial): Promise<Tutorial> {
  return TutorialModel.findByIdAndUpdate(
    new Types.ObjectId(id),
    tutorial,
    { new: true }
  ).then((updated) => {
    if (!updated) throw `${id} not updated`;
    return updated as Tutorial;
  });
}

function remove(id: string): Promise<void> {
  return TutorialModel.findByIdAndDelete(new Types.ObjectId(id)).then(
    (deleted) => {
      if (!deleted) throw `${id} not deleted`;
    }
  );
}

export default { index, get, create, update, remove };
