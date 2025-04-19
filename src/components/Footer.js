import React from "react";
import "./Footer.css";

// Component Footer hiển thị thông tin liên hệ và bản quyền
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright">&copy; 2025 MobileStore. All rights reserved.</p>
        <p className="contact-info">
          Liên hệ: mobilestore@gmail.com | Địa chỉ: 123 Đường Hoa Anh Đào, Hà Nội
        </p>
        <div className="footer-links">
          <span>Về chúng tôi</span> | <span>Chính sách bảo mật</span> | <span>Điều khoản sử dụng</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;