import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../components/MyCKEditor/MyCKEditor.css";
import { Badge, Button, Card, Col, Form, Input, Row, Select, Spin, Tooltip, Upload, message } from "antd";
import { getPathImage } from "../../helpers/getPathImage";
import CheckImageUpload from "../../helpers/checkImageUpload";
import { ArrowLeftOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import MyCKEditor from "../../components/MyCKEditor";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import moment from "moment";
// import "../AdminProducts/AdminProducts.scss"
import { getPostsBySlugService, updatePostService } from "../../services/postsService";
import { getAllBlogsService } from "../../services/blogsService";


const normFile = (e) => {

  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const UpdatePosts = () => {
  const params = useParams();
  const [responseAPI, setResponseAPI] = useState();
  const [blogsList, setBlogsList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const navigate = useNavigate();

  //Call API
  useEffect(() => {
    setLoading(true);
    const getPostsBySlug = async () => {
      try {
        const response = await getPostsBySlugService(params.slug);
        setResponseAPI(response.data);
        setEditorContent(response.data.content);
      } catch (error) {
        console.log(error);
      };
    }

    const getAllBlogs = async () => {
      try {
        const response = await getAllBlogsService();
        setBlogsList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(() => {
      getAllBlogs();
      getPostsBySlug();
      setLoading(false);
    }, 200);
  }, [params])
  //END Call API

  // Khởi tạo fileList với ảnh mặc định từ product
  useEffect(() => {
    if (responseAPI && responseAPI.thumbnail) {
      setFileList([{
        uid: '-1',
        name: responseAPI.name,
        status: 'done',
        url: getPathImage(responseAPI.thumbnail),  // Đường dẫn đến hình ảnh mặc định
      }]);
    }
    else setFileList([]);
  }, [responseAPI]);

  const onFinish = async (values) => {
    // Tạo form data
    setLoading(true);
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }
    formData.append('content', editorContent); // Add the editor content to formData

    if (fileList.length > 0) {
      if (fileList[0].originFileObj) {
        formData.append('thumbFile', fileList[0].originFileObj);
      }
      if (fileList[0].url === undefined) {
        formData.append('thumbFile', null);
        formData.append('thumbUrl', '');
      }
      else {
        const url = new URL(fileList[0].url);
        const encodedPath = url.pathname;
        const decodedPath = decodeURIComponent(encodedPath);
        formData.append('thumbUrl', decodedPath);
      }
    }

    try {
      const response = await updatePostService(responseAPI.id, formData);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          html: `Bài viết <strong>${responseAPI.name}</strong> đã được chỉnh sửa thành công!`,
          icon: "success"
        });
        navigate('/admin/posts');
      } else {
        if (response.message === "The entity name already exists!") {
          message.error("Tên đã tồn tại!");
          console.log('Error:', response);
        }
        else {
          message.error("Chỉnh sửa thất bại!");
          console.log('Error:', response);
        }
      }
      setLoading(false);
    }
    catch (error) {
      console.log('Error:', error);
      message.error("Lỗi hệ thống! Kiểm tra lại kết nối hoặc thử lại sau");
      setLoading(false);
    }
    // Tạo form data
  };
  //END

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = ({ fileList }) => setFileList(fileList);
  //END Form

  //Kiểm tra file ảnh
  const beforeUpload = (file) => CheckImageUpload(file);
  //END kiểm tra file ảnh

  // Chuyển đổi blog từ id thành tên tương ứng
  const getBlogsID = (blogsName) => {
    const blogs = blogsList.find(blogsList => blogsList.name === blogsName);
    return blogs ? parseInt(blogs.id) : "";
  };
  //END Chuyển đổi blog từ id thành tên tương ứng

  return (
    <>
      {responseAPI &&
        < div className="admin admin__product">
          <Spin spinning={loading}>
            <h1>CHỈNH SỬA BÀI VIẾT</h1>
            <br></br>
            <hr></hr>
            <br></br>
            <br></br>
            <Form className="admin__product"
              form={form}
              name="UpdatePost" labelCol={{ span: 6, }} wrapperCol={{ span: 17, }}
              // style={{ maxWidth: 600, }}
              initialValues={{
                remember: true,
                ...responseAPI,
                BlogID: getBlogsID(responseAPI.blog),
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              size='large'
            >
              <Row gutter={[24, 24]}>
                <Col span={7} >
                  {/* Nhập logo */}
                  <Form.Item label={<span className="custom-label">Ảnh bài viết</span>} name="thumbFile" getValueFromEvent={normFile} >
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
                  <Form.Item label={<span className="custom-label">Tiêu đề bài viết </span>} name="name"
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
                <MyCKEditor data={editorContent} onChange={setEditorContent}></MyCKEditor>
              </Form.Item>

              {/* END Nhập giảm giá */}

            </Form>
          </Spin>

        </div >
      }
    </>
  );
};

export default UpdatePosts;