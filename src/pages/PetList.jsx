import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePets } from '../contexts/PetContext';
import '../css/PetList.css';

const PetList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '모든 동물',
    gender: '성별 무관',
    age: '모든 연령',
    location: '전국'
  });

  const navigate = useNavigate();
  const { pets } = usePets();

  // 페이지별 데이터
  const PAGES = [
    [
      {img:'../../public/img/dog1.png', emoji:'🐕', grad:'gradient1', name:'바로', meta:'골든 리트리버 · 수컷 · 2세', tags:[['건강함','health'],['접종완료','vaccination'],['활발함','personality']], loc:'📍 서울 용산구 보호센터'},
      {img:'../../public/img/cat1.png', emoji:'🐱', grad:'gradient2', name:'밤톨', meta:'코리안 숏헤어 · 암컷 · 1세', tags:[['건강함','health'],['접종완료','vaccination'],['온순함','personality']], loc:'📍 부산 해운대구 보호센터'},
      {img:'../../public/img/dog2.png', emoji:'🐕', grad:'gradient3', name:'별이', meta:'비글 · 암컷 · 4세', tags:[['건강함','health'],['접종완료','vaccination'],['사교적','personality']], loc:'📍 대구 수성구 보호센터'},
      {img:'../../public/img/cat2.png', emoji:'🐱', grad:'gradient4', name:'초코', meta:'페르시안 · 수컷 · 3세', tags:[['건강함','health'],['접종완료','vaccination'],['차분함','personality']], loc:'📍 광주 북구 보호센터'},
      {img:'../../public/img/dog3.png', emoji:'🐕', grad:'gradient5', name:'해피', meta:'슈나우저 · 수컷 · 5세', tags:[['건강함','health'],['접종완료','vaccination'],['똑똑함','personality']], loc:'📍 인천 연수구 보호센터'},
      {img:'../../public/img/cat3.png', emoji:'🐱', grad:'gradient6', name:'구름', meta:'러시안 블루 · 암컷 · 2세', tags:[['건강함','health'],['접종완료','vaccination'],['애교많음','personality']], loc:'📍 경기 수원시 보호센터'},
    ],
    [
      {img:'../../public/img/dog4.png', emoji:'🐕', grad:'gradient2', name:'몽실', meta:'포메라니안 · 암컷 · 1세', tags:[['건강함','health'],['접종완료','vaccination'],['활발함','personality']], loc:'📍 서울 강남구 보호센터'},
      {img:'../../public/img/cat4.png', emoji:'🐱', grad:'gradient3', name:'라떼', meta:'랙돌 · 수컷 · 3세', tags:[['건강함','health'],['접종완료','vaccination'],['온순함','personality']], loc:'📍 경기 성남시 보호센터'},
      {img:'../../public/img/dog5.png', emoji:'🐕', grad:'gradient4', name:'토토', meta:'푸들 · 수컷 · 2세', tags:[['건강함','health'],['접종완료','vaccination'],['사교적','personality']], loc:'📍 부산 수영구 보호센터'},
      {img:'../../public/img/cat5.png', emoji:'🐱', grad:'gradient5', name:'두부', meta:'먼치킨 · 암컷 · 1세', tags:[['건강함','health'],['접종완료','vaccination'],['호기심많음','personality']], loc:'📍 대전 유성구 보호센터'},
      {img:'../../public/img/dog6.png', emoji:'🐕', grad:'gradient6', name:'깜찌', meta:'믹스 · 암컷 · 4세', tags:[['건강함','health'],['접종완료','vaccination'],['순함','personality']], loc:'📍 광주 남구 보호센터'},
      {img:'../../public/img/cat6.png', emoji:'🐱', grad:'gradient1', name:'모카', meta:'브리티시숏헤어 · 수컷 · 2세', tags:[['건강함','health'],['접종완료','vaccination'],['차분함','personality']], loc:'📍 인천 남동구 보호센터'},
    ],
    [
      {img:'../../public/img/dog7.png', emoji:'🐕', grad:'gradient3', name:'보리', meta:'시바 이누 · 수컷 · 3세', tags:[['건강함','health'],['접종완료','vaccination'],['활발함','personality']], loc:'📍 울산 남구 보호센터'},
      {img:'../../public/img/cat7.png', emoji:'🐱', grad:'gradient4', name:'미미', meta:'스코티시폴드 · 암컷 · 2세', tags:[['건강함','health'],['접종완료','vaccination'],['애교많음','personality']], loc:'📍 전주 완산구 보호센터'},
      {img:'../../public/img/dog8.png', emoji:'🐕', grad:'gradient5', name:'쿠키', meta:'코카스파니엘 · 암컷 · 5세', tags:[['건강함','health'],['접종완료','vaccination'],['사교적','personality']], loc:'📍 청주 상당구 보호센터'},
      {img:'../../public/img/cat8.png', emoji:'🐱', grad:'gradient6', name:'베리', meta:'터키시앙고라 · 수컷 · 1세', tags:[['건강함','health'],['접종완료','vaccination'],['활동적','personality']], loc:'📍 창원 성산구 보호센터'},
      {img:'../../public/img/dog9.jpg', emoji:'🐕', grad:'gradient1', name:'감자', meta:'말티즈 · 수컷 · 2세', tags:[['건강함','health'],['접종완료','vaccination'],['사교적','personality']], loc:'📍 고양 덕양구 보호센터'},
      {img:'../../public/img/cat9.png', emoji:'🐱', grad:'gradient2', name:'호두', meta:'아메리칸숏헤어 · 암컷 · 4세', tags:[['건강함','health'],['접종완료','vaccination'],['온순함','personality']], loc:'📍 수원 장안구 보호센터'},
    ],
    [
      {img:'../../public/img/dog10.jpg', emoji:'🐕', grad:'gradient4', name:'레오', meta:'도베르만 · 수컷 · 3세', tags:[['건강함','health'],['접종완료','vaccination'],['똑똑함','personality']], loc:'📍 김해시 보호센터'},
      {img:'../../public/img/cat10.jpg', emoji:'🐱', grad:'gradient5', name:'솔', meta:'메인쿤 · 수컷 · 2세', tags:[['건강함','health'],['접종완료','vaccination'],['차분함','personality']], loc:'📍 세종시 보호센터'},
      {img:'../../public/img/dog11.jpg', emoji:'🐕', grad:'gradient6', name:'하루', meta:'보더콜리 · 암컷 · 1세', tags:[['건강함','health'],['접종완료','vaccination'],['활발함','personality']], loc:'📍 포항시 보호센터'},
      {img:'../../public/img/cat11.jpg', emoji:'🐱', grad:'gradient1', name:'하늘', meta:'노르웨이숲 · 암컷 · 3세', tags:[['건강함','health'],['접종완료','vaccination'],['온순함','personality']], loc:'📍 강릉시 보호센터'},
      {img:'../../public/img/dog12.jpg', emoji:'🐕', grad:'gradient2', name:'탄이', meta:'진돗개 · 수컷 · 4세', tags:[['건강함','health'],['접종완료','vaccination'],['충직함','personality']], loc:'📍 여수시 보호센터'},
      {img:'../../public/img/cat12.jpg', emoji:'🐱', grad:'gradient3', name:'보라', meta:'샴 · 암컷 · 2세', tags:[['건강함','health'],['접종완료','vaccination'],['애교많음','personality']], loc:'📍 원주시 보호센터'},
    ],
  ];

  // 등록된 펫들을 PetCard 형식으로 변환
  const formatRegisteredPets = (pets) => {
    return pets.map(pet => ({
      id: pet.id,
      img: pet.mainImages && pet.mainImages.length > 0 ? pet.mainImages[0].preview : null,
      emoji: pet.petType === '강아지' ? '🐕' : '🐱',
      grad: `gradient${(Math.floor(Math.random() * 6) + 1)}`,
      name: pet.petName,
      meta: `${pet.breed || '믹스'} · ${pet.gender || '성별미상'} · ${pet.age || '나이미상'}`,
      tags: [
        ['등록됨', 'health'],
        [pet.vaccination === 'O' ? '접종완료' : '접종필요', 'vaccination'],
        [pet.personality || '성격파악중', 'personality']
      ],
      loc: `📍 ${pet.shelterLocation || '보호소 정보 없음'}`,
      isRegistered: true
    }));
  };

  // 등록된 펫들과 기존 데이터 합치기
  const registeredPets = formatRegisteredPets(pets);
  const allPets = [...registeredPets, ...PAGES.flat()];

  // 페이지별로 나누기 (한 페이지당 6마리)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(allPets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = allPets.slice(startIndex, startIndex + itemsPerPage);

  // 필터 변경 핸들러
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page === 'prev') {
      setCurrentPage(prev => Math.max(1, prev - 1));
    } else if (page === 'next') {
      setCurrentPage(prev => Math.min(totalPages, prev + 1));
    } else {
      setCurrentPage(page);
    }
  };

  // 상세보기 클릭 핸들러
  const handleDetailClick = (pet) => {
    // 선택된 펫 정보를 localStorage에 저장 (임시)
    localStorage.setItem('selectedPet', JSON.stringify(pet));
    navigate('/pet-detail');
  };

  // 카드 컴포넌트
  const PetCard = ({ pet }) => {
    const hasImg = !!(pet.img && pet.img.trim());
    const thumbClass = hasImg ? 'thumb' : `thumb ${pet.grad}`;

    return (
      <article className="card">
        <div className={thumbClass}>
          {hasImg ? (
            <img 
              src={pet.img} 
              alt={pet.name || '동물 사진'} 
              loading="lazy"
              onError={(e) => {
                // 이미지 로드 실패 시 폴백
                e.target.style.display = 'none';
                e.target.parentNode.classList.add(pet.grad);
                e.target.parentNode.innerHTML = `<div class="fallback" aria-hidden="true">${pet.emoji || '🐾'}</div>`;
              }}
            />
          ) : (
            <div className="fallback" aria-hidden="true">
              {pet.emoji || '🐾'}
            </div>
          )}
        </div>
        <div className="body">
          <h3 className="name">{pet.name}</h3>
          <p className="meta">{pet.meta}</p>
          <div className="tags">
            {(pet.tags || []).map(([label, cls], index) => (
              <span key={index} className={`tag ${cls}`}>
                {label}
              </span>
            ))}
          </div>
          <p className="loc">{pet.loc || ''}</p>
          <button 
            className="cta" 
            type="button"
            onClick={() => handleDetailClick(pet)}
          >
            상세보기
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="pet-list-container">
      {/* 메인 */}
      <main className="main">
        <section className="hero">
          <h1>사랑을 기다리는 친구들</h1>
          <p>새로운 가족과의 만남을 꿈꾸는 소중한 생명들을 만나보세요.</p>
        </section>

        <section className="filters" aria-label="검색 필터">
          <h2>완벽한 짝꿍 찾기</h2>
          <div className="filter-grid">
            <label className="filter-item">
              <span className="filter-label">동물 종류</span>
              <select 
                className="filter-select"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option>모든 동물</option>
                <option>강아지</option>
                <option>고양이</option>
              </select>
            </label>
            <label className="filter-item">
              <span className="filter-label">성별</span>
              <select 
                className="filter-select"
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <option>성별 무관</option>
                <option>수컷</option>
                <option>암컷</option>
              </select>
            </label>
            <label className="filter-item">
              <span className="filter-label">나이대</span>
              <select 
                className="filter-select"
                value={filters.age}
                onChange={(e) => handleFilterChange('age', e.target.value)}
              >
                <option>모든 연령</option>
                <option>어린이 (1세 미만)</option>
                <option>성인 (1-6세)</option>
                <option>시니어 (7세 이상)</option>
              </select>
            </label>
            <label className="filter-item">
              <span className="filter-label">지역</span>
              <select 
                className="filter-select"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option>전국</option>
                <option>서울/경기</option>
                <option>부산/경남</option>
                <option>대구/경북</option>
                <option>광주/전남</option>
              </select>
            </label>
          </div>
        </section>

        {/* 등록된 동물 수 표시 */}
        {pets.length > 0 && (
          <div className="registered-pets-info">
            <p>새로 등록된 동물: {pets.length}마리</p>
          </div>
        )}

        {/* 동물 카드 그리드 */}
        <section className="grid" aria-label="등록된 동물 목록">
          {currentData.map((pet, index) => (
            <PetCard key={pet.id || `${currentPage}-${index}`} pet={pet} />
          ))}
        </section>

        {/* 페이지네이션 */}
        <nav className="pagination" aria-label="페이지 이동">
          <button 
            className="page" 
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
          >
            이전
          </button>
          
          {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              className={`page ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            className="page"
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
          
          {/* 등록 페이지 이동 */}
          <button type="button" onClick={() => navigate('/pet-registration')} className="list-button regi">등록</button>
        </nav>

      </main>
    </div>
  );
};

export default PetList;