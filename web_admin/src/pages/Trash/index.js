import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reRender } from "../../actions/reRender";
import { Badge, Spin, Table, Tag } from "antd";
import { getAllTrashService } from "../../services/trashService";
import { getPathImage } from "../../helpers/getPathImage";
import moment from "moment";
import RestoreProducts from "./Restore";
import RetoreRangeProducts from "./RetoreRange";
import PermenentlyDeletedProducts from "./PermenentlyDeleted";

const columns = [
  {
    title: 'Ảnh',
    dataIndex: 'thumbnail',
  },
  {
    title: 'Tên',
    dataIndex: 'name',
  },
  {
    title: 'Ngày xóa',
    dataIndex: 'deletedDate',
  },
  {
    title: 'Người xóa',
    dataIndex: 'userDeleteName',
  },
  {
    title: 'Thời gian còn lại',
    dataIndex: 'daysUntilPermanentDeletion',
  },
  {
    title: 'Chức năng',
    dataIndex: 'function',
    render: (_, record) => {
      return (
        <div>
          <RestoreProducts idProduct={record.keyProduct} idPost={record.keyPost} nameProduct={record.name}></RestoreProducts>
          <PermenentlyDeletedProducts idProduct={record.keyProduct} idPost={record.keyPost} nameProduct={record.name}></PermenentlyDeletedProducts>
        </div>
      );
    }
  },
];

const Trash = () => {
  const [responseAPI, setResponseAPI] = useState();
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRender);
  const dispatch = useDispatch();

  //Call API
  useEffect(() => {
    const getAllTrash = async () => {
      try {
        const response = await getAllTrashService();
        const sortedData = response.data.sort((a, b) => new Date(b.deletedDate) - new Date(a.deletedDate));
        setResponseAPI(sortedData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    setTimeout(() => {
      getAllTrash();
    }, 200);

    if (isReRender) {
      dispatch(reRender(false));
    }
  }, [isReRender, dispatch]);
  //END Call API

  //Ant Design
  const data = [];
  responseAPI && (responseAPI.map((index) => {
    data.push({
      keyProduct: index.idProduct,
      keyPost: index.idPost,
      thumbnail: index.thumbnail ? (<img src={getPathImage(index.thumbnail)} style={{ width: "70px", height: "auto", borderRadius: "10px" }} alt={index.name}></img>) : <Tag color="magenta">Không có ảnh!</Tag>,
      name: index.name,
      deletedDate: moment.utc(index.deletedDate).utcOffset('+07:00').format('HH:mm -- DD/MM/YYYY '),
      userDeleteName: index.userFullName,
      daysUntilPermanentDeletion: <Badge color="red" text={`${index.daysUntilPermanentDeletion} ngày`} style={{ color: "red" }} />,
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
            <h1>THÙNG RÁC</h1>
            <div>

              {/* <RetoreRangeProducts selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></RetoreRangeProducts> */}
              {/* <CreateSuppliers></CreateSuppliers> */}
            </div>
          </div>
        </div>
        <Spin spinning={loading}>
          {/* rowSelection={rowSelection} */}
          <Table columns={columns} dataSource={data} size='large' pagination={{ position: ['bottomCenter'] }} />
        </Spin>
        {/* pagination={{ position: ['bottomCenter'] }}  */}
      </div>
    </>
  );
};
export default Trash;