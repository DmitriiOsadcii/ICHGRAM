import { Schema, model, Document, Types } from "mongoose";

import { handleSaveError, setUpdateSettings } from "../../middlewares/mongoose";
export interface IConversation {
  participants: Types.ObjectId[]; 
  key: string; 
  lastMessageAt?: Date;
  lastMessageText?: string;
}

export type ConversationDocument = IConversation & Document<Types.ObjectId>;

const ConversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "user",
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    lastMessageAt: {
      type: Date,
    },
    lastMessageText: {
      type: String,
    },
  },
  { timestamps: true }
);



ConversationSchema.index({ participants: 1 });

ConversationSchema.index({ key: 1 }, { unique: true, name: "uniq_pair_key" });

ConversationSchema.post("save", handleSaveError);
ConversationSchema.pre("findOneAndUpdate", setUpdateSettings);
ConversationSchema.post("findOneAndUpdate", handleSaveError);

const Conversation = model<IConversation>("conversation", ConversationSchema);

export default Conversation;