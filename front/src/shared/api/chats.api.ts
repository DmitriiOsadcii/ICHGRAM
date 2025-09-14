import backend from "./instance";
export const listConversationsApi = async () => {
  const { data } = await backend.get("/chats");
  return data; // [{ _id, participants, lastMessageText, lastMessageAt }]
};