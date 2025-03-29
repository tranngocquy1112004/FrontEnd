// pages/ProductPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductPage.css";

// Constants - Định nghĩa các hằng số để dễ quản lý và tái sử dụng
const API_URL = `${process.env.PUBLIC_URL}/db.json`; // URL API lấy dữ liệu sản phẩm
const MESSAGES = {
  LOADING: "⏳ Đang tải...", // Thông báo khi đang tải dữ liệu
  ERROR_FETCH: "❌ Không thể tải sản phẩm!", // Thông báo khi lỗi tải dữ liệu
};
const PRODUCTS_PER_PAGE = 8; // Số lượng sản phẩm hiển thị trên mỗi trang
const BRANDS = ["Tất cả", "Xiaomi", "iPhone", "Samsung"]; // Danh sách các thương hiệu để lọc

// Component ProductPage - Hiển thị danh sách sản phẩm với chức năng lọc, tìm kiếm và phân trang
const ProductPage = () => {
  // Khai báo các state để quản lý dữ liệu và trạng thái giao diện
  const [products, setProducts] = useState([]); // Lưu danh sách sản phẩm gốc từ API
  const [filteredProducts, setFilteredProducts] = useState([]); // Lưu danh sách sản phẩm sau khi lọc
  const [loading, setLoading] = useState(true); // Theo dõi trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu thông báo lỗi nếu có
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại trong phân trang
  const [selectedBrand, setSelectedBrand] = useState("Tất cả"); // Thương hiệu đang được chọn để lọc
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm sản phẩm

  // useEffect để lấy dữ liệu sản phẩm từ API khi component được mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Bật trạng thái đang tải trước khi gọi API
        const response = await fetch(API_URL); // Gửi yêu cầu lấy dữ liệu từ API
        if (!response.ok) throw new Error(MESSAGES.ERROR_FETCH); // Nếu phản hồi không thành công, ném lỗi
        const data = await response.json(); // Chuyển phản hồi thành JSON
        const productList = Array.isArray(data) ? data : data.products || []; // Đảm bảo lấy được mảng sản phẩm
        setProducts(productList); // Cập nhật danh sách sản phẩm gốc
        setFilteredProducts(productList); // Ban đầu hiển thị toàn bộ sản phẩm
      } catch (err) {
        setError(err.message); // Lưu thông báo lỗi nếu có
        console.error("Lỗi:", err); // In lỗi ra console để debug
      } finally {
        setLoading(false); // Tắt trạng thái tải sau khi hoàn tất (dù thành công hay thất bại)
      }
    };
    fetchProducts(); // Gọi hàm lấy dữ liệu
  }, []); // Dependency rỗng: chỉ chạy một lần khi component mount

  // useEffect để lọc sản phẩm khi thương hiệu hoặc từ khóa tìm kiếm thay đổi
  useEffect(() => {
    let filtered = [...products]; // Tạo bản sao của danh sách sản phẩm gốc để lọc

    // Lọc theo thương hiệu nếu không chọn "Tất cả"
    if (selectedBrand !== "Tất cả") {
      filtered = filtered.filter((product) => product.brand === selectedBrand); // Giữ lại sản phẩm khớp thương hiệu
    }

    // Lọc theo từ khóa tìm kiếm nếu có
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) // Giữ lại sản phẩm có tên chứa từ khóa
      );
    }

    setFilteredProducts(filtered); // Cập nhật danh sách sản phẩm đã lọc
    setCurrentPage(1); // Reset về trang 1 khi thay đổi bộ lọc
  }, [selectedBrand, searchQuery, products]); // Chạy lại khi các giá trị này thay đổi

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE); // Tổng số trang
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE; // Chỉ số bắt đầu của sản phẩm trên trang hiện tại
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE); // Lấy sản phẩm cho trang hiện tại

  // Hàm xử lý chuyển sang trang trước
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1); // Giảm số trang nếu không phải trang đầu
  };

  // Hàm xử lý chuyển sang trang sau
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1); // Tăng số trang nếu không phải trang cuối
  };

  // Hàm xử lý khi chọn thương hiệu để lọc
  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand); // Cập nhật thương hiệu được chọn
  };

  // Hàm xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Cập nhật từ khóa tìm kiếm từ input
  };

  // Render giao diện khi đang tải
  if (loading) return <p className="loading">{MESSAGES.LOADING}</p>;

  // Render giao diện khi có lỗi
  if (error) return <p className="error">{error}</p>;

  // Render giao diện chính của trang sản phẩm
  return (
    <div className="product-page">
      <h2>Danh sách sản phẩm</h2> {/* Tiêu đề trang */}

      {/* Phần bộ lọc và tìm kiếm */}
      <div className="filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm sản phẩm..." // Gợi ý trong ô tìm kiếm
          value={searchQuery} // Giá trị hiện tại của ô tìm kiếm
          onChange={handleSearchChange} // Gọi hàm xử lý khi thay đổi nội dung tìm kiếm
        />
        <div className="brand-buttons">
          {BRANDS.map((brand) => (
            <button
              key={brand} // Khóa duy nhất cho mỗi nút thương hiệu
              className={`brand-button ${selectedBrand === brand ? "active" : ""}`} // Thêm lớp 'active' nếu thương hiệu được chọn
              onClick={() => handleBrandFilter(brand)} // Gọi hàm lọc khi nhấn nút
            >
              {brand} {/* Hiển thị tên thương hiệu */}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="product-list">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="product-card"> {/* Thẻ sản phẩm với khóa duy nhất */}
              <img src={product.image} alt={product.name} className="product-image" /> {/* Hình ảnh sản phẩm */}
              <h3>{product.name}</h3> {/* Tên sản phẩm */}
              <p className="price">
                💰 Giá: {product.price.toLocaleString("vi-VN")} VNĐ {/* Giá sản phẩm định dạng VN */}
              </p>
              <Link to={`/products/${product.id}`}>
                <button className="detail-button">Chi tiết</button> {/* Nút xem chi tiết sản phẩm */}
              </Link>
            </div>
          ))
        ) : (
          <p className="no-products">Không có sản phẩm nào phù hợp.</p> // Thông báo khi không có sản phẩm
        )}
      </div>

      {/* Phần phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={handlePreviousPage} // Gọi hàm chuyển trang trước
            disabled={currentPage === 1} // Vô hiệu hóa nếu đang ở trang đầu
          >
            Trang trước
          </button>
          <span className="pagination-current">Trang {currentPage}</span> {/* Hiển thị trang hiện tại */}
          <button
            className="pagination-button"
            onClick={handleNextPage} // Gọi hàm chuyển trang sau
            disabled={currentPage === totalPages} // Vô hiệu hóa nếu đang ở trang cuối
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage; // Xuất component để sử dụng ở nơi khác