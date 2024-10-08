import { EditOutlined, LoginOutlined } from "@ant-design/icons";
import { Button, Modal, Result } from "antd";
import { NavLink } from "react-router-dom";
import "./NotLoggedInYet.scss";

const NotLoggedInYet = (props) => {
  const { content, showModalLogin, setShowModalLogin } = props
  return (
    <div>
      <Modal
        className="notLoggedInYet"
        title="Vui lòng đăng nhập"
        centered
        open={showModalLogin}
        onCancel={() => setShowModalLogin(false)}
        footer={[
          <Button><NavLink to="/login"><LoginOutlined style={{ marginRight: '10px' }} />Đăng nhập</NavLink></Button>,
          <Button><NavLink to="/register"><EditOutlined style={{ marginRight: '10px' }} />Đăng ký</NavLink></Button>,
        ]}
      >
        <Result
          status="403"
          subTitle={`Quý khách hiện chưa đăng nhập. Vui lòng đăng nhập hoặc đăng ký tài khoản mới để có thể ${content}`}
        />
      </Modal>
    </div>
  )
}

export default NotLoggedInYet;