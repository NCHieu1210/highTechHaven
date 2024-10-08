import { useNavigate } from "react-router-dom"
import { deleteCookie } from "../../../helpers/cookies"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../../actions/reRender";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.data.carts);

  useEffect(() => {
    deleteCookie("hthToken");
    dispatch(reRender(true));
    navigate("/login");
  }, [navigate, dispatch])
  return (
    <></>
  )
}
export default Logout