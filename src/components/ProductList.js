import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

// Component hiển thị danh sách sản phẩm
const ProductList = () => {
  // State quản lý dữ liệu và trạng thái
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Thông báo lỗi

  // Lấy danh sách sản phẩm khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Không thể tải sản phẩm!");
        
        const data = await response.json();
        
        // Kiểm tra và xử lý dữ liệu
        if (!data || (!Array.isArray(data) && !Array.isArray(data.products))) {
          throw new Error("Dữ liệu sản phẩm không hợp lệ!");
        }
        
        // Lưu danh sách sản phẩm vào state
        setProducts(Array.isArray(data) ? data : data.products);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hiển thị trạng thái loading và error
  if (loading) return <p className="loading-text">⏳ Đang tải...</p>;
  if (error) return <p className="error-text">❌ {error}</p>;

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">📱 Danh sách sản phẩm</h2>
      
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">
              💰 {product.price.toLocaleString("vi-VN")} VNĐ
            </p>
            <Link to={`/products/${product.id}`}>
              <button className="detail-button">
                Chi tiết
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;