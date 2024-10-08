import { getCookie } from "./cookies";

export const checkLoggedIn = () => {
  const getToken = getCookie("hthToken");
  if (getToken) {
    return true;
  } else {
    return false;
  }
};