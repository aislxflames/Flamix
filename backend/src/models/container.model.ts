import { model, Schema } from "mongoose";

export interface IContainer {
  name: String;
  image: String;
  env?: Record<string, string>;
  ports?: {
    iPort: number;
    ePort: number;
  };
}

export const containerSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  env: { type: Map, of: String },
  ports: [
    {
      iPort: Number,
      ePort: Number,
    },
  ],
});

export const Container = model<IContainer>("Container", containerSchema);
