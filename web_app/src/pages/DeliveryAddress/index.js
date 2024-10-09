import { useEffect, useState } from "react";
import { getDeliveryAddressByTokenService } from "../../services/deliveryAddressServer";
import { Spin, Table } from "antd";
import CreateDeliveryAddress from "./CreateDeliveryAddress";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../actions/reRender";
import DeleteDeliveryAddress from "./DeleteDeliveryAddress";
import NoData from "../../components/NoData";

const DeliveryAddress = () => {
  const [dataList, setDataList] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const isReRender = useSelector(state => state.reRender);

  useEffect(() => {
    const getAllData = async () => {
      setLoading(true);
      try {
        const res = await getDeliveryAddressByTokenService();
        if (res.success) {
          setData(res.data.reverse());
        }
        else {
          console.log("Error", res.message);
        }
      }
      catch (error) {
        console.log("Error", error);
      }
      finally {
        setLoading(false);
      }
    }
    getAllData();

    if (isReRender) {
      dispatch(reRender(false));
    }

  }, [isReRender])

  useEffect(() => {
    const dataRes = [];
    data && (data.map((index) => {
      dataRes.push({
        key: index.id,
        name: index.name,
        phone: index.phone,
        address: index.address
      })
    }))
    setDataList(dataRes);
  }, [data])

  const columns = [
    {
      title: 'Người nhận hàng',
      dataIndex: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Địa chỉ nhận hàng',
      dataIndex: 'address',
    },
    {
      title: '',
      dataIndex: 'function',
      render: (_, record) => {
        return (
          <div>
            {/* <UpdateCategories category={record} options={responseAPI} ></UpdateCategories> */}
            <DeleteDeliveryAddress deliveryAddressID={record.key}></DeleteDeliveryAddress>
            {/* <ViewOrderUsers orders={record}></ViewOrderUsers> */}
          </div>
        );
      }
    },
  ];
  return (
    <>
      <Spin spinning={loading}>
        <div className="userDetails">
          {dataList && data && (dataList.length > 0 ?
            (<>
              <div className="userDetails__deliveryAddress">
                <h1>ĐỊA CHỈ GIAO HÀNG CỦA BẠN</h1>
                <div>
                  <CreateDeliveryAddress></CreateDeliveryAddress>
                </div>
              </div>
              <br></br>
              <Table columns={columns} dataSource={dataList} size='large'
                pagination={{ position: ['bottomCenter'], pageSize: 7 }} />
            </>) :
            (<div style={{ textAlign: "center" }}>
              <NoData content="Bạn hiện chưa có địa chỉ giao hàng"></NoData>
              <CreateDeliveryAddress></CreateDeliveryAddress>
            </div>)
          )}
        </div>
      </Spin>
    </>
  )
}

export default DeliveryAddress;