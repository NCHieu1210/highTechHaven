import { jwtDecode } from "jwt-decode";
import { getCookie } from "./cookies";

export const checkRolesInvalid = () => {
  const token = getCookie("hthToken");
  let rolesIsValid = false;
  try {
    const decodedToken = jwtDecode(token);
    const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (Array.isArray(roles)) {
      if (roles.includes("Customer")) {
        rolesIsValid = true;
      }
    }
    else if (roles.includes("Customer")) {
      rolesIsValid = true;
    }
  }
  catch (error) {
    console.error('Invalid token:', error);
    rolesIsValid = false;
  }
  return rolesIsValid;
}