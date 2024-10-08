import { Button, Col, Form, message, Row, Spin } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentsService } from "../../services/commentsService";
import { reRender } from "../../actions/reRender";
import TextArea from "antd/es/input/TextArea";
import { SendOutlined } from "@ant-design/icons";
import NotLoggedInYet from "../NotLoggedInYet";

const RepComments = (props) => {
  const { parentCommentId, checkId, productId, postId } = props;
  const [loading, setLoading] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  if (checkId !== parentCommentId) return null;
  else {
    const onFinish = async (values) => {
      setLoading(true);
      const data = new FormData();
      data.append("content", values["content"]);
      productId && data.append("ProductID", productId);
      postId && data.append("PostID", postId);
      data.append("ParentCommentID", parentCommentId);
      try {
        const response = await createCommentsService(data);
        if (response === 401) {
          console.log("Error: Unauthorized");
          setShowModalLogin(true);
        }
        else if (response.success) {
          form.resetFields();
          dispatch(reRender(true));
          message.success("Gửi thành công!")
        }
        else {
          message.error("Lỗi hệ thống, vui lòng thử lại sau!")
          console.log("Error:", response);
        }
      }
      catch (ex) {
        console.log("Error:", ex.message);
      }
      finally {
        setLoading(false);
      }
    };
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    return (
      <div className="repComments">
        <Spin spinning={loading}>
          <NotLoggedInYet
            content="bình luận sản phẩm."
            showModalLogin={showModalLogin}
            setShowModalLogin={setShowModalLogin}>
          </NotLoggedInYet>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              remember: true,
            }}>
            <Row>
              <Col span={20}>
                <Form.Item
                  name="content"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập bình luận!',
                    },
                  ]}
                  className="comments__input" >
                  <TextArea rows={1} autoSize={true}></TextArea>
                </Form.Item>
              </Col>
              <Col span={1}>
                <Form.Item>
                  <Button htmlType="submit"><SendOutlined /> Gửi</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form >
        </Spin>
      </div>
    );
  }
}

export default RepComments;