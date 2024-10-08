import { getAllAsync, postWithJsonAsync, deleteAsync } from "../utils/request";

export const getAllReviewService = async () => {
  const result = await getAllAsync("/Reviews");
  return result;
}

export const createReviewsService = async (data) => {
  const result = await postWithJsonAsync("/Reviews", data);
  return result;
}

export const deleteReviewsService = async (data) => {
  const result = await deleteAsync("/Reviews/" + data);
  return result;
}

export const getReviewsByProductOptionIdService = async (productOptionID) => {
  const result = await getAllAsync(`/Reviews/${productOptionID}`);
  return result;
}