import { Types } from "mongoose";
import Like from "../db/models/Like";
import { IPostForLean } from "../db/models/Post";
import { IPostResponse } from "../services/posts.service";

const markPosts = async (
  posts: IPostForLean[],
  userId: Types.ObjectId
): Promise<IPostResponse[]> => {
  if (posts.length === 0) {
    return posts.map((post) => ({ ...post, isLikedByCurrentUser: false }));
  }

  const postIds = posts.map((p) => p._id);

  const likedPostIds = await Like.distinct("postId", {
    userId,
    postId: { $in: postIds },
  });

  const likedSet = new Set(likedPostIds.map((id) => String(id)));

  return posts.map((post) => ({
    ...post,
    isLikedByCurrentUser: likedSet.has(String(post._id)),
  }));
};

export default markPosts;
