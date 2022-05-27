import { Schema, Document, model } from "mongoose";

export interface BlogInput {
  title: string;
  content: string;
  coverImage: string;
  flair?: string;
}

export interface BlogDocument extends BlogInput, Document {
  created_at: Date;
  created_by: Schema.Types.ObjectId;
  featured: Boolean;
  verified: Boolean;
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
  featured: { type: Boolean, default: false },
  verified: {
    type: Boolean,
    default: false,
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

// Index
blogSchema.index({ featured: 1 });

// Sorting blogs by featured
blogSchema.pre("find", function (next) {
  this.sort({ featured: "desc" });

  next();
});

// Populating document with author
blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "created_by",
    select: "name photo",
  });

  next();
});

export default model<BlogDocument>("Blog", blogSchema);
