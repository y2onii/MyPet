import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // AuthContext의 login 함수 사용
      await login(formData.email, formData.password, formData.remember);

      alert('로그인이 완료되었습니다!');

      // Survey 페이지로 이동
      navigate('/survey');

    } catch (error) {
      console.error('로그인 오류:', error);
      setErrors({
        general: error.message || '로그인 중 오류가 발생했습니다.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 배경 물방울 컴포넌트
  const Bubbles = () => (
    <div className="bubbles">
      <div className="bubble md b1"></div>
      <div className="bubble lg b2"></div>
      <div className="bubble sm b3"></div>
      <div className="bubble md b4"></div>
      <div className="bubble sm b5"></div>
      <div className="bubble xs b6"></div>
      <div className="bubble md b7"></div>
      <div className="bubble sm b8"></div>
    </div>
  );

  return (
    <div className="login-page">
      {/* 배경 물방울 */}
      <Bubbles />

      {/* 메인 컨테이너 */}
      <div className='login-totalbox'>
        <main className="container">
          {/* 왼쪽 비주얼 */}
          <section className="hero">
            <div className="circle" aria-label="강아지와 고양이 사진">
              <img 
                className="pets-photo" 
                src="../../public/img/smile3.png" 
                alt="잔디 위에서 다정하게 있는 강아지와 고양이"
                onError={(e) => {
                  // 이미지 로드 실패 시 폴백
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="image-placeholder">🐕🐱</div>';
                }}
              />
            </div>
            <h2 className="title">환영합니다!</h2>
            <p className="subtitle">
              소중한 생명들이 당신을 기다리고 있어요.<br />
              따뜻한 가정에서 새로운 시작을 함께해주세요.
            </p>
          </section>

          {/* 오른쪽 로그인 카드 */}
          <section>
            <div className="card">
              <h1>로그인</h1>
              <p className="desc">반려동물과의 소중한 만남을 시작해보세요</p>
              
              <form onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="error-message general-error" style={{marginBottom: '1rem', color: '#e74c3c', textAlign: 'center'}}>
                    {errors.general}
                  </div>
                )}

                <div className="field">
                  <label htmlFor="email" className="form-label">이메일</label>
                  <input
                    className={`input ${errors.email ? 'error' : ''}`}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력해주세요"
                    disabled={isLoading}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="field">
                  <label htmlFor="password" className="form-label">비밀번호</label>
                  <input
                    className={`input ${errors.password ? 'error' : ''}`}
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 입력해주세요"
                    disabled={isLoading}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleInputChange}
                    />
                    로그인 상태 유지
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    비밀번호 찾기
                  </Link>
                </div>

                <button className="submit" type="submit" disabled={isLoading}>
                  {isLoading ? '로그인 중...' : '로그인'}
                </button>
              </form>

              <p className="signup">
                아직 계정이 없으신가요?{' '}
                <Link to="/signup" className="signup-link">
                  회원가입
                </Link>
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Login;