import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeProductStatusService, getAllProductsService } from "../../services/productsService";
import { Button, message, Popconfirm, Spin, Switch, Table, Tag } from "antd";
import moment from "moment";
import { reRender } from "../../actions/reRender";
import { getPathImage } from "../../helpers/getPathImage";
import { EditOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import DeleteProducts from "./DeleteProducts";
import DeleteRangeProducts from "./DeleteRangeProducts";
import ProductDetail from "./ProductDetail";

//Set colums
const columns = [
  {
    title: '',
    dataIndex: 'thumbnail',
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
  },
  {
    title: 'Tồn kho',
    dataIndex: 'totalStock',
  },
  {
    title: 'Biến thể',
    dataIndex: 'totalVariants',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdDate',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
  },
  {
    title: 'Chức năng',
    dataIndex: 'function',
    width: '15%',
    render: (_, record) => {
      return (
        <div>
          <ProductDetail productSlug={record.slug} ></ProductDetail>

          {/* Chỉnh sửa sản phẩm */}
          <NavLink to={`/admin/products/update/${record.slug}`}>
            <Button shape="circle" style={{ margin: "0 15px" }} className="btn__edit" >
              <EditOutlined />
            </Button>
          </NavLink>
          {/* END chỉnh sửa sản phảm */}

          {/* Xóa sản phẩm */}
          <DeleteProducts productId={record.key} nameProduct={record.name}></DeleteProducts>
          {/* END xóa sản phẩm */}

        </div >
      );
    }
  },
];
//END set colums

const Products = () => {
  const [responseAPI, setResponseAPI] = useState();
  const [loading, setLoading] = useState(false);
  const isReRender = useSelector(state => state.reRender);
  const dispatch = useDispatch();

  //Call API
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await getAllProductsService();
        response.data.reverse();
        setResponseAPI(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    setTimeout(() => {
      getAllProducts();
    }, 200);

    if (isReRender) {
      dispatch(reRender(false));
    }
  }, [isReRender]);
  //END Call API


  const getCreatedDate = (productStatus) => {
    if (productStatus.length > 0) {
      if (productStatus.length == 1) {
        return productStatus[0].date;
      }
      else {
        productStatus.map((item) => {
          if (item.name === "Created") {
            return item.date;
          }
        })
      }
    }
    else {
      return "";
    }
  }

  const confirmPopconfirm = (id) => {
    const changeProductStatus = async (id) => {
      const response = await changeProductStatusService(id);
      try {
        if (response.success) {
          message.success('Đổi trạng thái sản phẩm thành công!');
          dispatch(reRender(true));
        }
        else {
          message.error('Lỗi hệ thống, vui lòng thử lại sau!');
        }
      }
      catch (ex) {
        message.error('Lỗi hệ thống, vui lòng thử lại sau!');
      }
    }
    changeProductStatus(id);
  };

  const cancelPopconfirm = (e) => {
    message.error('Đã hủy thao tác!');
  };

  //Ant Design
  //Set data to table
  const data = [];
  responseAPI && (responseAPI.map((item) => {
    data.push({
      key: item.id,
      name: item.name,
      slug: item.slug,
      thumbnail: item.productVariants.thumbnail ? (<img src={getPathImage(item.productVariants.thumbnail)} style={{ width: "70px", height: "auto", borderRadius: "10px" }} alt={item.name}></img>) : <Tag color="magenta">Không có ảnh!</Tag>,
      totalStock: new Intl.NumberFormat('vi-VN').format(item.totalStock),
      totalSellNumbers: item.totalSellNumbers,
      totalVariants: <span>{item.totalVariants} Biến thể</span>,
      // createdDate: getCreatedDate(index.productStatus),
      createdDate: moment.utc(getCreatedDate(item.productStatus)).utcOffset("+07:00").format("HH:mm - DD/MM/YYYY"),
      status:
        <Popconfirm
          title="Đổi trạng thái"
          description={item.status ? "Bạn có chắc muốn ẩn sản phẩm không?" : "Bạn có chắc muốn mở bán không?"}
          onConfirm={() => confirmPopconfirm(item.id)}
          onCancel={cancelPopconfirm}
          icon={
            <QuestionCircleOutlined
              style={{
                color: 'red',
              }}
            />
          }
        >
          <Switch
            className="switch__status"
            checkedChildren="Đang mở bán" unCheckedChildren="Đang ẩn"
            checked={item.status} // Sử dụng checked thay vì defaultChecked
          />
        </Popconfirm>,
    })
  }))
  //END Set data to table
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  //END Ant Design

  //End set data to table

  return (
    <>
      <div className='admin'>
        <div
          style={{
            marginBottom: 16,
          }}
        >
          <div className='admin__header' >
            <h1>DANH SÁCH SẢN PHẨM</h1>
            <div>
              <DeleteRangeProducts selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}  ></DeleteRangeProducts>
              <NavLink to="/admin/products/create">
                <Button type="primary" className='admin__button admin__button--add'>
                  <PlusOutlined /> Thêm mới
                </Button></NavLink>
            </div>
          </div>
        </div>
        <br></br>
        <Spin spinning={loading}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={data} size='small' pagination={{ position: ['bottomCenter'] }} />
        </Spin>
        {/* pagination={{ position: ['bottomCenter'] }}  */}
      </div>
    </>
  );
}

export default Products;