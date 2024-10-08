import { Tag } from "antd";

const ChangeOrdersUpdate = (props) => {
  const { updateName } = props
  return (
    <>
      {updateName === 'Unconfirmed' && <Tag style={{ minWidth: "125px" }} color="cyan">Chưa xác nhận</Tag >}
      {updateName === 'Processing' && <Tag style={{ minWidth: "125px" }} color="gold">Đang xử lý</Tag >}
      {updateName === 'Delivering' && <Tag style={{ minWidth: "125px" }} color="purple">Đang giao</Tag >}
      {updateName === 'Completed' && <Tag style={{ minWidth: "125px" }} color="green">Đã hoàn thành</Tag >}
      {updateName === 'Cancelled' && <Tag style={{ minWidth: "125px" }} color="red">Đã hủy</Tag >}
    </>
  )
}

export default ChangeOrdersUpdate;