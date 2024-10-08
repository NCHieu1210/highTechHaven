import { notification } from "antd";
import { useLocation } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as Cookies from "../../../helpers/cookies";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { reRender } from "../../../actions/reRender";


const LoginWithGoogle = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    notification.success({
      message: 'Đăng nhập thành công',
      description: 'Bạn đã đăng nhập thành công!',
    });
    Cookies.setCookie("hthToken", token, 1);
    dispatch(reRender(true));
    navigate("/");
  }, []);

  return (<></>)
}

export default LoginWithGoogle;