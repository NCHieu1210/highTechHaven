import { Spin, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import ViewOrders from "./ViewOrders.";
import { builDataTable } from "./builDataTable";
import { lastUpdateName } from "../../helpers/calculateOrderDetails ";
import { connectSignalR } from "../../socketHubs/connectSignalR";

const CancelledOrder = () => {
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
          const buildData = builDataTable(data.reverse(), (item) => lastUpdateName(item) === "Cancelled");
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
      title: '',
      dataIndex: 'function',
      render: (_, record) => {
        return (
          <div>
            <ViewOrders orders={record} ></ViewOrders>
            {/* <UpdateCategories category={record} options={responseAPI} ></UpdateCategories>
            <DeleteCategories categoriesId={record.key}></DeleteCategories> */}
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
            <h1>ĐƠN HÀNG ĐÃ HỦY</h1>
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

export default CancelledOrder;