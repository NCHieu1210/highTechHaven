import { deleteAsync, deleteRangeAsync, getAllAsync, postAsync, putByJsonAsync } from "../utils/request";

export const getAllBlogsService = async () => {
  const result = await getAllAsync("/Blogs");
  return result;
}

export const createBlogService = async (data) => {
  const result = await postAsync("/admin/Blogs", data);
  return result;
}

export const updateBlogService = async (id, data) => {
  const result = await putByJsonAsync(`/admin/Blogs/${id}`, data);
  return result;
}

export const deleteBlogService = async (data) => {
  const result = await deleteAsync("/admin/Blogs/" + data);
  return result;
}

export const deleteRangeBlogService = async (data) => {
  const result = await deleteRangeAsync("/admin/Blogs/delete-range", data);
  return result;
}