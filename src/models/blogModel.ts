import { Schema, Document, model } from "mongoose";

export interface BlogInput {
  title: string;
  coverImage: string;
  content: string;
  flair?: string;
}

export interface BlogDocument extends BlogInput, Document {
  created_at: Date;
  created_by: Schema.Types.ObjectId;
}

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
  created_at: {
    type: Date,
    default: new Date(),
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "created_by",
    select: "name photo",
  });

  next();
});

export default model<BlogDocument>("Blog", blogSchema);
