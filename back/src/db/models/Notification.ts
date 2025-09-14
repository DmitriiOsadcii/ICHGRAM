import { Schema, model, Document, Types } from "mongoose";

import { handleSaveError, setUpdateSettings } from "../../middlewares/mongoose";
export type NotificationType = "follow" | "like" | "comment";

interface INotification {
  recipientId: Types.ObjectId; 
  senderId: Types.ObjectId; 
  type: NotificationType;
  postId?: Types.ObjectId;
  commentId?: Types.ObjectId;
  isRead: boolean;
}

export type NotificationDocument = INotification & Document<Types.ObjectId>;

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: ["follow", "like", "comment"],
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "post",
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "comment",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: { createdAt: true, updatedAt: false } }
);


NotificationSchema.index(
  { recipientId: 1, createdAt: -1 },
  { name: "inbox_recent" }
);
NotificationSchema.index(
  { recipientId: 1, isRead: 1, createdAt: -1 },
  { name: "unread_by_recipient" }
);

NotificationSchema.post("save", handleSaveError);
NotificationSchema.pre("findOneAndUpdate", setUpdateSettings);
NotificationSchema.post("findOneAndUpdate", handleSaveError);

const Notification = model<INotification>("notification", NotificationSchema);

export default Notification;