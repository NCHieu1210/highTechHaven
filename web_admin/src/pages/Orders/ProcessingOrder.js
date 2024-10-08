import { Spin, Table } from "antd";
import { lastUpdateName } from "../../helpers/calculateOrderDetails ";
import { useEffect, useRef, useState } from "react";
import OrdersUpdateButton from "./OrdersUpdateButton";
import OrdersCancelledButton from "./OrdersCancelledButton";
import ViewOrders from "./ViewOrders.";
import { builDataTable } from "./builDataTable";
import { connectSignalR } from "../../socketHubs/connectSignalR";

const ProcessingOrder = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const connectionRef = useRef(null);

  //Set data
  useEffect(() => {
    setLoading(true)
    const startConnect = async () => {
      const newConnection = await connectSignalR("/ordersHub");
      connectionRef.current = newConnection; // Lưu connection vào useRef
      try {
        await newConnection.start();

        newConnection.on("ReceiveAllOrders", data => {
          const buildData = builDataTable(data.reverse(), (item) => (lastUpdateName(item) === "Processing" || lastUpdateName(item) === "Delivering"));
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

  }, [])
  //END Set data

  //Set colums
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
      width: '15%',
      render: (_, record) => {
        return (
          <div>
            <ViewOrders orders={record} ></ViewOrders>

            <OrdersUpdateButton orderID={record.key}
              name={lastUpdateName(record) === "Processing" ? "Bắt đầu giao đơn hàng" : "Hoàn thành đơn hàng"}
            >
            </OrdersUpdateButton>
            <OrdersCancelledButton orderID={record.key}  ></OrdersCancelledButton>
          </div >
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
            <h1>ĐƠN HÀNG ĐANG XỬ LÝ</h1>
            <div>
              {/* <DeleteRangeCategories selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangeCategories>
              <CreateCategories categories={responseAPI}></CreateCategories> */}
            </div>
          </div>
        </div>
        <br></br>
        <Spin spinning={loading}>
          {data &&
            <Table columns={columns} dataSource={data} size='large' pagination={{ position: ['bottomCenter'] }} />}
        </Spin>
        {/* pagination={{ position: ['bottomCenter'] }}  */}
      </div>
    </>
  )
}

export default ProcessingOrder;