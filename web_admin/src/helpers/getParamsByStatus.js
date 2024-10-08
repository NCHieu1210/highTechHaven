export const getParamsByStatus = (arr, key, value) => {
  const foundObj = arr.find(obj => obj.name === key); // Sử dụng find để tìm đối tượng
  if (foundObj) {
    return foundObj[value]; // Trả về giá trị của thuộc tính nếu tìm thấy
  }
  return null; // Trả về null nếu không tìm thấy
};