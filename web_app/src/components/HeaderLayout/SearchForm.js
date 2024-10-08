import { SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Space } from "antd";
import { useNavigate } from "react-router-dom";

const SearchForm = () => {
  const [form] = Form.useForm();
  const navigation = useNavigate();

  const onFinish = (values) => {
    navigation(`/products/search/${values.search}`);
  };
  const onFinishFailed = (errorInfo) => {
    const errorField = errorInfo.errorFields[0];
    if (errorField) {
      message.error("Hãy nhập tên sản phẩm bạn muốn tìm");
    }
  };
  return (
    <>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} >
        <Space.Compact>
          <Form.Item
            name="search"
            rules={[{ required: true, message: "" }]}
          >
            <Input placeholder="Bạn muốn tìm sản phẩm nào?" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              <div className="header__setHide">
                Tìm kiếm
              </div>
            </Button>
          </Form.Item>
        </Space.Compact>
      </Form>
    </>
  )
}
export default SearchForm;