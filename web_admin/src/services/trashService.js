import { getAllByTokeAsync, postAsync, postRangeAsync, deleteAsync } from "../utils/request";

export const getAllTrashService = async () => {
  const result = await getAllByTokeAsync("/admin/Trash");
  return result;
}

export const restoreProductsService = async (idProduct) => {
  const result = await postAsync(`/admin/Products/Restore/${idProduct}`);
  return result;
}

export const restoreRangeProductsService = async (idProducts) => {
  const result = await postRangeAsync("/admin/Products/RestoreRange", idProducts);
  return result;
}

export const restorePostsService = async (idProduct) => {
  const result = await postAsync(`/admin/Posts/Restore/${idProduct}`);
  return result;
}

export const restoreRangePostsService = async (idProducts) => {
  const result = await postRangeAsync("/admin/Posts/RestoreRange", idProducts);
  return result;
}

export const PermenentlyDeletedProductsService = async (idProducts) => {
  const result = await deleteAsync(`/admin/Products/permanently-deleted/${idProducts}`);
  return result;
}

export const PermenentlyDeletedPostsService = async (idProducts) => {
  const result = await deleteAsync(`/admin/Posts/permanently-deleted/${idProducts}`);
  return result;
}