import { Button, Col, Form, Input, InputNumber, Result, Row, Select, Spin, Tooltip, Upload, message } from "antd";
import { useEffect, useState } from "react";
import CheckImageUpload from "../../helpers/checkImageUpload";
import MyCKEditor from "../../components/MyCKEditor";
import { ArrowLeftOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
// import "../AdminProducts/AdminProducts.scss"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { getAllBlogsService } from "../../services/blogsService";
import { createPostsService } from "../../services/postsService";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const CreatePosts = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [blogsList, setBlogsList] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseBlogs = await getAllBlogsService();
        setBlogsList(responseBlogs.data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 200);
  }, []);

  //Form
  //Call API
  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key] === undefined ? "" : values[key]);
    }
    formData.append('content', editorContent); // Add the editor content to formData
    if (fileList.length > 0) {
      formData.append('ThumbFile', fileList[0].originFileObj);
    }
    try {
      const response = await createPostsService(formData);
      if (response.success) {
        form.resetFields(); // Xóa dữ liệu cũ sau khi gửi thành công
        setFileList([]); // Xóa fileList sau khi gửi thành công
        Swal.fire({
          title: "Thành công!",
          text: "Bạn đã thành công thêm mới một bài viết!",
          icon: "success"
        });
        navigate('/admin/posts');
      } else {
        if (response.message === "The entity name already exists!") {
          message.error("Tên đã tồn tại!");
          console.log('Error:', response);
        }
        else {
          message.error("Thêm mới thất bại!");
        }

      }
      setLoading(false);
    }
    catch (error) {
      console.log('Error:', error);
      message.error("Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau.");
      setLoading(false);
    }
  };
  //END Call API
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = ({ fileList }) => setFileList(fileList);
  //END Form

  //Kiểm tra file ảnh
  const beforeUpload = (file) => CheckImageUpload(file);

  return (
    <>
      <div className="admin">
        <Spin spinning={loading}>
          <h1>THÊM MỚI BÀI VIẾT</h1>
          <br></br>
          <hr></hr>
          <br></br>
          <Form className="admin__product"
            form={form}
            name="cratePost" labelCol={{ span: 6, }} wrapperCol={{ span: 17, }}
            // style={{ maxWidth: 600, }}
            initialValues={{ remember: true, discount: 0 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >
            <Row gutter={[24, 24]}>
              <Col span={7} >
                {/* Nhập logo */}
                <Form.Item label={<span className="custom-label">Ảnh bài viết</span>} name="ThumbFile" getValueFromEvent={normFile} >
                  <Upload listType="picture-card" fileList={fileList} maxCount={1}
                    onChange={handleChange} beforeUpload={beforeUpload} showUploadList={{ showPreviewIcon: false }}  >
                    <button type="button"
                      style={{
                        border: 0,
                        background: 'none',
                      }}
                    >
                      {fileList.length >= 1 ?
                        (<div>
                          <EditOutlined />
                          <div style={{ marginTop: 8 }}>Edit</div>
                        </div>) : (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        )}
                    </button>
                  </Upload>
                </Form.Item>
                {/* END Nhập logo */}
              </Col>

              <Col span={13} >
                {/*Nhập tiêu đề */}
                <Form.Item label={<span className="custom-label">Tiêu đề bài viết</span>} name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Không được bỏ trống!',
                    },
                  ]}
                ><Input />
                </Form.Item>
                {/* END Nhập tên */}

                {/* Chuyên mục cha */}
                <Form.Item label={<span className="custom-label">Chuyên mục</span>} name="BlogID">
                  <Select placeholder="Chọn chuyên mục">
                    <Select.Option key="-1" value="">
                      Trống
                    </Select.Option>
                    {blogsList &&
                      (blogsList.map(blog => (
                        <Select.Option key={blog.id} value={blog.id}>
                          {blog.name}
                        </Select.Option>
                      )))
                    }
                  </Select>
                </Form.Item>
                {/* END chuyên mục cha */}

                {/*Nhập từ khóa */}
                <Tooltip title="Từ khóa liên quan đến sản phẩm, danh mục hoặc nhà sản xuất. VD: iphone15..." placement="bottom">
                  <Form.Item label={<span className="custom-label">Từ khóa sản phẩm</span>} name="keywordProduct"
                    rules={[
                      {
                        required: true,
                        message: 'Không được bỏ trống!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Tooltip>
                {/* END Nhập từ khóa */}
              </Col>

              <Col span={4} >
                {/* Button submit */}
                <Form.Item>
                  <Button offset="2" type="primary" className='admin__button admin__button--add' style={{ minWidth: '140px' }} htmlType="submit">
                    <PlusOutlined /> Lưu lại
                  </Button>
                </Form.Item>
                {/* END Button submit */}

                {/* Button submit */}
                <Form.Item>
                  <Button offset="2" type="dashed" className='admin__button admin__button--goBack' style={{ minWidth: '140px' }} onClick={() => navigate(-1)}>
                    <ArrowLeftOutlined /> Quay về
                  </Button>
                </Form.Item>
                {/* END Button submit */}
              </Col>

            </Row>
            <br></br>
            <Form.Item
              label=""
              name="content"
              labelCol={{ span: 24 }}  // Nhãn chiếm toàn bộ chiều rộng
              wrapperCol={{ span: 24 }}  // Đầu vào chiếm toàn bộ chiều rộng
            >
              <MyCKEditor onChange={setEditorContent}></MyCKEditor>
            </Form.Item>

            {/* END Nhập giảm giá */}

          </Form>
        </Spin>

      </div >
    </>
  )
}

export default CreatePosts;