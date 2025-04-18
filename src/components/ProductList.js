import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(null); // Thông báo lỗi

  useEffect(() => {
    fetch("/db.json")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải sản phẩm!");
        return res.json();
      })
      .then((data) => {
        // Xử lý dữ liệu từ db.json (có thể là { products: [...] } hoặc mảng trực tiếp)
        setProducts(Array.isArray(data) ? data : data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div>
      <h2>📱 Danh sách sản phẩm</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              maxWidth: "200px",
              textAlign: "center",
              backgroundColor: "#fff5f7",
              borderRadius: "5px",
            }}
          >
            <img src={product.image} alt={product.name} style={{ maxWidth: "100%", height: "auto" }} />
            <h3 style={{ fontSize: "1.1rem", margin: "5px 0" }}>{product.name}</h3>
            <p style={{ fontSize: "1rem", color: "#ff80ab" }}>💰 Giá: ${product.price}</p>
            <Link to={`/products/${product.id}`}>
              <button
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ff80ab",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
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