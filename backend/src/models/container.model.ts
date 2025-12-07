import { model, Schema } from "mongoose";

export interface IContainer {
  name: String;
  image: String;
  status: "Running" | "Starting" | "Deploying" | "Stopped";
  env?: Record<string, string>;
  ports?: {
    iPort?: number;
    ePort?: number;
  };
  gitUrl?: String;
  domains?: string[];
}

export const containerSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  status: {
    type: String,
    enum: ["Running", "Starting", "Deploying", "Stopped"],
    default: "Stopped",
  },

  env: { type: Map, of: String },

  ports: [
    {
      iPort: Number,
      ePort: Number,
    },
  ],

  gitUrl: String,
  domains: [{ type: String, default: "localhost" }],
});

export const Container = model<IContainer>("Container", containerSchema);
