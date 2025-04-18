import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../pages/CartContext";
import "./ProductDetail.css";

const SUCCESS_MESSAGE_TIMEOUT = 2000;

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, cart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Không thể tải dữ liệu sản phẩm!");

        const data = await response.json();
        const productId = Number(id);

        if (!Array.isArray(data.products)) {
          throw new Error("Dữ liệu sản phẩm không hợp lệ!");
        }

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

  const handleAddToCart = useCallback(() => {
    if (!product) return;

    addToCart(product);
    setSuccessMessage("✅ Thêm vào giỏ hàng thành công!");

    const timer = setTimeout(() => setSuccessMessage(""), SUCCESS_MESSAGE_TIMEOUT);
    return () => clearTimeout(timer);
  }, [product, addToCart]);

  if (loading) return <p className="loading">⏳ Đang tải...</p>;
  if (error) return <p className="error">❌ {error}</p>;
  if (!product) return <p className="warning">⚠ Không có dữ liệu sản phẩm!</p>;

  return (
    <div className="product-detail">
      <header className="header">
        <Link to="/home" className="store-title">📱 MobileStore</Link>
        <Link to="/cart" className="cart-button">🛍 Giỏ hàng ({cart.length})</Link>
      </header>

      <section className="product-content">
        <h2>{product.name}</h2>
        <img src={product.image} alt={product.name} className="product-image" />
        <p className="price">💰 {product.price.toLocaleString("vi-VN")} VNĐ</p>
        <p className="description">{product.description}</p>

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

        {successMessage && <p className="success-message">{successMessage}</p>}
      </section>

      <div className="button-group">
        <button className="add-to-cart" onClick={handleAddToCart}>🛒 Thêm vào giỏ</button>
        <Link to="/home"><button className="back-button">⬅ Quay lại</button></Link>
      </div>
    </div>
  );
};

export default ProductDetail;
