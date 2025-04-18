import React, { createContext, useState, useCallback } from "react";

// Tạo CartContext để quản lý giỏ hàng
export const CartContext = createContext();

// Component CartProvider - Cung cấp context cho các component con
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Khởi tạo giỏ hàng rỗng

  // Thêm sản phẩm vào giỏ hàng (tăng số lượng nếu đã tồn tại)
  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  // Tăng số lượng sản phẩm
  const increaseQuantity = useCallback((id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  // Giảm số lượng sản phẩm (xóa nếu số lượng bằng 0)
  const decreaseQuantity = useCallback((id) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.id === id);
      if (item.quantity === 1) {
        return prevCart.filter((item) => item.id !== id);
      }
      return prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  }, []);

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

  // Xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Giá trị context
  const contextValue = {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};