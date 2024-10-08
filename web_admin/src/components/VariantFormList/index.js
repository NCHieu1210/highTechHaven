import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Radio, Row, Space, Upload } from 'antd';
import { CloseOutlined, CloseCircleOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import CheckImageUpload from '../../helpers/checkImageUpload';
import "./VariantFormList.scss"

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const VariantFormList = (props) => {
  const { fields, add, remove, valueRadio, onChange, variantFileList } = props;
  const [fileLists, setFileLists] = useState({});

  useEffect(() => {
    variantFileList && setFileLists(variantFileList)
  }, [])

  //Upload ảnh
  const handleChange = (fieldName) => ({ fileList }) => {
    setFileLists((prev) => ({
      ...prev,
      [fieldName]: fileList,
    }));
  };
  //END Upload ảnh

  //Kiểm tra file ảnh
  const beforeUpload = (file) => CheckImageUpload(file);
  //END Kiểm tra file ảnh


  return (
    <div className='variant'>
      <Radio.Group onChange={onChange} value={valueRadio}>

        <Row justify="space-around" gutter={[0, 50]}>
          {fields.map((field) => (
            <Col span={11} key={field.key}>
              <Card
                className="variant__card"
                size="large"
                title={`Biến thể ${field.name + 1}`}
                key={field.key}
                extra={<CloseOutlined className="variant__close" onClick={() => { remove(field.name); }} />}
              >
                {/* Nhập tên biến thể */}
                <Form.Item label={<span className="custom-label">Tên biến thể</span>} name={[field.name, 'option']}>
                  <Input placeholder="256GB. Nếu không có thì bỏ trống mục này" />
                </Form.Item>
                {/*END Nhập tên biến thể */}

                {/* Nhập thông tin chi tiết của biến thể */}
                <span className="custom-label">Chi tiết biến thể:</span>
                <Form.Item className='variant__list'>
                  <Form.List name={[field.name, 'list']} initialValue={[{}]}>

                    {(subFields, subOpt) => (
                      <div className='variant__detail' >
                        {subFields.map((subField) => (
                          // Radio để check xem biến thể nào sẽ dùng để hiển thị mặc định
                          <Radio key={subField.key} value={`${field.name}-${subField.key}`}>

                            <Form.Item name={[subField.name, 'key']} initialValue={`${field.name}-${subField.key}`} noStyle />
                            {/* Space dùng để nhập thông tin chi tiết của biến thể */}
                            <Space key={subField.key} offset="100">

                              {/* Nhập ảnh đại diện */}
                              <Form.Item name={[subField.name, 'thumbFile']} getValueFromEvent={normFile}>
                                <Upload
                                  listType="picture-card"
                                  fileList={fileLists[`${field.name}-${subField.key}`] || []}
                                  maxCount={1}
                                  onChange={handleChange(`${field.name}-${subField.key}`)}
                                  beforeUpload={beforeUpload}
                                  showUploadList={{ showPreviewIcon: false }}
                                >
                                  {!fileLists[`${field.name}-${subField.key}`]?.length &&
                                    <button type="button" style={{ border: 0, background: 'none' }}>
                                      <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                      </div>
                                    </button>
                                  }
                                </Upload>
                              </Form.Item>
                              {/* END Nhập ảnh đại diện */}

                              <Space.Compact direction="vertical">
                                {/* Nhập màu  */}
                                <Form.Item
                                  label={<span className="custom-label">Màu sắc</span>}
                                  name={[subField.name, 'color']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Không được bỏ trống!',
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="VD: Trắng"
                                  />
                                </Form.Item>
                                {/* END Nhập màu */}

                                {/* Nhập Tồn Tồn kho  */}
                                <Form.Item
                                  label={<span className="custom-label">Tồn kho</span>}
                                  name={[subField.name, 'stock']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Không được bỏ trống!',
                                    },
                                  ]}
                                >
                                  <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                                {/* END Nhập Tồn kho */}
                              </Space.Compact>

                              <Space.Compact direction="vertical">
                                {/* Nhập Giá tiền  */}
                                <Form.Item
                                  label={<span className="custom-label">Giá tiền</span>}
                                  name={[subField.name, 'price']}
                                  rules={[{
                                    required: true,
                                    message: 'Không được bỏ trống!',
                                  },
                                  ]}
                                >
                                  <InputNumber min={0} addonAfter="NVD" style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                                  />
                                </Form.Item>
                                {/* END Nhập Giá tiền */}

                                {/* Nhập giảm giá  */}
                                <Form.Item
                                  label={<span className="custom-label">Giảm giá</span>}
                                  name={[subField.name, 'discount']}
                                >
                                  <InputNumber defaultValue={0} min={0} max={100}
                                    formatter={(value) => `${value}%`}
                                    parser={(value) => value?.replace('%', '')}
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                                {/* END Nhập giảm giá */}
                              </Space.Compact>

                              {/* Xóa 1 chi tiết biến thể */}
                              <CloseCircleOutlined onClick={() => subOpt.remove(subField.name)} />
                              {/* END Xóa 1 chi tiết biến thể */}

                            </Space>
                            {/* Space dùng để nhập thông tin chi tiết của biến thể */}
                          </Radio>
                          // END Radio để check xem biến thể nào sẽ dùng để hiển thị mặc định
                        ))}
                        {/* Nút thêm 1 biến thể mới */}
                        <Button type="dashed" onClick={() => subOpt.add()} block>
                          + Thêm chi tiết biến thể
                        </Button>
                        {/* END Nút thêm 1 biến thể mới */}

                      </div>
                    )
                    }
                  </Form.List>
                </Form.Item>
                {/*END Nhập thông tin chi tiết của biến thể */}
              </Card>
            </Col>
          ))}
        </Row>
      </Radio.Group>
      <br></br>
      <Button type="dashed" onClick={() => add()} block>
        + Thêm biến thể
      </Button>
    </div >
  )
}

export default VariantFormList