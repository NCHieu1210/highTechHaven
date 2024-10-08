import { Spin, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../actions/reRender";
import { useEffect, useState } from "react";
import { getAllUserActionsService } from "../../services/userActionsService";
import moment from "moment";
import ActionType from "../../components/ActionType";
import parseEntity from "../../helpers/parseEntity";


const columns = [
  {
    title: 'Hành động',
    dataIndex: 'actionType',
  },
  {
    title: 'Thực thể',
    dataIndex: 'entity',
  },
  {
    title: 'Tên thực thể',
    dataIndex: 'entityName',
  },
  {
    title: 'Thời gian',
    dataIndex: 'timestamp',
  },
  {
    title: 'Người thực hiện',
    dataIndex: 'userName',
  }
  // {
  //   title: 'Chức năng',
  //   dataIndex: 'function',
  //   render: (_, record) => {
  //     return (
  //       <div>
  //         <UpdateSuppliers supplier={record}></UpdateSuppliers>
  //         <DeleteSuppliers idSupplier={record.key}></DeleteSuppliers>
  //       </div>
  //     );
  //   }
  // },
];
const UserActions = () => {

  const [responseAPI, setResponseAPI] = useState();
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRenderReducer);
  const dispatch = useDispatch();

  //Call API
  useEffect(() => {
    const getAllUserActions = async () => {
      setLoading(true);
      try {
        const response = await getAllUserActionsService();
        response.reverse();
        setResponseAPI(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getAllUserActions();

    if (isReRender) {
      dispatch(reRender(false));
    }
  }, [isReRender, dispatch]);
  //END Call API

  //Ant Design
  const data = [];
  responseAPI && (responseAPI.map((index) => {
    data.push({
      key: index.id,
      area: index.area,
      actionType: <ActionType method={index.actionType} />,
      entity: parseEntity(index.entity),
      entityName: index.entityName,
      timestamp: moment(index.timestamp).utcOffset('+07:00').format('HH:mm - DD/MM/YYYY '),
      url: index.url,
      userName: index.userName,
      status: index.status
    })
  }))

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  //END Ant Design

  return (
    <>
      <div className='admin'>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div className='admin__header' >
            <h1>Lịch sử người dùng</h1>
            <div>
              {/* 
              <DeleteRangeSuppliers selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangeSuppliers>
              <CreateSuppliers></CreateSuppliers> */}
            </div>
          </div>
        </div>
        <Spin spinning={loading}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={data} size='large' pagination={{ position: ['bottomCenter'] }} />
        </Spin>
        {/* pagination={{ position: ['bottomCenter'] }}  */}
      </div>
    </>
  )
}

export default UserActions;
