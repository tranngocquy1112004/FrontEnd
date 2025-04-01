import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./ProductPage.css";

// Constants
const API_URL = `${process.env.PUBLIC_URL}/db.json`;
const PRODUCTS_PER_PAGE = 8;
const BRANDS = ["Tất cả", "Xiaomi", "Apple", "Samsung"];

// Utility Functions
const fetchProducts = async (signal) => {
  const response = await fetch(API_URL, { signal });
  if (!response.ok) throw new Error("Không thể tải sản phẩm!");
  const data = await response.json();
  return Array.isArray(data) ? data : data.products || [];
};

// Sub-components
const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`} className="product-card-link" aria-label={`Xem chi tiết ${product.name}`}>
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name} 
        className="product-image" 
        loading="lazy"
      />
      <h3>{product.name}</h3>
      <p className="price">💰 {product.price.toLocaleString("vi-VN")} VNĐ</p>
    </div>
  </Link>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination">
    <button
      className="pagination-button"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Trang trước
    </button>
    <span className="pagination-current">
      Trang {currentPage}/{totalPages}
    </span>
    <button
      className="pagination-button"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      Trang sau
    </button>
  </div>
);

const BrandFilter = ({ brands, selectedBrand, onBrandSelect }) => (
  <div className="brand-buttons">
    {brands.map((brand) => (
      <button
        key={brand}
        className={`brand-button ${selectedBrand === brand ? "active" : ""}`}
        onClick={() => onBrandSelect(brand)}
      >
        {brand}
      </button>
    ))}
  </div>
);

// Main Component
const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    brand: "Tất cả",
    search: ""
  });

  // Fetch products
  useEffect(() => {
    const controller = new AbortController();
    
    const loadProducts = async () => {
      try {
        const productList = await fetchProducts(controller.signal);
        setProducts(productList);
        setStatus({ loading: false, error: null });
      } catch (err) {
        if (err.name !== "AbortError") {
          setStatus({ loading: false, error: err.message });
        }
      }
    };
    
    loadProducts();
    return () => controller.abort();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = [...products];
    
    if (filters.brand !== "Tất cả") {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }
    
    if (filters.search.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [filters, products]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Handlers
  const handlePageChange = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const handleBrandSelect = useCallback((brand) => {
    setFilters(prev => ({ ...prev, brand }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  }, []);

  // Render states
  if (status.loading) return <p className="status loading">⏳ Đang tải...</p>;
  if (status.error) return <p className="status error">❌ {status.error}</p>;

  return (
    <main className="product-page">
      <h1 className="page-title">Danh sách sản phẩm</h1>
      
      <div className="filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm sản phẩm..."
          value={filters.search}
          onChange={handleSearchChange}
        />
        
        <BrandFilter 
          brands={BRANDS} 
          selectedBrand={filters.brand} 
          onBrandSelect={handleBrandSelect} 
        />
      </div>
      
      <div className="product-list">
        {currentProducts.length > 0 ? (
          currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="no-products">Không có sản phẩm nào phù hợp.</p>
        )}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    brand: PropTypes.string,
  }).isRequired,
};

export default ProductPage;