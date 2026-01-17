import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/Header.css';

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  // 로그아웃 핸들러
  const handleLogout = () => {
    const confirmLogout = window.confirm('로그아웃하시겠습니까?');
    if (confirmLogout) {
      logout();
      navigate('/');
      alert('로그아웃되었습니다.');
    }
  };

  return (
    <header className="header">
      <div className="nav">
        <Link className="logo-link" to="/">
          <div className="logo-card">
            <img className="logo-img" src="../../public/img/logo9.png" alt="입양하개 키워주냥 로고" />
          </div>
          <span className="brand">입양하개 키워주냥</span>
        </Link>
        <div className="btns">
          <Link className="btn home" to="/">홈</Link>
          <Link className="btn home" to="/pet-list">입양하기</Link>

          {isLoggedIn ? (
            // 로그인된 상태: 로그아웃 버튼만 표시
            <button
              className="btn logout-btn"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          ) : (
            // 로그인되지 않은 상태: 로그인, 회원가입 버튼 표시
            <>
              <Link className="btn" to="/login">로그인</Link>
              <Link className="btn primary" to="/signup">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;