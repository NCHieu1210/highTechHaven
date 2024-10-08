import { Button, Form, Input, Select, Space, Spin, message } from "antd";
import { useEffect, useState } from "react";
import CheckImageUpload from "../../helpers/checkImageUpload";
import { getAllCategoriesService } from "../../services/categoriesService";
import { getAllSupplierService } from "../../services/suppliersService";
import MyCKEditor from "../../components/MyCKEditor";
import { ArrowLeftOutlined, DoubleRightOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { createProductService } from "../../services/productsService";
import "./Products.scss"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { getPathImage } from "../../helpers/getPathImage";
import Dragger from "antd/es/upload/Dragger";
import VariantFormList from "../../components/VariantFormList";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const CreateProducts = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [categoriesList, setCategoryList] = useState([]);
  const [suppliersList, setSupplierList] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [valueRadio, setValueRadio] = useState("0-0");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCategory = await getAllCategoriesService();
        const responseSupplier = await getAllSupplierService();
        setCategoryList(responseCategory.data);
        setSupplierList(responseSupplier.data);
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
    let variantDTOs = [];
    values.variants.forEach(item => {
      item.list.forEach(subItem => {
        variantDTOs.push({
          thumbFile: subItem.thumbFile[0] ? subItem.thumbFile[0].originFileObj : "",
          option: (item.option === undefined || item.option === null) ? "No Option" : item.option,
          color: subItem.color,
          stock: subItem.stock,
          price: subItem.price,
          discount: subItem.discount || 0,
          isDefault: subItem.key == valueRadio
        });
      });
    });

    const formData = new FormData();
    formData.append('Name', values.name);
    formData.append('CategoryID', values.CategoryID);
    formData.append('SupplierID', values.SupplierID);
    if (fileList.length > 0) {
      fileList.forEach(file => {
        formData.append('ImageFile', file.originFileObj);
      });
    }

    // Thêm từng variantDTO vào FormData
    variantDTOs.forEach((variant, index) => {
      // Thêm ThumbFile
      formData.append(`variantDTOs[${index}].ThumbFile`, variant.thumbFile);

      // Thêm các thuộc tính khác
      formData.append(`variantDTOs[${index}].price`, variant.price);
      formData.append(`variantDTOs[${index}].discount`, variant.discount);
      formData.append(`variantDTOs[${index}].stock`, variant.stock);
      formData.append(`variantDTOs[${index}].isDefault`, variant.isDefault);
      formData.append(`variantDTOs[${index}].option`, variant.option);
      formData.append(`variantDTOs[${index}].color`, variant.color);
    });

    formData.append('Content', editorContent); // Add the editor content to formData
    try {
      const response = await createProductService(formData);
      if (response.success) {
        form.resetFields(); // Xóa dữ liệu cũ sau khi gửi thành công
        setFileList([]); // Xóa fileList sau khi gửi thành công
        Swal.fire({
          title: "Thành công!",
          text: "Bạn đã thành công thêm mới một sản phẩm!",
          icon: "success"
        });
        navigate('/admin/products');
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
    }
    finally {
      setLoading(false);
    }
  };
  //END Call API
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  //Radio
  const onChange = (e) => {
    setValueRadio(e.target.value);
  };
  //END Radio

  //Upload sản phẩm liên quan
  const props = {
    name: 'file',
    multiple: true,
    fileList: fileList,
    onChange(info) {
      // Chỉ cập nhật fileList nếu không phải là hành động xóa
      if (info.file.status !== 'removed') {
        setFileList(info.fileList);
        message.success(`${info.file.name} đã được tải lên thành công!`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    onRemove(file) {
      // Xác nhận hành động xóa và cập nhật fileList
      const newFileList = fileList.filter(item => item.uid !== file.uid);
      setFileList(newFileList);
      message.error(`${file.name} đã được xóa thành công.`);
      return true; // Cho phép xóa file
    },
  };
  //Kiểm tra file ảnh
  const beforeUpload = (file) => CheckImageUpload(file);

  return (
    <>
      <div className="admin">
        <Spin spinning={loading}>
          <h1>THÊM MỚI SẢN PHẨM</h1>
          <br></br>
          <hr></hr>
          <br></br>
          <Form className="admin__product"
            form={form}
            name="createCategory"
            // labelCol={{ span: 5, }} wrapperCol={{ span: 17, }}
            initialValues={{ remember: true, discount: 0 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            size='large'
          >
            <h2> <DoubleRightOutlined /> Thông tin của sản phẩm</h2>
            <br></br>
            <Space className="admin__product--spaceInfo" size={100}>
              {/*Nhập tên */}
              <Form.Item label={<span className="custom-label">Tên sản phẩm</span>} name="name"
                rules={[
                  {
                    required: true,
                    message: 'Không được bỏ trống!',
                  },
                ]}
              ><Input />
              </Form.Item>
              {/* END Nhập tên */}

              {/* Danh mục cha */}
              <Form.Item label={<span className="custom-label">Danh mục</span>} name="CategoryID">
                <Select placeholder="Chọn danh mục">
                  <Select.Option key="-1" value="">
                    Trống
                  </Select.Option>
                  {categoriesList &&
                    (categoriesList.map(category => (
                      <Select.Option key={category.id} value={category.id}>
                        <div className="admin__product--select">
                          <img src={getPathImage(category.thumbnail)} alt={category.name}></img>
                          <span>{category.name}</span>
                        </div>
                      </Select.Option>
                    )))
                  }
                </Select>
              </Form.Item>
              {/* END Danh mục cha */}

              {/* Nhà sản xuất */}
              <Form.Item label={<span className="custom-label">Nhà sản xuất</span>} name="SupplierID">
                <Select placeholder="Chọn danh mục">
                  <Select.Option key="-1" value="">
                    Trống
                  </Select.Option>
                  {suppliersList &&
                    (suppliersList.map(supplier => (
                      <Select.Option key={supplier.id} value={supplier.id}>
                        <div className="admin__product--select">
                          <img src={getPathImage(supplier.logo)} alt={supplier.name}></img>
                          <span>{supplier.name}</span>
                        </div>
                      </Select.Option>
                    )))
                  }
                </Select>
              </Form.Item>
              {/* END Nhà sản xuất */}
            </Space>
            <br></br>
            <br></br>

            {/* Upload ảnh sản phẩm liên quan */}
            <h2><DoubleRightOutlined /> Hình ảnh liên quan của sản phẩm</h2>

            <Dragger
              {...props}
              listType="picture"
              beforeUpload={beforeUpload}
              onPreview={(file) => {
                // Hiển thị xem trước ảnh
                const src = file.url || file.thumbUrl;
                const img = new Image();
                img.src = src;
                const imgWindow = window.open(src);
                // Viết nội dung vào cửa sổ mới với CSS để căn giữa ảnh
                imgWindow.document.write(`
                  <html>
                    <head>
                      <style>
                        body {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          height: 100vh; /* Chiều cao 100% của viewport */
                          margin: 0;
                          background-color: #f0f0f0; /* Màu nền nhẹ */
                        }
                        img {
                          max-width: 90%; /* Giới hạn chiều rộng để không vượt quá */
                          max-height: 90%; /* Giới hạn chiều cao để không vượt quá */
                        }
                      </style>
                    </head>
                    <body>
                      <img src="${src}" alt="Preview" />
                    </body>
                  </html>
                `);
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Nhấp hoặc kéo ảnh vào khu vực này để tải lên hình ảnh sản phẩm liên quan</p>
              <p className="ant-upload-hint">
                Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công ty hoặc các tập tin bị cấm khác!
              </p>
            </Dragger>
            {/* END Upload ảnh sản phẩm liên quan */}
            <br></br>
            <br></br>

            {/* Biến thể */}
            <h2><DoubleRightOutlined /> Biến thể của sản phẩm</h2>

            <Form.List name="variants">
              {(fields, { add, remove }) => {
                if (fields.length === 0) {
                  add(); // Gọi add nếu không có phần tử nào
                }

                return (
                  <VariantFormList
                    fields={fields}
                    add={add}
                    remove={remove}
                    valueRadio={valueRadio}
                    onChange={onChange}
                  />
                );
              }}
            </Form.List>
            {/* END Biến thể */}

            <br></br>
            <br></br>
            {/* Nhập nội dung sản phẩm  */}
            <h2><DoubleRightOutlined /> Bài viết mô tả về sản phẩm</h2>
            <Form.Item
              label=""
              name="content"
              labelCol={{ span: 24 }}  // Nhãn chiếm toàn bộ chiều rộng
              wrapperCol={{ span: 24 }}  // Đầu vào chiếm toàn bộ chiều rộng
              rules={[
                {
                  required: true,
                  message: 'Không được bỏ trống!',
                },
              ]}
            >
              <MyCKEditor onChange={setEditorContent}></MyCKEditor>
            </Form.Item>
            {/* END Nhập nội dung sản phẩm */}
            <br></br>
            <div className="admin__product--form--button">
              {/* Button Cancel */}
              <Form.Item>
                <Button type="dashed" className='admin__button admin__button--goBack' onClick={() => navigate(-1)}>
                  <ArrowLeftOutlined /> Quay về
                </Button>
              </Form.Item>
              {/* END Button Cancel */}
              {/* Button submit */}
              <Form.Item>
                <Button type="primary" className='admin__button admin__button--add' htmlType="submit">
                  <PlusOutlined /> Lưu lại
                </Button>
              </Form.Item>
              {/* END Button submit */}
            </div>
          </Form>
        </Spin>
        <br></br>
        <br></br>
        <br></br>
      </div >
    </>
  )
}

export default CreateProducts;