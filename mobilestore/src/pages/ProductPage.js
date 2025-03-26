import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../account/AuthContext";
import "./ProductPage.css";

const API_URL = `${process.env.PUBLIC_URL}/db.json`;
const MESSAGES = {
  LOADING: "⏳ Đang tải...",
  ERROR_FETCH: "Không thể tải dữ liệu sản phẩm!",
  WARNING_NO_DATA: "⚠ Không có dữ liệu sản phẩm!",
};

const ProductPage = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { user, logout } = authContext || { user: null, logout: () => {} }; // Lấy user từ AuthContext

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(MESSAGES.ERROR_FETCH);
        }
        const data = await response.json();
        const productList = data?.products || [];
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedBrand !== "Tất cả") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedBrand, searchTerm, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBrandFilter = (brand) => {
    setSelectedBrand(brand);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <p className="loading">{MESSAGES.LOADING}</p>;
  }

  if (error) {
    return <p className="error">❌ {error}</p>;
  }

  if (!products.length) {
    return <p className="warning">{MESSAGES.WARNING_NO_DATA}</p>;
  }

  return (
    <div className="product-page">
      <header className="header">
        <Link to="/home" className="store-title">
          📱 MobileStore
        </Link>
        <div className="header-right">
          {/* Hiển thị thông tin người dùng nếu đã đăng nhập */}
          {user && (
            <span className="user-greeting">
              Xin Chào {user.username}
            </span>
          )}
          <div className="header-buttons">
            <button className="logout-button" onClick={handleLogout}>
              Đăng xuất
            </button>
            <Link to="/cart" className="cart-button">
              🛍 Xem giỏ hàng
            </Link>
          </div>
        </div>
      </header>

      <h2>Danh sách sản phẩm</h2>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="brand-buttons">
          {["Tất cả", "Apple", "Samsung", "Xiaomi"].map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandFilter(brand)}
              className={selectedBrand === brand ? "active" : ""}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="product-list">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p className="price">💰 {product.price.toLocaleString("vi-VN")} VNĐ</p>
            <Link to={`/products/${product.id}`}>
              <button className="detail-button">Xem chi tiết</button>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Trang trước
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`pagination-number ${currentPage === pageNumber ? "active" : ""}`}
              >
                Trang {pageNumber}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;