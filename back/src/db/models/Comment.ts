import { Schema, model, Document, Types } from "mongoose";

import { handleSaveError, setUpdateSettings } from "../../middlewares/mongoose";
interface IComment {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  text: string;
}

export type CommentDocument = IComment & Document<Types.ObjectId>;

const CommentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// --- Indexes ---
CommentSchema.index({ postId: 1, createdAt: -1 }, { name: "post_date" });

CommentSchema.post("save", handleSaveError);
CommentSchema.pre("findOneAndUpdate", setUpdateSettings);
CommentSchema.post("findOneAndUpdate", handleSaveError);

const Comment = model<IComment>("comment", CommentSchema);

export default Comment;
