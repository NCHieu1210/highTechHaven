import { deleteAsync, deleteRangeAsync, getAllAsync, postAsync, putAsync, getAllByTokenAsync } from "../utils/request";

export const getAllPostsService = async () => {
  const result = await getAllAsync("/Posts");
  return result;
}

export const getPostsBySlugService = async (slug) => {
  const result = await getAllAsync(`/Posts/${slug}`);
  return result;
}

export const getPostsByIdService = async (id) => {
  const result = await getAllAsync(`/Posts/${id}`);
  return result;
}
export const getPostBySearchService = async (search) => {
  let path = `/Posts/Search?search=${search}`
  console.log(path)
  const result = await getAllAsync(path);
  return result;
}

export const getLikedPostByTokenService = async () => {
  const result = await getAllByTokenAsync("/Liked/posts/get-by-token");
  return result;
}

export const createPostsService = async (data) => {
  const result = await postAsync("/admin/Posts", data);
  return result;
}

export const updatePostService = async (id, data) => {
  const result = await putAsync(`/admin/Posts/${id}`, data);
  return result;
}

export const deletePostService = async (data) => {
  const result = await deleteAsync("/admin/Posts/" + data);
  return result;
}

export const deleteRangePostsService = async (data) => {
  const result = await deleteRangeAsync("/admin/Posts/delete-range", data);
  return result;
}