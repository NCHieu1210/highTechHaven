import { EditOutlined, LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUserByTokenService } from "../../services/usersService";
import { getPathImage } from "../../helpers/getPathImage";
import NotificationLayout from "./NotificationLayout";

const UserLoggedInHeader = () => {
  const dispatch = useDispatch()
  const [user, setUser] = useState();
  const isReRender = useSelector(state => state.reRender);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserByTokenService();
        if (response.success) {
          setUser(response.data);
        } else {
          console.log("Error:", response.message);
        }
      } catch (error) {
        console.log("Error:", error.message);
      }
    }
    getUser();

  }, [dispatch, isReRender]);

  const items = user && [{
    key: '1',
    type: 'group',
    label: `Xin chào, ${user.lastName}!`,
    children: [
      {
        label: <NavLink to="/user/detail"><UserOutlined style={{ marginRight: '10px' }} />Thông tin</NavLink>,
        key: '0',
      },
      {
        label: <NavLink to="/logout"><LogoutOutlined style={{ marginRight: '10px' }} />Đăng Xuất</NavLink>,
        key: '1',
      }
    ]
  }];

  return (
    <>
      {user && (
        <>
          <NotificationLayout />
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
            placement="bottomRight"
            overlayClassName="dropdown-two"
          >
            <a onClick={(e) => e.preventDefault()}>
              <img src={getPathImage(user.avatar)}></img>
            </a>
          </Dropdown>
        </>

      )}
    </>)
}

export default UserLoggedInHeader;