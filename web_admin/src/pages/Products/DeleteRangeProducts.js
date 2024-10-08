import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Spin, message } from "antd";
import { deleteRangeProductsService } from "../../services/productsService";
import { reRender } from "../../actions/reRender";
import { useDispatch } from "react-redux";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useState } from "react";

const DeleteRangeProducts = (props) => {
  const { selectedRowKeys, setSelectedRowKeys } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const hasSelected = selectedRowKeys.length > 0;
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteRangeProductsService(selectedRowKeys);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          text: `Bạn đã xóa ${selectedRowKeys.length} sản phẩm. Sản phẩm bị xóa đã được chuyển vào thùng rác và sẽ bị xóa vĩnh viễn sau 30 ngày!`,
          icon: "success"
        });
        setSelectedRowKeys([]);
        dispatch(reRender(true));
      } else {
        message.error('Xóa thất bại!');
        console.log('Delete response:', response);
      }
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error('Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau.');
      setLoading(false);
    }
  }

  const confirm = (e) => {
    handleDelete();
  };
  const cancel = (e) => {
    message.error('Đã hủy thao tác!');
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <span
        style={{
          marginLeft: 8,
          color: hasSelected ? '#FF7875' : undefined,
          fontWeight: hasSelected ? 'bold' : undefined,
          padding: '0 8px',
        }}
      >
        {hasSelected ? `Đã chọn ${selectedRowKeys.length} items để xóa! ` : ''}
      </span>
      <Popconfirm
        title={`Xóa ${selectedRowKeys.length} sản phẩm!`}
        description="Bạn có chắc chắn muốn xóa?"
        onConfirm={confirm}
        onCancel={cancel}
        icon={
          <QuestionCircleOutlined
            style={{
              color: 'red',
            }}
          />
        }
      >

        <Button
          type="primary"
          danger
          // disabled={selectedRowKeys.length === 0}
          className='admin__button admin__button--delete'
          disabled={!hasSelected}
        >
          <DeleteOutlined /> Xóa
        </Button >
      </Popconfirm >

    </>
  );
}
export default DeleteRangeProducts;