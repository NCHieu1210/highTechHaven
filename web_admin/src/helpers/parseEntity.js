const parseEntity = (entity) => {
  switch (entity) {
    case 'Products':
      return "Sản phẩm";
    case 'Categories':
      return "Danh mục";
    case 'Suppliers':
      return "Nhà sản xuất";
    case 'Blogs':
      return "Chuyên mục";
    case 'Posts':
      return "Bài viết";
    case 'Orders':
      return "Đơn hàng";
    case 'Users':
      return "Tài khoản";
    default:
      return "";
  }
}
export default parseEntity;