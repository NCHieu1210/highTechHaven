import { Upload, message } from "antd";

const CheckImageUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
    || file.type === 'image/gif' || file.type === 'image/bmp' || file.type === 'image/tiff';
  if (!isJpgOrPng) {
    message.error('File ảnh không hợp lệ !');
    return Upload.LIST_IGNORE;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Ảnh chỉ có thể nhỏ hơn 2MB!');
    return Upload.LIST_IGNORE;
  }
  return false;
}

export default CheckImageUpload