import Like from "../db/models/Like";
import User from "../db/models/User";
import Post from "../db/models/Post";
import Notification from "../db/models/Notification";

import HttpExeption from "../utils/HttpExeption";

import { UserDocument } from "../db/models/User";
import { AddLikeSchema } from "../validations/likes.schema";

interface IToggleLike {
  postId: AddLikeSchema;
}

export const toggleLike = async (
  postId: IToggleLike,
  { _id }: UserDocument
): Promise<{ liked: boolean; likesCount: number }> => {
  const userId = _id;
  const user: UserDocument | null = await User.findById(userId);
  if (!user) throw HttpExeption(404, `User not found`);

  const post = await Post.findById(postId);
  if (!post) throw HttpExeption(404, `Post with id=${postId} not found`);

  const del = await Like.deleteOne({ postId, userId });

  if (del.deletedCount === 1) {
    const updated = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likesCount: -1 } },
      { new: true, projection: { likesCount: 1 }, timestamps: false }
    );
    return { liked: false, likesCount: updated!.likesCount };
  }

  try {
    await Like.create({ postId, userId });
  } catch (error: any) {
    if (error?.code !== 11000) throw error; 
  }
  const updated = await Post.findByIdAndUpdate(
    postId,
    { $inc: { likesCount: 1 } },
    { new: true, projection: { likesCount: 1 }, timestamps: false }
  );

  await Notification.create({
    recipientId: post.userId, 
    senderId: userId, 
    type: "like",
    postId: postId,
  });
  return { liked: true, likesCount: updated!.likesCount };
};