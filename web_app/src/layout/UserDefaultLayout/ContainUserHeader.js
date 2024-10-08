import UserNotLoggedInHeader from "../../components/HeaderLayout/UserNotLoggedInHeader";
import { useEffect, useState } from "react";
import { getCookie } from "../../helpers/cookies";
import UserLoggedInHeader from "../../components/HeaderLayout/UserLoggedInHeader";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../actions/reRender";
import CartLayout from "../../components/HeaderLayout/CartLayout";
import { NavLink } from "react-router-dom";
import FavoritesLayout from "../../components/HeaderLayout/FavoritesLayout";
import NotLoggedInYet from "../../components/NotLoggedInYet";

const ContainUserHeader = () => {
  const [islogin, setIsLogin] = useState(false)
  const [token, setToken] = useState()
  const dispath = useDispatch()
  const isRender = useSelector(state => state.reRender)
  const [showModalLogin, setShowModalLogin] = useState(false)

  useEffect(() => {
    const getToken = getCookie("hthToken");
    if (getToken) {
      setIsLogin(true)
      setToken(getToken)
    }
    else {
      setIsLogin(false)
    }
    if (isRender == true) {
      dispath(reRender(false))
    }
  }, [isRender, dispath])

  return (
    <>
      <div className="bottom__blockUser">
        <NavLink to="/user/favorites"><FavoritesLayout /></NavLink>
        <NavLink to="/cart"><CartLayout /></NavLink>
        {islogin ? <UserLoggedInHeader token={token} /> : <UserNotLoggedInHeader />}
      </div>
    </>
  );
}

export default ContainUserHeader;