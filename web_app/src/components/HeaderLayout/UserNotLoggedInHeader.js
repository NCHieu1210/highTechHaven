import { EditOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { NavLink } from "react-router-dom";


const items = [
  {
    label: <NavLink to="/login"><LoginOutlined style={{ marginRight: '10px' }} />Đăng nhập</NavLink>,
    key: '0',
  },
  {
    label: <NavLink to="/register"><EditOutlined style={{ marginRight: '10px' }} />Đăng ký</NavLink>,
    key: '1',
  }
];
const UserNotLoggedInHeader = () => {
  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        placement="bottomRight"
        overlayClassName="dropdown-two"
      >
        <a onClick={(e) => e.preventDefault()}>
          <UserOutlined />
        </a>
      </Dropdown>
    </>
  );
}
export default UserNotLoggedInHeader