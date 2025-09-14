

export type NotificationType = "follow" | "like" | "comment";

export type AsyncFunction<T extends unknown[], K> = (...args: T) => Promise<K>;

export type RequestDecorator = <T extends unknown[], K>(
  requestFunction: AsyncFunction<T, K>
) => (...args: T) => Promise<K>;

export type ModalType =
  | "createPost"
  | "viewPost"
  | "editSelection"
  | "editPost"
  | "deletePost"
  | null;