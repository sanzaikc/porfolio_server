import { Schema, Document, model } from "mongoose";
import slugify from "slugify";

export const flairEnums: string[] = ["article", "notes", "facts"];

export interface BlogInput {
  title: string;
  content: string;
  coverImage?: string;
  flair?: string;
}

export interface BlogDocument extends BlogInput, Document {
  slug: String;
  created_at: Date;
  created_by: Schema.Types.ObjectId;
  featured: Boolean;
  verified: Boolean;
  disable_comments: Boolean;
}

const blogSchema = new Schema<BlogDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: String,
    coverImage: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    flair: {
      type: String,
      enum: {
        values: flairEnums,
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
      default: new Date(Date.now()),
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    disable_comments: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index
blogSchema.index({ featured: 1 });

// Virtual comments fields to populate
blogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blog",
});

// Attacting slug before saving doc
blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

// Sorting blogs by featured
blogSchema.pre("find", function (next) {
  this.sort({ featured: "desc", created_at: "desc" });

  next();
});

// Populating document
blogSchema.pre(/^find/, function (next) {
  this.populate([
    // Populating document with author
    {
      path: "created_by",
      select: "name photo",
    },
    // Populating document with comments
    { path: "comments" },
  ]);

  next();
});

const Blog = model<BlogDocument>("Blog", blogSchema);

export default Blog;
