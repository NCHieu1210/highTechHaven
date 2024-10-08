import { getAllAsync, postWithJsonAsync, deleteAsync, putWithQueryAsync } from "../utils/request";

export const getAllReviewService = async () => {
  const result = await getAllAsync("/Reviews");
  return result;
}

export const createReviewsService = async (data) => {
  const result = await postWithJsonAsync("/Reviews", data);
  return result;
}

export const confirmReviewsService = async (reviewId) => {
  const result = await putWithQueryAsync(`/admin/Reviews/confirm/${reviewId}`);
  return result;
}

export const deleteReviewsService = async (reviewId) => {
  const result = await deleteAsync("/admin/Reviews/" + reviewId);
  return result;
}
