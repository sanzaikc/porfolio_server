import { Schema, Document, model } from "mongoose";

export interface BlogInput {
  title: string;
  coverImage: string;
  content: string;
  flair?: string;
}

export interface BlogDocument extends BlogInput, Document {}

const blogSchema = new Schema<BlogDocument>({
  title: {
    type: String,
    required: true,
  },
  coverImage: String,
  content: {
    type: String,
    required: true,
  },
  flair: {
    type: String,
    enum: {
      values: ["article", "notes", "facts"],
      message: "Invalid blog flair",
    },
    default: "article",
  },
});

export default model<BlogDocument>("Blog", blogSchema);
