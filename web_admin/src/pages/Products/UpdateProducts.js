import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductsBySlugService, updateProductService } from "../../services/productsService";
import parse from 'html-react-parser';
import "../../components/MyCKEditor/MyCKEditor.css";
import { Button, Form, Input, Select, Space, Spin, message } from "antd";
import { getPathImage, removeBaseUrl } from "../../helpers/getPathImage";
import { getAllCategoriesService } from "../../services/categoriesService";
import { getAllSupplierService } from "../../services/suppliersService";
import CheckImageUpload from "../../helpers/checkImageUpload";
import { ArrowLeftOutlined, DoubleRightOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import MyCKEditor from "../../components/MyCKEditor";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import moment from "moment";
import "./Products.scss"
import VariantFormList from "../../components/VariantFormList";
import Dragger from "antd/es/upload/Dragger";


const normFile = (e) => {

  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const UpdateProducts = () => {
  const params = useParams();
  const [responseAPI, setResponseAPI] = useState();
  const [categoriesList, setCategoriesList] = useState([]);
  const [suppliersList, setSuppliersList] = useState([]);
  const [fileList, setFileList] = useState([{}]);
  const [variantFileList, setVariantFileList] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState('');
  const [valueRadio, setValueRadio] = useState();
  const navigate = useNavigate();


  //Call API
  useEffect(() => {
    // Khởi tạo fileList với ảnh mặc định từ product
    const getfileList = (data) => {
      if (data && data.productImages.length > 0) {
        const newFileList = data.productImages.map((item) => ({
          uid: item.id, // Hoặc một giá trị duy nhất khác
          name: getPathImage(item.image),
          status: 'done',
          url: getPathImage(item.image),  // Đường dẫn đến hình ảnh mặc định
        }));

        setFileList(newFileList); // Cập nhật trạng thái một lần
      } else {
        setFileList([]);
      }
    }
    // END Khởi tạo fileList với ảnh mặc định từ product

    //Lấy giá trị mặc định cho radio
    const getValueRadio = (data) => {
      data.productOptions.forEach((item, index) => {
        item.productVariants.forEach((detail, subIndex) => {
          if (detail.isDefault) {
            setValueRadio(`${index}-${subIndex}`);
          }
        });
      });
    }
    //END Lấy giá trị mặc định cho radio

    const getVariantFileList = (data) => {
      let tempFileList = [{}];
      data.productOptions.forEach((item, index) => {
        item.productVariants.forEach((detail, subIndex) => {
          if (detail.thumbnail) {
            tempFileList = {
              ...tempFileList,
              [`${index}-${subIndex}`]: [{
                uid: detail.id,
                name: detail.color,
                status: 'done',
                url: getPathImage(detail.thumbnail),
              }]
            };
          }
        });
      });
      setVariantFileList(tempFileList);
    }

    const getProductsBySlug = async () => {
      try {
        const response = await getProductsBySlugService(params.slug);
        setResponseAPI(response.data);
        setEditorContent(response.data.content);
        getfileList(response.data);
        getValueRadio(response.data);
        getVariantFileList(response.data);
      } catch (error) {
        console.log(error);
      };
    }

    const getAllCategories = async () => {
      try {
        const response = await getAllCategoriesService();
        setCategoriesList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getAllSuppliers = async () => {
      try {
        const response = await getAllSupplierService();
        setSuppliersList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    setLoading(true);
    setTimeout(() => {
      getAllCategories();
      getAllSuppliers();
      getProductsBySlug();
      setLoading(false);
    }, 200);

  }, [params])
  //END Call API

  // Chuyển đổi Category và Supplier từ id thành tên tương ứng
  const getCategoryID = (categoryName) => {
    const categories = categoriesList.find(categoriesList => categoriesList.name === categoryName);
    return categories ? categories.id : "";
  };

  const getSupplierID = (supplierName) => {
    const suppliers = suppliersList.find(suppliersList => suppliersList.name === supplierName);
    return suppliers ? suppliers.id : "";
  };
  //END Chuyển đổi Category và Supplier từ id thành tên tương ứng

  //Radio
  const onChange = (e) => {
    setValueRadio(e.target.value);
  };
  //END Radio

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

  const getThumbVariant = (key) => {
    return removeBaseUrl(variantFileList[key][0].url);
  }

  const onFinish = async (values) => {
    // setLoading(true);
    let variantDTOs = [];
    values.variants.forEach((item, index) => {
      item.list.forEach((subItem, subIndex) => {
        variantDTOs.push({
          thumbFile: subItem.thumbFile ? subItem.thumbFile[0].originFileObj : null,
          thumbUrl: !subItem.thumbFile ? getThumbVariant(`${index}-${subIndex}`) : null,
          option: item.option ? item.option : "No Option",
          color: subItem.color,
          stock: subItem.stock,
          price: subItem.price,
          discount: subItem.discount || 0,
          isDefault: subItem.key == valueRadio
        });
      });
    });
    console.log(variantDTOs)

    const formData = new FormData();
    formData.append('Name', values.name);
    formData.append('CategoryID', values.CategoryID);
    formData.append('SupplierID', values.SupplierID);
    if (fileList.length > 0) {
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('ImageFile', file.originFileObj);
        }
        else {
          formData.append('ImageUrl', removeBaseUrl(file.url));
        }
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
      const response = await updateProductService(responseAPI.id, formData);
      if (response.success) {
        Swal.fire({
          title: "Thành công!",
          html: `Sản phẩm <strong>${responseAPI.name}</strong> đã được chỉnh sửa thành công!`,
          icon: "success"
        });
        navigate('/admin/products');
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
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  //END Form

  //Kiểm tra file ảnh
  const beforeUpload = (file) => CheckImageUpload(file);
  //END kiểm tra file ảnh

  return (
    <>
      {responseAPI && categoriesList.length > 0 && suppliersList.length > 0 &&
        <div className="admin">
          <Spin spinning={loading}>
            <h1>CHỈNH SỦA SẢN PHẨM</h1>
            <br></br>
            <hr></hr>
            <br></br>
            <Form className="admin__product"
              form={form}
              name="createCategory"
              // labelCol={{ span: 5, }} wrapperCol={{ span: 17, }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              size='large'
              initialValues={{
                remember: true,
                discount: 0,
                ...responseAPI,
                CategoryID: getCategoryID(responseAPI.category),
                SupplierID: getSupplierID(responseAPI.supplier),
                variants: responseAPI.productOptions.map((item) => ({
                  // key: index,
                  option: item.option === "No Option" ? "" : item.option,
                  list: item.productVariants.map((detail) => ({
                    // key: `${index}-${subIndex}`,
                    color: detail.color,
                    stock: detail.stock,
                    price: detail.price,
                    discount: detail.discount,
                    isDefault: detail.isDefault,
                  })),
                }))
              }}
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
                          max-width: 100%; /* Giới hạn chiều rộng để không vượt quá */
                          max-height: 100%; /* Giới hạn chiều cao để không vượt quá */
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
                      onChange={onChange}
                      variantFileList={variantFileList}
                      valueRadio={valueRadio}
                    // variantsData={responseAPI.productOptions}
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
                <MyCKEditor data={editorContent} onChange={setEditorContent}></MyCKEditor>
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
      }
    </>
  );
};

export default UpdateProducts;