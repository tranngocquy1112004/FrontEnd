import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Account.css";

// Component quản lý đăng nhập và đăng ký
const Account = () => {
  const navigate = useNavigate(); // Hook điều hướng
  
  // Các state quản lý trạng thái đăng nhập và đăng ký
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [isRegistering, setIsRegistering] = useState(false); // Trạng thái form (đăng nhập/đăng ký)
  const [user, setUser] = useState({ username: "", password: "" }); // Thông tin người dùng nhập
  const [currentUser, setCurrentUser] = useState(null); // Thông tin người dùng hiện tại
  const [loginMessage, setLoginMessage] = useState(""); // Thông báo cho người dùng

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const checkLoggedInUser = () => {
      const savedUser = JSON.parse(localStorage.getItem("currentUser"));
      if (savedUser) {
        setIsLoggedIn(true);
        setCurrentUser(savedUser);
      }
    };
    checkLoggedInUser();
  }, []);

  // Chuyển hướng về trang chủ khi đăng nhập thành công
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    }
  }, [isLoggedIn, currentUser, navigate]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setLoginMessage(""); // Xóa thông báo khi người dùng thay đổi input
  };

  // Xử lý đăng ký tài khoản mới
  const handleRegister = () => {
    // Kiểm tra input rỗng
    if (!user.username.trim() || !user.password.trim()) {
      setLoginMessage("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    // Lấy danh sách người dùng từ localStorage
    let storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra tên đăng nhập đã tồn tại
    if (storedUsers.some((u) => u.username === user.username)) {
      setLoginMessage("Tên đăng nhập đã tồn tại!");
      return;
    }

    // Lưu người dùng mới
    storedUsers.push(user);
    localStorage.setItem("users", JSON.stringify(storedUsers));

    // Hiển thị thông báo thành công và reset form
    setLoginMessage("Đăng ký thành công! Hãy đăng nhập.");
    setUser({ username: "", password: "" });
    setTimeout(() => {
      setIsRegistering(false);
    }, 1000);
  };

  // Xử lý đăng nhập
  const handleLogin = () => {
    // Kiểm tra input rỗng
    if (!user.username.trim() || !user.password.trim()) {
      setLoginMessage("Vui lòng nhập tên đăng nhập và mật khẩu!");
      return;
    }

    // Kiểm tra thông tin đăng nhập
    let storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = storedUsers.find(
      (u) => u.username === user.username && u.password === user.password
    );

    if (foundUser) {
      // Đăng nhập thành công
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setIsLoggedIn(true);
      setCurrentUser(foundUser);
      setLoginMessage("Đăng nhập thành công!");
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } else {
      setLoginMessage("Sai thông tin đăng nhập");
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <div className="account-container">
      <div className="account-box">
        <h1>{isLoggedIn ? `Xin chào, ${currentUser?.username}!` : "Đăng nhập / Đăng ký"}</h1>

        {!isLoggedIn && (
          <div>
            {/* Form đăng nhập/đăng ký */}
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              className="account-input"
              value={user.username}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              className="account-input"
              value={user.password}
              onChange={handleChange}
            />

            {/* Hiển thị thông báo */}
            {loginMessage && (
              <p className={`login-message ${loginMessage.includes("thành công") ? "success" : ""}`}>
                {loginMessage}
              </p>
            )}

            {/* Nút điều khiển */}
            <div className="account-buttons">
              {isRegistering ? (
                <>
                  <button className="account-button register-btn" onClick={handleRegister}>
                    Đăng ký
                  </button>
                  <button className="link-to-home" onClick={() => setIsRegistering(false)}>
                    Quay lại đăng nhập
                  </button>
                </>
              ) : (
                <>
                  <button className="account-button login-btn" onClick={handleLogin}>
                    Đăng nhập
                  </button>
                  <button className="link-to-home" onClick={() => setIsRegistering(true)}>
                    Chưa có tài khoản? Đăng ký
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;