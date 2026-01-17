import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로딩 시 저장된 로그인 정보 확인
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        if (userInfo.isLoggedIn) {
          setUser(userInfo);
        }
      } catch (error) {
        console.error('저장된 사용자 정보 로드 실패:', error);
        localStorage.removeItem('userInfo');
      }
    }
    setIsLoading(false);
  }, []);

  // 로그인 함수
  const login = (email, password, remember = false) => {
    return new Promise((resolve, reject) => {
      // 실제 API 호출 대신 임시 로그인 처리
      console.log('로그인 시도:', { email, password, remember });

      // 간단한 유효성 검사 (실제로는 서버에서 처리)
      if (email && password.length >= 6) {
        const userInfo = {
          email: email,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };

        if (remember) {
          localStorage.setItem('rememberLogin', 'true');
        }

        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);

        console.log('로그인 성공:', userInfo);
        resolve(userInfo);
      } else {
        reject(new Error('잘못된 이메일 또는 비밀번호입니다.'));
      }
    });
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('rememberLogin');
    setUser(null);
    console.log('로그아웃 완료');
  };

  // Context 값
  const contextValue = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};