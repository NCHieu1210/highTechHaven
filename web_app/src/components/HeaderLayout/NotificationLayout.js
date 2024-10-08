import { BellOutlined } from "@ant-design/icons"
import { Badge, Button, Dropdown, notification, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { seenAllNotificationsService, seenNotificationService } from "../../services/notificationsService";
import { NavLink } from "react-router-dom";
import { getPathImage } from "../../helpers/getPathImage";
import HTMLReactParser from "html-react-parser/lib/index";
import { caCulateLastTime } from "../../helpers/calculateLastTime";
import { connectSignalR } from "../../socketHubs/connectSignalR";
import { reRender } from "../../actions/reRender";
import { useDispatch } from "react-redux";


const NotificationLayout = () => {
  const [notifi, setNotifi] = useState();
  const connectionRef = useRef(null); // Sử dụng useRef để lưu trữ connection
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();

  const [wBrowser, setwBrowser] = useState(false);
  const handleResize = () => {
    setwBrowser(window.innerWidth); // Thay đổi kích thước này theo nhu cầu của bạn
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openNotification = (id, desc, url) => {
    api.open({
      message: "Bạn có thông báo mới",
      description:
        <NavLink
          onClick={async () => { await seenNotificationService(id); dispatch(reRender(true)) }}
          style={{ color: "#2a3746" }}
          to={`http://localhost:3000${url}`} >
          <div dangerouslySetInnerHTML={{ __html: desc }} />
        </NavLink >,
      showProgress: true,
      placement: "bottomRight",
      icon: <BellOutlined style={{ color: "#f88d00" }} />
    });
  };

  useEffect(() => {
    const startConnect = async () => {
      const newConnection = await connectSignalR("/notificationsHub");
      connectionRef.current = newConnection; // Lưu connection vào useRef
      try {
        await newConnection.start();

        newConnection.on("ReceiveNotifications", data => {
          setNotifi(data);
        });

        newConnection.on("NewNotifications", data => {
          openNotification(data.id, data.content, data.url);
        });

        newConnection.invoke("GetByToken");
      } catch (error) {
        console.log("Error:", error.message);
      }
    }
    startConnect()
    return () => {
      // Dùng connectionRef.current để dừng kết nối
      if (connectionRef.current) {
        connectionRef.current.stop().catch(err => console.error("Error stopping connection:", err));
      }
    };
  }, []);

  const items = notifi && [{
    key: '1',
    type: 'group',
    label:
      <Space className="notification__header">
        <h2>Thông báo</h2>
        <Button onClick={async () => await seenAllNotificationsService()}>Đánh dấu tất cả đã đọc</Button>
      </Space >,
    children:
      notifi.notification ?
        (notifi.notification.map((item, index) => {
          return {
            label:
              <NavLink
                onClick={async () => { await seenNotificationService(item.id); dispatch(reRender(true)) }}
                to={`http://localhost:3000${item.url}`}>
                <Space size={20} className={item.isSeen ? "notification__space" : "notification__space notification__space--notSeen"}>
                  {!item.isSeen && (<Badge color="red" />)}
                  <img src={getPathImage(item.icon)} alt={`ntf_${index}`} />
                  <Space direction="vertical">
                    <div>{HTMLReactParser(item.content)}</div>
                    <br></br>
                    <em className="notification__lastTime">{caCulateLastTime(item.lastTime)}</em>
                  </Space>
                </Space>
              </NavLink >,
            key: index
          }
        })) :
        ([{
          label: <div style={{ textAlign: 'center' }}><br></br>Hiện chưa có thông báo mới<br></br><br></br></div>,
        }])
  }];

  return (
    <>
      {contextHolder}
      {notifi && (
        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
          placement="bottomRight"
          overlayClassName="dropdown-two notification"
          dropdownRender={menu => (
            <div style={wBrowser > 1024 ?
              { transform: 'translateX(60px)' } : wBrowser > 480 ?
                { transform: 'translateX(70px)' } : { transform: 'translateX(55px)' }} >
              {/* // {{ transform: 'translateX(60px)' }} */}
              {menu}
            </div >
          )}
        >
          <a onClick={(e) => e.preventDefault()}>
            {notifi.isSeenAll ?
              (<BellOutlined />) :
              (<Badge dot>
                <BellOutlined />
              </Badge>)
            }
          </a>
        </Dropdown >
      )}
    </>

  )
}

export default NotificationLayout;