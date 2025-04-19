import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../pages/CartContext";
import "./ProductDetail.css";

// Thời gian hiển thị thông báo thành công (2 giây)
const SUCCESS_MESSAGE_TIMEOUT = 2000;

// Component hiển thị chi tiết sản phẩm
const ProductDetail = () => {
  // Lấy ID sản phẩm từ URL parameters
  const { id } = useParams();
  
  // Lấy context giỏ hàng
  const { addToCart, cart } = useContext(CartContext);
  
  // Các state quản lý dữ liệu và trạng thái
  const [product, setProduct] = useState(null); // Thông tin sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Thông báo lỗi
  const [successMessage, setSuccessMessage] = useState(""); // Thông báo thành công

  // Lấy thông tin chi tiết sản phẩm khi component mount hoặc id thay đổi
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Lấy dữ liệu từ file db.json
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Không thể tải dữ liệu sản phẩm!");

        const data = await response.json();
        const productId = Number(id);

        // Kiểm tra tính hợp lệ của dữ liệu
        if (!Array.isArray(data.products)) {
          throw new Error("Dữ liệu sản phẩm không hợp lệ!");
        }

        // Tìm sản phẩm theo ID
        const foundProduct = data.products.find((p) => Number(p.id) === productId);

        if (!foundProduct) {
          throw new Error("Sản phẩm không tồn tại!");
        }

        setProduct(foundProduct);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = useCallback(() => {
    if (!product) return;

    addToCart(product);
    setSuccessMessage("✅ Thêm vào giỏ hàng thành công!");

    // Tự động ẩn thông báo sau khoảng thời gian định sẵn
    const timer = setTimeout(() => setSuccessMessage(""), SUCCESS_MESSAGE_TIMEOUT);
    return () => clearTimeout(timer);
  }, [product, addToCart]);

  // Hiển thị các trạng thái loading, error và không có dữ liệu
  if (loading) return <p className="loading">⏳ Đang tải...</p>;
  if (error) return <p className="error">❌ {error}</p>;
  if (!product) return <p className="warning">⚠ Không có dữ liệu sản phẩm!</p>;

  // Render giao diện chi tiết sản phẩm
  return (
    <div className="product-detail">
      {/* Header */}
      <header className="header">
        <Link to="/home" className="store-title">📱 MobileStore</Link>
        <Link to="/cart" className="cart-button">🛍 Giỏ hàng ({cart.length})</Link>
      </header>

      {/* Nội dung chi tiết sản phẩm */}
      <section className="product-content">
        <h2>{product.name}</h2>
        <img src={product.image} alt={product.name} className="product-image" />
        <p className="price">💰 {product.price.toLocaleString("vi-VN")} VNĐ</p>
        <p className="description">{product.description}</p>

        {/* Thông số kỹ thuật */}
        <div className="specs">
          <h3>⚙️ Thông số kỹ thuật</h3>
          <ul>
            <li>📱 Màn hình: {product.screen}</li>
            <li>⚡ Chip: {product.chip}</li>
            <li>💾 RAM: {product.ram}</li>
            <li>💽 Bộ nhớ: {product.storage}</li>
            <li>📷 Camera: {product.camera}</li>
            <li>🔋 Pin: {product.battery}</li>
          </ul>
        </div>

        {/* Thông báo thành công */}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </section>

      {/* Các nút thao tác */}
      <div className="button-group">
        <button className="add-to-cart" onClick={handleAddToCart}>🛒 Thêm vào giỏ</button>
        <Link to="/home"><button className="back-button">⬅ Quay lại</button></Link>
      </div>
    </div>
  );
};

export default ProductDetail;
