import { useDispatch } from "react-redux";
import { Spin, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import "./Orders.scss";
import { lastUpdateName } from "../../helpers/calculateOrderDetails ";
import ViewOrders from "./ViewOrders.";
import { builDataTable } from "./builDataTable";
import { connectSignalR } from "../../socketHubs/connectSignalR";
import OrdersUpdateButton from "./OrdersUpdateButton";
import OrdersCancelledButton from "./OrdersCancelledButton";

const Orders = () => {
  const [data, setData] = useState([]);
  const connectionRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startConnect = async () => {
      const newConnection = await connectSignalR("/ordersHub");
      connectionRef.current = newConnection; // Lưu connection vào useRef
      try {
        await newConnection.start();

        newConnection.on("ReceiveAllOrders", data => {
          const buildData = builDataTable(data.reverse(), (item) => lastUpdateName(item) !== "");
          setData(buildData);
        });

        newConnection.invoke("GetAllByToken");
      }
      catch (error) {
        console.log("Error:", error.message);
      }
      finally {
        setLoading(false);
      }

      return () => {
        // Dùng connectionRef.current để dừng kết nối
        if (connectionRef.current) {
          connectionRef.current.stop().catch(err => console.error("Error stopping connection:", err));
        }
      };
    };
    startConnect();
  }, []);

  const columns = [
    {
      title: 'Tài Khoản',
      dataIndex: 'user',
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'code',
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'totalProducts',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalOrderValue',
    },
    {
      title: 'Thời gian',
      dataIndex: 'orderDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'lastUpdateName',
    },
    {
      title: 'Chức năng',
      dataIndex: 'function',
      render: (_, record) => {
        return (
          <div>
            <ViewOrders orders={record} ></ViewOrders>
            {(lastUpdateName(record) !== "Completed" && lastUpdateName(record) !== "Cancelled") &&
              (<>
                <OrdersUpdateButton orderID={record.key} name="Chuyển trạng thái đơn hàng" />
                <OrdersCancelledButton orderID={record.key}  ></OrdersCancelledButton>
              </>)}
            {/* <DeleteCategories categoriesId={record.key}></DeleteCategories> */}
          </div>
        );
      }
    },
  ];
  //END set colums

  return (
    <>
      <div className='admin'>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div className='admin__header' >
            <h1>DANH SÁCH ĐƠN HÀNG</h1>
            <div>
              {/* <DeleteRangeCategories selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangeCategories>
              <CreateCategories categories={responseAPI}></CreateCategories> */}
            </div>
          </div>
        </div>
        <br></br>
        <Spin spinning={loading}>
          {data &&
            <Table columns={columns} dataSource={data} size='large' pagination={{ position: ['bottomCenter'] }} />
          }
        </Spin>
        {/* pagination={{ position: ['bottomCenter'] }}  */}
      </div>
    </>
  )
}

export default Orders;