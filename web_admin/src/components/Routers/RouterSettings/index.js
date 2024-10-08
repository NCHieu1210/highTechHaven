import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { getCookie } from "../../../helpers/cookies";
import { Spin } from "antd";
import { routes } from "../../../routers";

const RouterSettings = () => {
  const [validRoles, setValidRoles] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("hthTokenAdm");
    if (token) {
      setIsLogin(true);
      try {
        const decodedToken = jwtDecode(token);
        const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (Array.isArray(roles)) {
          if (roles.includes("Administrator") || roles.includes("StoreManager") || roles.includes("Marketing")) {
            setValidRoles(true);
          }
        }
        else if (roles.includes("Administrator") || roles.includes("StoreManager") || roles.includes("Marketing")) {
          setValidRoles(true);
        }
      }
      catch (error) {
        console.error('Invalid token:', error);
        setValidRoles(false);
      }
    }
    else {
      setIsLogin(false);
    }
    setLoading(false);

  }, []);

  if (loading) {
    return <><Spin spinning="true" fullscreen></Spin></>; // Hiển thị trạng thái đang tải khi useEffect đang chạy
  }
  return (
    <>
      {validRoles && isLogin ? <Outlet /> : <Navigate to="/admin/login"></Navigate >}
    </>
  );
}

export default RouterSettings;