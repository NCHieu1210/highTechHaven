import { login, getAllAsync, getUserByTokenAsync, postAsync, putAsync, postWithJsonAsync } from "../utils/request";


export const loginService = async (username, password) => {
  const result = await login("/Auth/login", username, password);
  return result;
}

export const loginWithGoogleService = async () => {
  const result = await getAllAsync("/Auth/google-login");
  return result;
}

export const registerService = async (data) => {
  const result = await postAsync("/Auth/register", data);
  return result;
}

export const changePaswordService = async (data) => {
  const result = await postAsync("/Auth/change-password", data);
  return result;
}

export const forgotPasswordService = async (data) => {
  const result = await postWithJsonAsync("/Auth/forgot-password", data);
  return result;
}

export const resertPasswordService = async (data) => {
  const result = await postWithJsonAsync("/Auth/reset-password", data);
  return result;
}

export const getUserByTokenService = async () => {
  const result = await getUserByTokenAsync("/Users/get-by-token");
  return result;
}

export const updateUserDetailsService = async (data) => {
  const result = await putAsync(`/Users/update`, data);
  return result;
}
