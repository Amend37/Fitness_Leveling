import { Schema, model } from "mongoose";
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

// Get all tutorials
function index(): Promise<Tutorial[]> {
  return TutorialModel.find();
}

// Get one tutorial by title (optional enhancement)
function get(title: string): Promise<Tutorial | null> {
  return TutorialModel.findOne({ title });
}

export default { index, get };
