import { Result, Button } from "antd";

const NoData = (props) => {
  const { content } = props;
  return (
    <Result
      status="404"
      title="Không có dữ liệu"
      subTitle={content}
    />
  )
}

export default NoData;