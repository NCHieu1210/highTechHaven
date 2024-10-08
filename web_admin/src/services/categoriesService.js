import { deleteAsync, deleteRangeAsync, getAllByTokeAsync, postAsync, putAsync } from "../utils/request";

export const getAllCategoriesService = async () => {
  const result = await getAllByTokeAsync("/admin/Categories/get-by-admin");
  return result;
}

export const createCategoryService = async (data) => {
  const result = await postAsync("/admin/Categories", data);
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