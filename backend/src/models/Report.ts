import { Schema, model, Document } from "mongoose";

export interface IReport extends Document {
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  latitude: number;
  longitude: number;
  lostDate: Date;
  type: "lost" | "found";
  createdBy: Schema.Types.ObjectId;
}

const schema = new Schema<IReport>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    lostDate: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IReport>("Report", schema);