import { useNavigate } from "react-router-dom"
import { deleteCookie } from "../../helpers/cookies"
import { useEffect } from "react";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    deleteCookie("hthTokenAdm");
    navigate("/admin/login");
  }, [navigate]);

  return (
    <></>
  )
}
export default Logout;