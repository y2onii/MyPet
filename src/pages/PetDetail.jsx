import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/PetDetail.css';

const PetDetail = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [kakaoMap, setKakaoMap] = useState(null);
  const mapRef = useRef(null);
  const [petData, setPetData] = useState(null);

  // 등록된 펫 데이터 로드
  useEffect(() => {
    const registeredData = localStorage.getItem('registeredPetData');
    if (registeredData) {
      const data = JSON.parse(registeredData);
      setPetData(data);
    }
  }, []);

  // 보호소 정보 - 등록된 데이터가 있으면 그것을 사용, 없으면 기본값
  const shelterInfo = petData ? {
    name: petData.shelterName || "광주광역시 동물보호소",
    address: petData.shelterLocation || "광주광역시 북구 본촌동 577",
    phone: petData.contactPerson || "062-571-2808",
    lat: petData.coordinates?.lat || 35.2011,
    lng: petData.coordinates?.lng || 126.8831
  } : {
    name: "광주광역시 동물보호소",
    address: "광주광역시 북구 본촌동 577",
    phone: "062-571-2808",
    lat: 35.2011,
    lng: 126.8831
  };

  // 메인 이미지 (슬라이드 영역) - 등록된 메인 이미지 사용
  const mainImages = petData && petData.mainImages && petData.mainImages.length > 0
    ? petData.mainImages.map(img => img.preview)
    : [
        "../../public/img/dog1.png",
        "../../public/img/dog2.png",
        "../../public/img/dog3.png",
        "../../public/img/dog4.png"
      ];

  // 갤러리 이미지 (하단 갤러리 영역) - 등록된 상세 이미지 사용
  const galleryImages = petData && petData.detailImages && petData.detailImages.length > 0
    ? petData.detailImages.map(img => img.preview)
    : [
        "../../public/img/dog1.png",
        "../../public/img/dog2.png",
        "../../public/img/dog3.png"
      ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mainImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mainImages.length) % mainImages.length);
  };

  // 주소로 좌표 검색 함수
  const searchAddressToCoordinate = (address) => {
    return new Promise((resolve, reject) => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        reject(new Error('카카오 지도 API가 로드되지 않았습니다.'));
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = {
            lat: parseFloat(result[0].y),
            lng: parseFloat(result[0].x)
          };
          console.log(`주소 "${address}" 좌표 변환 성공:`, coords);
          resolve(coords);
        } else {
          console.error(`주소 "${address}" 검색 실패:`, status);
          reject(new Error('주소 검색에 실패했습니다.'));
        }
      });
    });
  };

  // 카카오 지도 초기화
  useEffect(() => {
    const initializeMap = async () => {
      console.log('=== 카카오 지도 초기화 시작 ===');

      if (!mapRef.current) {
        console.error('지도 컨테이너가 없습니다.');
        return;
      }

      if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
        console.log('카카오 API 확인됨 - 지도 생성 시작');

        try {
          const container = mapRef.current;
          let coords = { lat: shelterInfo.lat, lng: shelterInfo.lng };

          // 등록된 좌표가 있으면 사용, 없으면 주소로 검색
          if (!shelterInfo.lat || !shelterInfo.lng ||
              (shelterInfo.lat === 35.2011 && shelterInfo.lng === 126.8831)) {
            try {
              console.log('주소로 좌표 검색 중:', shelterInfo.address);
              coords = await searchAddressToCoordinate(shelterInfo.address);
            } catch (error) {
              console.warn('주소 검색 실패, 기본 좌표 사용:', error.message);
            }
          }

          const options = {
            center: new window.kakao.maps.LatLng(coords.lat, coords.lng),
            level: 3
          };

          console.log('지도 옵션:', options);

          const map = new window.kakao.maps.Map(container, options);
          console.log('지도 생성 완료');

          // 마커 추가
          const markerPosition = new window.kakao.maps.LatLng(coords.lat, coords.lng);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition
          });
          marker.setMap(map);
          console.log('마커 추가 완료');

          // 인포윈도우 추가
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="padding: 10px; min-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #333; font-size: 14px;">${shelterInfo.name}</h4>
                <p style="margin: 0 0 3px 0; font-size: 12px; color: #666;">${shelterInfo.address}</p>
                <p style="margin: 0; font-size: 12px; color: #666;">📞 ${shelterInfo.phone}</p>
              </div>
            `
          });

          // 마커 클릭 시 인포윈도우 표시
          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, marker);
          });

          // 기본적으로 인포윈도우 표시
          infowindow.open(map, marker);

          setKakaoMap(map);
        } catch (error) {
          console.error('지도 생성 오류:', error);
        }
      } else {
        console.error('카카오 지도 API를 사용할 수 없습니다.');
        console.log('window.kakao:', window.kakao);
        console.log('window.kakao.maps:', window.kakao?.maps);
      }
    };

    // 컴포넌트 마운트 후 약간의 지연
    const timer = setTimeout(initializeMap, 1000);
    return () => clearTimeout(timer);
  }, [shelterInfo]);


  return (
    <div className="pet-detail-container">
      <div className="pet-detail-grid">
        {/* 왼쪽: 이미지 섹션 */}
        <div className="image-section">
          {/* 메인 이미지 */}
          <div className="main-image-container">
            <img
              src={mainImages[currentImageIndex]}
              alt="반려동물"
              className="main-image"
            />
            
            {/* 이미지 네비게이션 버튼 */}
            <button
              onClick={prevImage}
              className="nav-button nav-button-left"
            >
              &#8249;
            </button>
            <button
              onClick={nextImage}
              className="nav-button nav-button-right"
            >
              &#8250;
            </button>
          </div>

          {/* 썸네일 이미지들 */}
          <div className="thumbnail-grid">
            {mainImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`thumbnail ${currentImageIndex === index ? 'thumbnail-active' : ''}`}
              >
                <img
                  src={image}
                  alt={`메인 이미지 썸네일 ${index + 1}`}
                  className="thumbnail-image"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 오른쪽: 정보 섹션 */}
        <div className="info-section">
          {/* 기본 정보 */}
          <div className="basic-info">
            <h1 className="pet-name">{petData?.petName || '콩이'}</h1>

            <div className="info-grid">
              <div className="info-row">
                <div className="info-item">
                  <span className="info-label">종류</span>
                  <p className="info-value">{petData?.petType || '강아지'}</p>
                </div>
                <div className="info-item">
                  <span className="info-label">품종</span>
                  <p className="info-value">{petData?.breed || '말티즈'}</p>
                </div>
                <div className="info-item">
                  <span className="info-label">성별</span>
                  <p className="info-value">{petData?.gender || '수컷'}</p>
                </div>
                <div className="info-item">
                  <span className="info-label">나이</span>
                  <p className="info-value">{petData?.age || '2세'}</p>
                </div>
                <div className="info-item">
                  <span className="info-label">체중</span>
                  <p className="info-value">{petData?.weight || '2.7kg'}</p>
                </div>
                <div className="info-item shelter">
                  <span className="info-label">보호소</span>
                  <p className="info-value">{shelterInfo.name}</p>
                </div>

                <div className="info-item shelter-location">
                  <span className="info-label">보호소 위치</span>
                  <p className="info-value address">{shelterInfo.address}</p>
                </div>

                <div className="info-item shelter-tel">
                  <span className="info-label">담당자 연락처</span>
                  <p className="info-value">{shelterInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 성격/특징 */}
          <div className="characteristics-section">
            <div className="characteristics-grid">
              <div className="characteristic-card">
                <div className="characteristic-icon">
                  <img src='../../public/img/icon2.png'></img>
                </div>
                <div className="characteristic-content">
                  <span className="characteristic-label">접종유무</span>
                  <span className="characteristic-value">{petData?.vaccination || 'O'}</span>
                </div>
              </div>

              <div className="characteristic-card">
                <div className="characteristic-icon location-icon">
                  <img src='../../public/img/icon3.png'></img>
                </div>
                <div className="characteristic-content">
                  <span className="characteristic-label">중성화 여부</span>
                  <span className="characteristic-value">{petData?.neutered || 'O'}</span>
                </div>
              </div>

              <div className="characteristic-card">
                <div className="characteristic-icon warning-icon">
                  <img src='../../public/img/icon4.png'></img>
                </div>
                <div className="characteristic-content">
                  <span className="characteristic-label">배변훈련</span>
                  <span className="characteristic-value">{petData?.training || 'O'}</span>
                </div>
              </div>

              <div className="characteristic-card special-card">
                <div className="characteristic-icon volume-icon">
                  <img src='../../public/img/icon5.png'></img>
                </div>
                <div className="characteristic-content">
                  <span className="characteristic-label">짖음/소음 정도</span>
                  <div className="volume-bar">
                    <div className="volume-fill"></div>
                  </div>
                  <span className="characteristic-value">{petData?.noiseLevel || '중'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="action-buttons">
            <a href={`tel:${shelterInfo.phone}`} className="btn-primary">
              입양 문의하기
            </a>
          </div>

          {/* 알림 메시지 */}
          <div className="alert-message">
            <div className="alert-content">
              <img src='../../public/img/icon.png'></img>
              <div>
                <p className="alert-title">특이사항</p>
                <p className="alert-text">
                  {petData?.healthStatus || '오른쪽 다리 수술로 관찰 필요, 미용되어있음'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 갤러리 섹션 */}
      <div className="gallery-section">
        <div className="gallery-header">
          <h2 className="gallery-title">사랑스러운 {petData?.petName || '콩이'}를 만나보세요!</h2>
        </div>

        <div className="gallery-images">
          {galleryImages.map((image, index) => (
            <div key={index} className="gallery-image-container">
              <img
                src={image}
                alt={`갤러리 이미지 ${index + 1}`}
                className="gallery-image"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 카카오 지도 섹션 */}
      <div className="map-section">
        <div className="map-header">
          <h2 className="map-title">보호소 위치</h2>
        </div>

        {/* 카카오 지도 */}
        <div className="map-container">
          <div
            ref={mapRef}
            className="kakao-map"
            style={{
              width: '100%',
              height: '400px',
              minHeight: '400px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          />
        </div>
      </div>

        {/* 하단 상세 내용 */}
        <div className="description">
          {petData?.detailContent ? (
            petData.detailContent.split('\n').map((line, index) => (
              <p key={index} className='content'>{line}</p>
            ))
          ) : (
            <>
              <p className='content'>발랄하고 명랑한 강아지, 콩이를 소개합니다!</p>
              <p className='content'>먹는 게 세상에서 제일 좋은 사교적인 성격을 가졌어요.</p>
              <p className='content'>광주광역시 동물보호소에 처음 방문해주신 봉사자님에게도 먼저 다가가서 인사를 건넵니다.</p>
              <p className='content'>함께 지내는 강아지들과 뛰어 노는 것도 좋아하지만, 간식이 담긴 노즈워크 장난감도 아주 좋아합니다.</p>
              <p className='content'>콩이는 광주광역시 동물보호소에서 가족을 기다리고 있습니다.</p>
              <p className='content'>콩이의 가족이 되어주세요!</p>
            </>
          )}
        </div>

        {/* 목록 페이지 이동 */}
        <button type="button" onClick={() => navigate('/pet-list')} className="list-button">목록</button>
    </div>
  );
};

export default PetDetail;