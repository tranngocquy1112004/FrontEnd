import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./CartContext";
import "./ProductPage.css";

// Các hằng số
const PRODUCTS_PER_PAGE = 8; // Số sản phẩm hiển thị trên mỗi trang
const API_URL = "http://localhost:4000/products"; // URL API để lấy dữ liệu sản phẩm

const ProductPage = () => {
  const { addToCart } = useContext(CartContext); // Lấy hàm thêm vào giỏ hàng từ context
  const [products, setProducts] = useState([]); // Danh sách tất cả sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách sản phẩm đã lọc
  const [currentUser, setCurrentUser] = useState(null); // Thông tin người dùng hiện tại
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [selectedBrand, setSelectedBrand] = useState("all"); // Thương hiệu đã chọn
  const navigate = useNavigate(); // Hook để điều hướng

  // Lấy dữ liệu sản phẩm và thông tin người dùng khi component được mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    const loadUser = () => {
      const savedUser = JSON.parse(localStorage.getItem("currentUser"));
      if (savedUser) {
        setCurrentUser(savedUser);
      }
    };

    fetchProducts();
    loadUser();
  }, []);

  // Xử lý tìm kiếm và lọc theo thương hiệu
  useEffect(() => {
    let filtered = products;

    // Lọc theo thương hiệu
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    // Lọc theo từ khóa tìm kiếm
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  }, [searchTerm, selectedBrand, products]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  };

  // Logic phân trang
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Hiển thị hiệu ứng hoa anh đào rơi
  const renderSakuraSpans = () => {
    return Array.from({ length: 30 }, (_, index) => <span key={index} />);
  };

  return (
    <div className="container">
      <div className="sakura-fall">{renderSakuraSpans()}</div>

      <header className="header">
        <Link to="/home" className="store-title">
          📱MobileStore
        </Link>

        <div className="header-actions">
          {currentUser ? (
            <div className="user-section">
              <p className="welcome-msg">👋 Xin chào, {currentUser.username}!</p>
              <button className="logout-button" onClick={handleLogout}>
                🚪 Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/" className="login-link">
              Đăng nhập
            </Link>
          )}
          <Link to="/cart" className="cart-link">
            🛒 Xem giỏ hàng
          </Link>
        </div>
      </header>

      <section className="product-section">
        <div className="product-header">
          <h2 className="product-title">Danh sách sản phẩm</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Các nút lọc thương hiệu */}
        <div className="brand-filter">
          <button
            className={`brand-button ${selectedBrand === "all" ? "active" : ""}`}
            onClick={() => setSelectedBrand("all")}
          >
            Tất cả
          </button>
          <button
            className={`brand-button ${selectedBrand === "Apple" ? "active" : ""}`}
            onClick={() => setSelectedBrand("Apple")}
          >
            Apple
          </button>
          <button
            className={`brand-button ${selectedBrand === "Samsung" ? "active" : ""}`}
            onClick={() => setSelectedBrand("Samsung")}
          >
            Samsung
          </button>
          <button
            className={`brand-button ${selectedBrand === "Xiaomi" ? "active" : ""}`}
            onClick={() => setSelectedBrand("Xiaomi")}
          >
            Xiaomi
          </button>
        </div>

        {filteredProducts.length === 0 && (
          <p className="no-results">Không tìm thấy sản phẩm nào.</p>
        )}
        <div className="product-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.id}`} className="product-link">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <p className="product-name">{product.name}</p>
                <p className="product-price">💰 {product.price} VNĐ</p>
              </Link>
              <Link to={`/products/${product.id}`}>
                <button className="product-button">Xem chi tiết</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="pagination">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          ⬅ Trang trước
        </button>
        <span>Trang {currentPage}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Trang sau ➡
        </button>
      </div>
    </div>
  );
};

export default ProductPage;