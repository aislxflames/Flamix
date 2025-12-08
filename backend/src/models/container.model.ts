import { model, Schema } from "mongoose";

export interface IContainer {
  name: string;
  image: string;
  status: "Running" | "Starting" | "Deploying" | "Stopped";
  env?: Record<string, string>;
  ports?: {
    iPort?: number;
    ePort?: number;
  }[];
  gitUrl?: string;

  domains?: {
    domain: string;
    displayName: string;
    port: number;
    ssl: boolean;
  }[];
}

const domainSchema = new Schema(
  {
    domain: { type: String, required: true },
    displayName: { type: String, required: true },
    port: { type: Number, required: true },
    ssl: { type: Boolean, default: false },
  },
  { _id: false },
);

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

  // UPDATED 👇
  domains: { type: [domainSchema], default: [] },
});

export const Container = model<IContainer>("Container", containerSchema);
