import { getAllAsync, getAllByTokenAsync, postAsync } from "../utils/request";

export const getAllCommentsService = async () => {
  const result = await getAllAsync("/Comments");
  return result;
}
export const createCommentsService = async (data) => {
  const result = await postAsync("/Comments", data);
  return result;
}


export const getLikeCommentByTokenService = async () => {
  const result = await getAllByTokenAsync("/Liked/comments/get-by-token");
  return result;
}

export const createLikedService = async (data) => {
  const result = await postAsync(`/Liked/comments/${data}`);
  return result;
}