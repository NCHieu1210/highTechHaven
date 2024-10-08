import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../../../helpers/cookies";
import { Spin } from "antd";

const PrivateRouter = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("hthToken");
    if (token) {
      setIsLogin(true);
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
      {isLogin ? <Outlet /> : <Navigate to="/login"></Navigate >}
    </>
  );
}

export default PrivateRouter
