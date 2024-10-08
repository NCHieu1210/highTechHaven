export function getPathImage(image) {
  const path = `https://localhost:7202${image}`
  return path;
}

export function removeBaseUrl(url) {
  const newUrl = new URL(url);
  const trimmedUrl = newUrl.pathname; // Lấy phần path
  return (trimmedUrl);
}

