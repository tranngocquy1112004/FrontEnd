import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./components/ProductDetail";
import Account from "./account/Account";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./pages/CartContext";
import Footer from "./components/Footer";

// Component chính của ứng dụng
const App = () => {
  return (
    // CartProvider bao bọc toàn bộ ứng dụng để quản lý state giỏ hàng
    <CartProvider>
      {/* Router quản lý điều hướng trong ứng dụng */}
      <Router>
        {/* Định nghĩa các route và component tương ứng */}
        <Routes>
          <Route path="/" element={<Account />} />          {/* Trang đăng nhập */}
          <Route path="/home" element={<ProductPage />} />  {/* Trang chủ hiển thị sản phẩm */}
          <Route path="/products/:id" element={<ProductDetail />} /> {/* Trang chi tiết sản phẩm */}
          <Route path="/cart" element={<CartPage />} />     {/* Trang giỏ hàng */}
        </Routes>
        {/* Footer hiển thị ở tất cả các trang */}
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;