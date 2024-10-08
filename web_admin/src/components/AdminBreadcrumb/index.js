import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation, useParams } from 'react-router-dom';
import "./AdminBreadcrumb.scss"

const AdminBreadcrumb = () => {
  const location = useLocation();
  const params = useParams();
  const breadcrumbNameMap = {
    '/admin': 'Admin',
    '/admin/products': 'Sản phẩm',
    '/admin/products/create': 'Thêm sản phẩm',
    '/admin/products/update': 'Sửa sản phẩm',
    '/admin/categories': 'Danh mục',
    '/admin/suppliers': 'Hãng sản xuất',
    '/admin/posts': 'Bài viết',
    '/admin/posts/create': 'Viết mới',
    '/admin/posts/update': 'Chỉnh sửa',
    '/admin/blogs': 'Chuyên mục',
    '/admin/users': 'Tài khoản',
    '/admin/useractions': 'Lịch sử',
    '/admin/trash': 'Thùng rác',
    '/admin/orders': 'Đơn hàng',
    '/admin/orders/unconfirmed': 'Đơn hàng chưa xác nhận',
    '/admin/orders/processing': 'Đơn hàng đang xử lý',
    '/admin/orders/completed': 'Đơn hàng đã hoàn thành',
    '/admin/orders/cancelled': 'Đơn hàng đã hủy',

    // Thêm các tên breadcrumb khác ở đây
  };
  const pathSnippets = location.pathname.split('/').filter(i => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const lastItem = index === pathSnippets.length - 1;
    const isDynamic = url.includes('update');

    return (
      <Breadcrumb.Item key={url}>
        {lastItem || isDynamic ? (
          breadcrumbNameMap[url] || params.slug
        ) : (
          <Link to={url}>{breadcrumbNameMap[url]}</Link>
        )}
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/admin"></Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);


  return (
    <>
      <div className='breadcrumb'>
        <Breadcrumb style={{ margin: '16px 0' }}>
          {breadcrumbItems}
        </Breadcrumb>
      </div>
    </>
  );
}
export default AdminBreadcrumb;