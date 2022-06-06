import { Document, Schema, model } from "mongoose";

export interface CommentInput {
  comment: string;
}

export interface CommentDocument extends CommentInput, Document {
  blog: Schema.Types.ObjectId;
  created_at: Date;
  created_by: Schema.Types.ObjectId;
}

const commentBlog = new Schema<CommentDocument>({
  comment: { type: String, required: true },
  blog: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
    required: [true, "A comment must belongs to a blog"],
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A comment must belongs to a user"],
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

const Comment = model<CommentDocument>("Comment", commentBlog);

export default Comment;
