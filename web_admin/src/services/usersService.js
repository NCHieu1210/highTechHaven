import { login, getUserByTokenAsync, getAllByTokenAsync, postAsync, putAsync, deleteAsync } from "../utils/request";

export const loginService = async (username, password) => {
  const result = await login("/Auth/login", username, password);
  return result;
}

export const getUserByTokenService = async () => {
  const result = await getUserByTokenAsync("/Users/get-by-token");
  return result;
}

export const getAllUserService = async () => {
  const result = await getAllByTokenAsync("/admin/Users");
  return result;
}

export const getAllRolesService = async () => {
  const result = await getAllByTokenAsync("/admin/Users/roles");
  return result;
}

export const createUserService = async (data) => {
  const result = await postAsync("/admin/Users/register", data);
  return result;
}

export const updateUserService = async (id, data) => {
  const result = await putAsync(`/admin/Users/update/${id}`, data);
  return result;
}

export const updateUserDetailsService = async (data) => {
  const result = await putAsync(`/Users/update`, data);
  return result;
}

export const deleteUserService = async (id) => {
  const result = await deleteAsync(`/admin/users/delete/${id}`);
  return result;
}