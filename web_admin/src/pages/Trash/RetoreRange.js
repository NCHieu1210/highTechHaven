import { useDispatch } from "react-redux";
import { restoreRangeProductsService } from "../../services/trashService";
import { useState } from "react";
import { Button, Popconfirm, Spin, message } from "antd";
import { QuestionCircleOutlined, UndoOutlined } from "@ant-design/icons";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { reRender } from "../../actions/reRender";

const RetoreRange = (props) => {
  const { selectedRowKeys, setSelectedRowKeys } = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const hasSelected = selectedRowKeys.length > 0;
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await restoreRangeProductsService(selectedRowKeys);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          text: `Bạn đã khôi phục ${selectedRowKeys.length} sản phẩm thành công!`,
          icon: "success"
        });
        console.log('Restore response:', response);
        setSelectedRowKeys([]);
        dispatch(reRender(true));
      } else {
        message.error('Khôi phục thất bại!');
        console.log('Restore response:', response);
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
        {hasSelected ? `Đã chọn ${selectedRowKeys.length} items để khôi phục! ` : ''}
      </span>
      <Popconfirm
        title={`Khôi phục ${selectedRowKeys.length} sản phẩm!`}
        description="Bạn có chắc chắn muốn khôi phục lại?"
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
          type=""
          // disabled={selectedRowKeys.length === 0}
          className='admin__button admin__button--delete'
          disabled={!hasSelected}
        >
          <UndoOutlined /> Khôi phục
        </Button >
      </Popconfirm >

    </>
  );
}
export default RetoreRange;