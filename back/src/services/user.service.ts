import mongoose from "mongoose";

import Follow from "../db/models/Follow";
import User from "../db/models/User";
import { UserDocument } from "../db/models/User";
import publicUser from "../utils/userJs";
import HttpExeption from "../utils/HttpExeption";
import {
  ISearchResultResponse,
  ISearchUsersOptions,
  IListOptions,
  IPaginatedUsers,
} from "../typescript/interfaces";
import { WithFollowFlag } from "../typescript/type";

/* =========================
   CONSTANTS
   ========================= */
const errors = {
  USER_NOT_FOUND: "User not found",
} as const;

const collections = {
  FOLLOWS: "follows",
  USERS: "users",
} as const;

const projection = {
  _id: 1,
  email: 1,
  fullName: 1,
  username: 1,
  biography: 1,
  profilePhoto: 1,
  website: 1,
  verify: 1,
  followersCount: 1,
  followingCount: 1,
} as const;

const SORT_BY_POPULARITY = Object.freeze({
  followersCount: -1,
  username: 1,
});

const SORT_BY_POPULARITY_NESTED = Object.freeze({
  "user.followersCount": -1,
  "user.username": 1,
});

/* =========================
   HELPERS
   ========================= */
const ensureUserExists = async (id: string | mongoose.Types.ObjectId) => {
  const user = await User.findById(id);
  if (!user) throw HttpExeption(404, errors.USER_NOT_FOUND);
  return user;
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* =========================
   SEARCH
   ========================= */
export const searchUsers = async (
  q: string,
  { _id: currentUserId }: UserDocument,
  { page, limit }: ISearchUsersOptions
): Promise<ISearchResultResponse> => {
  await ensureUserExists(currentUserId);

  const rx = escapeRegex(q);

  const matchStage: any = {
    $and: [
      { _id: { $ne: currentUserId } },
      {
        $or: [
          { username: { $regex: rx, $options: "i" } },
          { fullName: { $regex: rx, $options: "i" } },
        ],
      },
    ],
  };

  const skip = (page - 1) * limit;

  const pipeline: any[] = [
    { $match: matchStage },

    {
      $lookup: {
        from: collections.FOLLOWS,
        let: { targetId: "$_id", me: currentUserId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$followerId", "$$me"] },
                  { $eq: ["$followingId", "$$targetId"] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "followEdge",
      },
    },
    {
      $addFields: {
        isFollowedByCurrentUser: { $gt: [{ $size: "$followEdge" }, 0] },
      },
    },

    { $sort: SORT_BY_POPULARITY },

    { $skip: skip },
    { $limit: limit + 1 },

    { $project: projection },
  ];

  const items = await User.aggregate<WithFollowFlag>(pipeline).exec();
  const hasMore = items.length > limit;
  if (hasMore) items.pop();

  return {
    users: items,
    page,
    limit,
    hasMore,
  };
};

export const getUserById = async (
  id: string,
  { _id: currentUserId }: UserDocument
): Promise<WithFollowFlag> => {
  const user: UserDocument | null = await User.findById(id);
  if (!user) throw HttpExeption(404, errors.USER_NOT_FOUND);

  let isFollowedByCurrentUser = false;
  if (!currentUserId.equals(user._id)) {
    const followExists = await Follow.exists({
      followerId: currentUserId,
      followingId: user._id,
    });
    isFollowedByCurrentUser = Boolean(followExists);
  }

  const responceUser = publicUser(user);
  return {
    ...responceUser,
    isFollowedByCurrentUser,
  };
};

/* =========================
   FOLLOWERS
   ========================= */
export const getFollowers = async ({
  targetUserId,
  currentUserId,
  page,
  limit,
}: IListOptions): Promise<IPaginatedUsers> => {
  await ensureUserExists(targetUserId);

  const skip = (page - 1) * limit;
  const target = new mongoose.Types.ObjectId(targetUserId);

  const pipeline: any[] = [
    { $match: { followingId: target } },

    {
      $lookup: {
        from: collections.USERS,
        localField: "followerId",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: projection }],
      },
    },
    { $unwind: "$user" },

    {
      $lookup: {
        from: collections.FOLLOWS,
        let: { listedUserId: "$user._id", me: currentUserId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$followerId", "$$me"] },
                  { $eq: ["$followingId", "$$listedUserId"] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "followEdge",
      },
    },
    {
      $addFields: {
        isFollowedByCurrentUser: { $gt: [{ $size: "$followEdge" }, 0] },
      },
    },

    { $sort: SORT_BY_POPULARITY_NESTED },

    { $skip: skip },
    { $limit: limit + 1 },

    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$user",
            { isFollowedByCurrentUser: "$isFollowedByCurrentUser" },
          ],
        },
      },
    },
  ];

  const items = await Follow.aggregate<WithFollowFlag>(pipeline).exec();
  const hasMore = items.length > limit;
  if (hasMore) items.pop();

  return {
    users: items,
    page,
    limit,
    hasMore,
  };
};

/* =========================
   FOLLOWING
   ========================= */
export const getFollowing = async ({
  targetUserId,
  currentUserId,
  page,
  limit,
}: IListOptions): Promise<IPaginatedUsers> => {
  await ensureUserExists(targetUserId);

  const skip = (page - 1) * limit;
  const target = new mongoose.Types.ObjectId(targetUserId);

  const pipeline: any[] = [
    { $match: { followerId: target } },

    {
      $lookup: {
        from: collections.USERS,
        localField: "followingId",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: projection }],
      },
    },
    { $unwind: "$user" },

    {
      $lookup: {
        from: collections.FOLLOWS,
        let: { listedUserId: "$user._id", me: currentUserId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$followerId", "$$me"] },
                  { $eq: ["$followingId", "$$listedUserId"] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "followEdge",
      },
    },
    {
      $addFields: {
        isFollowedByCurrentUser: { $gt: [{ $size: "$followEdge" }, 0] },
      },
    },

    { $sort: SORT_BY_POPULARITY_NESTED },

    { $skip: skip },
    { $limit: limit + 1 },

    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [
            "$user",
            { isFollowedByCurrentUser: "$isFollowedByCurrentUser" },
          ],
        },
      },
    },
  ];

  const items = await Follow.aggregate<WithFollowFlag>(pipeline).exec();
  const hasMore = items.length > limit;
  if (hasMore) items.pop();

  return {
    users: items,
    page,
    limit,
    hasMore,
  };
};

/* =========================
   USERS
   ========================= */
export const getUsersService = async ({
  _id: currentUserId,
}: UserDocument) => {
  const users = await User.find({ _id: { $ne: currentUserId } })
    .select("username fullName profilePhoto")
    .lean();

  const followed = await Follow.find({ followerId: currentUserId })
    .select("followingId")
    .lean();

  const followedIds = new Set(followed.map((f) => f.followingId.toString()));

  return users.map((user) => ({
    ...user,
    isFollowedByCurrentUser: followedIds.has(user._id.toString()),
  }));
};