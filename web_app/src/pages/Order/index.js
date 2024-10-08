import { Button, Card, Pagination } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import StatusOrders from './StatusOrders';
import { lastUpdateName, lastUpdateTime } from '../../helpers/calculateOrderDetails ';
import ViewOrder from './ViewOrder';
import UserCancelledButton from './UserCancelledButton';
import { connectSignalR } from '../../socketHubs/connectSignalR';
import NoData from '../../components/NoData';
import { NavLink } from 'react-router-dom';

const Orders = () => {
  const [ordersList, setOrdersList] = useState();
  const connectionRef = useRef(null); // Sử dụng useRef để lưu trữ connection

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const handlePageChange = (page) => {
    setCurrentPage(page);

  };
  const paginatedOrders = ordersList && ordersList.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  //END Pagination  
  useEffect(() => {
    const startConnect = async () => {
      const newConnection = await connectSignalR("/ordersHub");
      connectionRef.current = newConnection; // Lưu connection vào useRef
      try {
        await newConnection.start();

        newConnection.on("ReceiveOrders", orders => {
          const ordersIsIncomplete = orders.reverse().filter(order =>
            !order.orderUpdates.some(
              update =>
                (update.updateName === "Completed" && update.status === true) ||
                (update.updateName === "Cancelled" && update.status === true)));
          setOrdersList(ordersIsIncomplete);
        });

        newConnection.invoke("GetByToken");
      } catch (error) {
        console.log("Error:", error.message);
      }
    }

    startConnect();
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop().catch(err => console.error("Error stopping connection:", err));;
      }
    }
  }, [])


  return (
    <>
      <div className="userDetails">
        <h1>TRA CỨU ĐƠN HÀNG</h1>
        <br></br>
        {paginatedOrders && (paginatedOrders.length > 0 ?
          (paginatedOrders.map((order, index) =>
          (<div key={index}>
            <Card
              title={<>
                <div className="title">
                  <div>
                    <ViewOrder orders={order}></ViewOrder>{`Đơn hàng: ${order.code}`}
                  </div>
                  <div>{lastUpdateName(order) == "Unconfirmed" || lastUpdateName(order) == "Processing" ?
                    <div><UserCancelledButton orderID={order.id} /></div> :
                    <br></br>}
                  </div>
                </div>
              </>}
              bordered={false}
              style={{
                width: "100%",
              }}
            >
              <StatusOrders status={lastUpdateName(order)} time={lastUpdateTime(order)}></StatusOrders>
            </Card>
            <br></br>
          </div>))) :
          (<div style={{ textAlign: "center" }}>
            <NoData content="Bạn hiện chưa có lịch sử mua hàng"></NoData>
            <NavLink to="/products"><Button className="btn__two">Mua hàng ngay</Button></NavLink>
          </div>))}
      </div >
      {ordersList && paginatedOrders.length > 0 &&
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '7px' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={ordersList.length}
            onChange={handlePageChange}
          />
        </div>}
    </>
  )
}

export default Orders