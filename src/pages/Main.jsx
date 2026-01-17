import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Main.css';
import '../css/Footer.css';

const Main = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // 펫 카드 데이터
  const petsData = [
    {
      id: 1,
      image: '../../public/img/img1.png',
      name: '보리',
      age: '2세',
      gender: '암컷',
      description: '순하고 사람을 좋아해요. 산책을 좋아하는 에너자이저!',
      tags: ['건강검진 완료', '접종 3차', '사람친화'],
      location: '서울 강서구'
    },
    {
      id: 2,
      image: '../../public/img/img8.png',
      name: '치즈',
      age: '1세',
      gender: '수컷',
      description: '낯가림 있지만 금방 친해져요. 캣초보도 OK.',
      tags: ['중성화 완료', '광견병'],
      location: '인천 미추홀구'
    },
    {
      id: 3,
      image: '../../public/img/img5.png',
      name: '해피',
      age: '3세',
      gender: '수컷',
      description: '훈련이 잘 되어 있고 아이들과 잘 지냅니다.',
      tags: ['접종 완료', '활발'],
      location: '경기 수원시'
    },
    {
      id: 4,
      image: '../../public/img/img6.png',
      name: '모카',
      age: '4세',
      gender: '암컷',
      description: '조용하고 애교가 많아요. 1인 가구 추천.',
      tags: ['기생충 예방', '차분'],
      location: '부산 해운대구'
    },
    {
      id: 5,
      image: '../../public/img/img2.png',
      name: '라떼',
      age: '5세',
      gender: '암컷',
      description: '혼자서도 잘 있어요. 산책은 천천히.',
      tags: ['치과 검진'],
      location: '대전 서구'
    },
    {
      id: 6,
      image: '../../public/img/img7.png',
      name: '밤톨',
      age: '6개월',
      gender: '수컷',
      description: '장난꾸러기 초보미묘. 장난감 필수!',
      tags: ['1차 접종', '호기심 많음'],
      location: '대구 중구'
    }
  ];

  // 기능 소개 데이터
  const features = [
    {
      icon: '🔍',
      title: '실시간 검색',
      description: '전국 보호센터의 유기동물 정보를 실시간으로 확인하고, 다양한 조건으로 검색할 수 있습니다.',
      className: 'search'
    },
    {
      icon: '📍',
      title: '보호센터 위치',
      description: '가까운 보호센터를 지도에서 확인하고, 연락처와 운영시간 등 상세 정보를 제공합니다.',
      className: 'location'
    },
    {
      icon: '❤️',
      title: '맞춤 추천',
      description: '생활 패턴과 환경을 분석하여 가장 적합한 반려동물을 추천해드립니다.',
      className: 'heart'
    },
    {
      icon: '📚',
      title: '교육 콘텐츠',
      description: '입양 전후 필요한 정보와 케어 방법을 체계적으로 제공합니다.',
      className: 'education'
    },
    {
      icon: '🏥',
      title: '건강 정보',
      description: '예방접종, 중성화, 건강 상태 등 투명한 의료 정보를 제공합니다.',
      className: 'health'
    },
    {
      icon: '📞',
      title: '간편한 문의',
      description: '관심 동물 등록부터 입양 문의까지 간편하게 진행할 수 있습니다.',
      className: 'contact'
    }
  ];

  // 슬라이더 이동 함수
  const slideLeft = () => {
    const newIndex = (currentSlideIndex - 1 + petsData.length) % petsData.length;
    setCurrentSlideIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const slideRight = () => {
    const newIndex = (currentSlideIndex + 1) % petsData.length;
    setCurrentSlideIndex(newIndex);
    scrollToSlide(newIndex);
  };

  const scrollToSlide = (index) => {
    if (sliderRef.current) {
      const cardWidth = 320; // CSS 변수와 동일하게 설정
      sliderRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // 펫 상세보기 클릭 핸들러
  const handlePetDetailClick = (pet) => {
    // 선택된 펫 정보를 localStorage에 저장
    localStorage.setItem('selectedPet', JSON.stringify(pet));
    navigate('/pet-detail');
  };

  // 스무스 스크롤 함수
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 태그 스타일 클래스 결정
  const getTagClass = (tag) => {
    if (tag.includes('건강') || tag.includes('검진') || tag.includes('중성화') || tag.includes('기생충') || tag.includes('치과')) {
      return 'health';
    }
    if (tag.includes('접종') || tag.includes('광견병')) {
      return 'vaccination';
    }
    return 'personality';
  };

  // 펫 카드 컴포넌트
  const PetCard = ({ pet }) => (
    <article className="pet-card">
      <div className="pet-image">
        <img 
          src={pet.image} 
          alt={`${pet.name} 사진`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = '<div class="image-placeholder">🐾</div>';
          }}
        />
      </div>
      <div className="pet-info">
        <h3 className="pet-name">{pet.name} ({pet.age}, {pet.gender})</h3>
        <p className="pet-details">{pet.description}</p>
        <div className="pet-tags">
          {pet.tags.map((tag, index) => (
            <span key={index} className={`tag ${getTagClass(tag)}`}>
              {tag}
            </span>
          ))}
        </div>
        <div className="pet-location">📍 {pet.location}</div>
        <button 
          className="pet-button"
          onClick={() => handlePetDetailClick(pet)}
        >
          상세 보기
        </button>
      </div>
    </article>
  );

  return (
    <div className="main-page">
      {/* 메인 섹션 */}
      <main className="main-section">
        {/* 배너 */}
        <section id="home" className="impact-banner">
          <div className="impact-inner image-right">
            <div className="impact-copy">
              <div className="impact-kicker">입양하개 키워주냥</div>
              <h2 className="impact-title">새 가족과의 따뜻한 만남</h2>
              <p className="impact-desc">소중한 생명들이 당신들을 기다리고 있어요.</p>
              <div className="bottom-rounded">
                <div className="rounded-chip">
                  새로운 가족을 기다리고 있어요 · 전국의 유기동물들이 따뜻한 가정을 찾고 있습니다 사랑과 관심으로 새로운 시작을 함께해주세요.
                </div>
              </div>
            </div>
            <div className="impact-photo">
              <img 
                className="hero-png" 
                src="../../public/img/smile1.png" 
                alt="반려동물 PNG"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="image-placeholder">🐕🐱</div>';
                }}
              />
            </div>
          </div>
        </section>

        {/* 기능 소개 */}
        <section className="intro-features" id="about">
          <h2 className="intro-title">왜 입양하개 키워주냥을 선택해야 할까요?</h2>
          <p className="intro-subtitle">안전하고 투명한 입양 프로세스로 반려동물과의 소중한 만남을 연결해드립니다</p>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className={`feature-icon ${feature.className}`}>{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 새로 등록된 친구들 */}
        <section className="new-friends-section" id="animals">
          <div className="divider-line"></div>
          <h2 className="section-title">새로 등록된 친구들</h2>
          <p className="section-subtitle">- 따뜻한 가정을 기다리고 있는 소중한 생명들을 만나보세요 -</p>

          <div className="pets-slider-container">
            <button 
              className="slider-arrow prev" 
              aria-label="이전" 
              onClick={slideLeft}
            >
              ‹
            </button>
            <div 
              className="pets-slider" 
              ref={sliderRef}
              aria-live="polite"
            >
              {petsData.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
            <button 
              className="slider-arrow next" 
              aria-label="다음" 
              onClick={slideRight}
            >
              ›
            </button>
          </div>

          <div className="more-button">
            <Link 
              to="/pet-list" 
              className="more-link"
            >
              더보기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Main;