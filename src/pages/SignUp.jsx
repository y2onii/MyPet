import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignUp.css';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birth: '',
    gender: '',
    password: '',
    password2: '',
    phone: '',
    region: '',
    agreements: {
      terms: false,
      privacy: false,
      marketing: false
    }
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const maxStep = 3;

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 약관 동의 토글
  const handleAgreementChange = (agreementType) => {
    setFormData(prev => ({
      ...prev,
      agreements: {
        ...prev.agreements,
        [agreementType]: !prev.agreements[agreementType]
      }
    }));
  };

  // 단계별 유효성 검사
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
      if (!formData.email.trim()) {
        newErrors.email = '이메일을 입력해주세요.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = '올바른 이메일 형식을 입력해주세요.';
      }
      if (!formData.birth) newErrors.birth = '생년월일을 선택해주세요.';
      if (!formData.gender) newErrors.gender = '성별을 선택해주세요.';
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = '비밀번호를 입력해주세요.';
      } else if (formData.password.length < 8) {
        newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
      }
      
      if (!formData.password2) {
        newErrors.password2 = '비밀번호 확인을 입력해주세요.';
      } else if (formData.password !== formData.password2) {
        newErrors.password2 = '비밀번호가 일치하지 않습니다.';
      }

      if (!formData.phone.trim()) newErrors.phone = '휴대폰 번호를 입력해주세요.';
      if (!formData.region) newErrors.region = '지역을 선택해주세요.';
    }

    if (step === 3) {
      if (!formData.agreements.terms) newErrors.terms = '서비스 이용약관에 동의해주세요.';
      if (!formData.agreements.privacy) newErrors.privacy = '개인정보 처리방침에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 다음 단계로
  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < maxStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // 이전 단계로
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    // 회원가입 처리 (실제로는 API 호출)
    console.log('회원가입 데이터:', formData);

    // 사용자 정보 저장 (임시)
    localStorage.setItem('userInfo', JSON.stringify({
      name: formData.name,
      email: formData.email,
      isLoggedIn: true,
      joinDate: new Date().toISOString()
    }));

    alert('회원가입이 완료되었습니다!');
    navigate('/login');
  };

  // 진행률 계산
  const getProgressWidth = () => {
    const widths = { 1: '0%', 2: '50%', 3: '100%' };
    return widths[currentStep];
  };

  // 배경 물방울 컴포넌트
  const Bubbles = () => (
    <div className="bubbles" aria-hidden="true">
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

  // 약관 체크박스 컴포넌트
  const AgreementCheckBox = ({ type, text, isRequired = false }) => (
    <div className="check-box" onClick={() => handleAgreementChange(type)}>
      <div 
        className={`cute ${formData.agreements[type] ? 'checked' : ''}`}
        role="checkbox"
        aria-checked={formData.agreements[type]}
      ></div>
      <div>{isRequired ? '[필수]' : '[선택]'} {text}</div>
    </div>
  );

  return (
    <div className="join-page">
      {/* 배경 물방울 */}
      <Bubbles />

      {/* 메인 컨테이너 */}
      <div className='login-totalbox'>
        <main className="container">
          {/* 왼쪽 비주얼 */}
          <section className="hero">
            <div className="circle">
              <img 
                src="../../public/img/smile7.png" 
                alt="강아지와 고양이"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="image-placeholder">🐕🐱</div>';
                }}
              />
            </div>

            <div className="welcome">
              <h2>환영합니다!</h2>
              <p>
                소중한 생명들이 당신을 기다리고 있어요.<br />
                따뜻한 가정에서 새로운 시작을 함께해주세요.
              </p>
            </div>
          </section>

          {/* 오른쪽: 단계형 회원가입 */}
          <section className="panel">
            <h1>회원가입</h1>
            <p className="sub">몇 단계만 거치면 완료됩니다</p>

            {/* 진행 상태 */}
            <div className="steps">
              <div className="bar">
                <div className="bar-fill" style={{ width: getProgressWidth() }}></div>
              </div>
              <div className="dots">
                <div className={`dot ${currentStep >= 1 ? 'active' : ''}`}>1</div>
                <div className={`dot ${currentStep >= 2 ? 'active' : ''}`}>2</div>
                <div className={`dot ${currentStep >= 3 ? 'active' : ''}`}>3</div>
              </div>
              <div className="labels">
                <span className={currentStep === 1 ? 'on' : ''}>기본 정보</span>
                <span className={currentStep === 2 ? 'on' : ''}>계정 설정</span>
                <span className={currentStep === 3 ? 'on' : ''}>약관 동의</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1: 기본 정보 */}
              {currentStep === 1 && (
                <div className="form-step active">
                  <div className="form-group">
                    <label className="label" htmlFor="name">이름</label>
                    <input
                      id="name"
                      name="name"
                      className={`input ${errors.name ? 'error' : ''}`}
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="이름을 입력해주세요"
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="label" htmlFor="email">이메일</label>
                    <input
                      id="email"
                      name="email"
                      className={`input ${errors.email ? 'error' : ''}`}
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="이메일 주소를 입력해주세요"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="row">
                    <div className="form-group">
                      <label className="label" htmlFor="birth">생년월일</label>
                      <input
                        id="birth"
                        name="birth"
                        className={`input ${errors.birth ? 'error' : ''}`}
                        type="date"
                        value={formData.birth}
                        onChange={handleInputChange}
                      />
                      {errors.birth && <span className="error-message">{errors.birth}</span>}
                    </div>
                    <div className="form-group">
                      <label className="label" htmlFor="gender">성별</label>
                      <select
                        id="gender"
                        name="gender"
                        className={`select ${errors.gender ? 'error' : ''}`}
                        value={formData.gender}
                        onChange={handleInputChange}
                      >
                        <option value="">성별 선택</option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                        <option value="other">기타</option>
                      </select>
                      {errors.gender && <span className="error-message">{errors.gender}</span>}
                    </div>
                  </div>

                  <div className="actions">
                    <button type="button" className="btn-step primary" onClick={nextStep}>
                      다음 단계
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: 계정 설정 */}
              {currentStep === 2 && (
                <div className="form-step active">
                  <div className="form-group">
                    <label className="label" htmlFor="password">비밀번호</label>
                    <input
                      id="password"
                      name="password"
                      className={`input ${errors.password ? 'error' : ''}`}
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="8자 이상, 영문+숫자+"
                    />
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label className="label" htmlFor="password2">비밀번호 확인</label>
                    <input
                      id="password2"
                      name="password2"
                      className={`input ${errors.password2 ? 'error' : ''}`}
                      type="password"
                      value={formData.password2}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 다시 입력해주세요"
                    />
                    {errors.password2 && <span className="error-message">{errors.password2}</span>}
                  </div>

                  <div className="row">
                    <div className="form-group">
                      <label className="label" htmlFor="phone">휴대폰 번호</label>
                      <input
                        id="phone"
                        name="phone"
                        className={`input ${errors.phone ? 'error' : ''}`}
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="010-0000-0000"
                      />
                      {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                    <div className="form-group">
                      <label className="label" htmlFor="region">지역</label>
                      <select
                        id="region"
                        name="region"
                        className={`select ${errors.region ? 'error' : ''}`}
                        value={formData.region}
                        onChange={handleInputChange}
                      >
                        <option value="">지역을 선택해주세요</option>
                        <option>서울특별시</option>
                        <option>부산광역시</option>
                        <option>대구광역시</option>
                        <option>인천광역시</option>
                        <option>광주광역시</option>
                        <option>대전광역시</option>
                        <option>경기도</option>
                        <option>기타</option>
                      </select>
                      {errors.region && <span className="error-message">{errors.region}</span>}
                    </div>
                  </div>

                  <div className="actions">
                    <button type="button" className="btn-step secondary" onClick={prevStep}>
                      이전
                    </button>
                    <button type="button" className="btn-step primary" onClick={nextStep}>
                      다음 단계
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: 약관 동의 */}
              {currentStep === 3 && (
                <div className="form-step active">
                  <AgreementCheckBox
                    type="terms"
                    text="서비스 이용약관에 동의합니다."
                    isRequired={true}
                  />
                  {errors.terms && <span className="error-message">{errors.terms}</span>}

                  <AgreementCheckBox
                    type="privacy"
                    text="개인정보 처리방침에 동의합니다."
                    isRequired={true}
                  />
                  {errors.privacy && <span className="error-message">{errors.privacy}</span>}

                  <AgreementCheckBox
                    type="marketing"
                    text="소식/이벤트 알림을 받겠습니다."
                    isRequired={false}
                  />

                  <div className="actions">
                    <button type="button" className="btn-step secondary" onClick={prevStep}>
                      이전
                    </button>
                    <button type="submit" className="btn-step primary">
                      가입 완료
                    </button>
                  </div>
                </div>
              )}
            </form>

            <p className="login-link">
              이미 계정이 있으신가요?{' '}
              <Link to="/login">로그인</Link>
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SignUp;