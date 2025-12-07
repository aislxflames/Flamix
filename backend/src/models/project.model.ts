import { model, Schema, Document } from "mongoose";
import { type IContainer, containerSchema } from "./container.model.js";

export interface IProject extends Document {
  projectName: string;
  containers: IContainer[];
  env: string;
}

const projectSchema = new Schema<IProject>(
  {
    projectName: { type: String, required: true, unique: true },
    env: String,
    containers: [containerSchema],
  },
  { timestamps: true },
);

export const Project = model<IProject>("Project", projectSchema);
