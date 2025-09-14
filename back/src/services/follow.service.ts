import Follow from "../db/models/Follow";
import User from "../db/models/User";
import Notification from "../db/models/Notification";

import HttpExeption from "../utils/HttpExeption";
import getCounts from "../utils/getCounts";

import { UserDocument } from "../db/models/User";

export interface IFollowStatus {
  following: boolean;
  targetFollowersCount: number;
  meFollowingCount: number;
}

export const followUser = async (
  targetId: string,
  { _id: me }: UserDocument
): Promise<IFollowStatus> => {
  if (me.toString() === targetId) {
    throw HttpExeption(400, "You cannot follow yourself");
  }

  const target = await User.findById(targetId);
  if (!target) throw HttpExeption(404, "User not found");

  try {
    await Follow.create({ followerId: me, followingId: targetId });
    await User.updateOne(
      { _id: targetId },
      { $inc: { followersCount: 1 } },
      { timestamps: false }
    );
    await User.updateOne(
      { _id: me },
      { $inc: { followingCount: 1 } },
      { timestamps: false }
    );
    await Notification.create({
      recipientId: targetId, 
      senderId: me, 
      type: "follow",
    });
  } catch (error: any) {
    if (error?.code !== 11000) throw error; 
  }

  const counts = await getCounts(targetId, me);

  return {
    following: true,
    ...counts,
  };
};

export const unfollowUser = async (
  targetId: string,
  { _id: me }: UserDocument
): Promise<IFollowStatus> => {
  const target = await User.findById(targetId);
  if (!target) throw HttpExeption(404, "User not found");

  const follow = await Follow.findOneAndDelete({
    followerId: me,
    followingId: targetId,
  });

  if (follow) {
    await User.updateOne(
      { _id: targetId },
      { $inc: { followersCount: -1 } },
      { timestamps: false }
    );
    await User.updateOne(
      { _id: me },
      { $inc: { followingCount: -1 } },
      { timestamps: false }
    );
  }

  const counts = await getCounts(targetId, me);

  return {
    following: false,
    ...counts,
  };
};