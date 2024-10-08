import { deleteAsync, deleteRangeAsync, getAllAsync, postAsync, putAsync, getAllByTokenAsync } from "../utils/request";

export const getAllCommentsService = async () => {
  const result = await getAllAsync("/Comments");
  return result;
}

export const getLikeCommentByTokenService = async () => {
  const result = await getAllByTokenAsync("/Liked/comments/get-by-token");
  return result;
}

export const getCommentsByProductIdService = async (data) => {
  const result = await getAllAsync(`/Comments/get-by-product/${data}`);
  return result;
}

export const getCommentsByPostIdService = async (data) => {
  const result = await getAllAsync(`/Comments/get-by-post/${data}`);
  return result;
}

export const createCommentsService = async (data) => {
  const result = await postAsync("/Comments", data);
  return result;
}

export const createLikedService = async (data) => {
  const result = await postAsync(`/Liked/comments/${data}`);
  return result;
}



export const updateCategoryService = async (id, data) => {
  const result = await putAsync(`/admin/Categories/${id}`, data);
  return result;
}

export const deleteCategoryService = async (data) => {
  const result = await deleteAsync("/admin/Categories/" + data);
  return result;
}

export const deleteRangeCategoriesService = async (data) => {
  const result = await deleteRangeAsync("/admin/Categories/delete-range", data);
  return result;
}