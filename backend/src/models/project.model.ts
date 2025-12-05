import { model, Schema, Document } from "mongoose";
import { type IContainer, containerSchema } from "./container.model.js";

export interface IProject extends Document {
  projectName: string;
  containers: IContainer[];
  createdAt: Date;
}

const projectSchema = new Schema<IProject>({
  projectName: { type: String, required: true, unique: true },
  containers: [containerSchema],
  createdAt: { type: Date, default: Date.now },
});

export const Project = model<IProject>("Project", projectSchema);
