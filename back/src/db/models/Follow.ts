import { Schema, model, Document, Types } from "mongoose";

import { handleSaveError, setUpdateSettings } from "../../middlewares/mongoose";
interface IFollow {
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
}

export type FollowDocument = IFollow & Document<Types.ObjectId>;

const FollowSchema = new Schema<IFollow>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

FollowSchema.index(
  { followerId: 1, followingId: 1 },
  { unique: true, name: "uniq_follow" }
);
FollowSchema.index({ followerId: 1 }, { name: "by_follower" });
FollowSchema.index({ followingId: 1 }, { name: "by_following" });

FollowSchema.post("save", handleSaveError);
FollowSchema.pre("findOneAndUpdate", setUpdateSettings);
FollowSchema.post("findOneAndUpdate", handleSaveError);

const Follow = model<IFollow>("follow", FollowSchema);

export default Follow;