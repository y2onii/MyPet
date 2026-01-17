import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../contexts/PetContext';
import '../css/PetRegistration.css';

const PetRegistration = () => {
  const navigate = useNavigate();
  const { addPet } = usePets();
  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    breed: '',
    gender: '',
    age: '',
    neutered: '',
    weight: '',
    vaccination: '',
    healthStatus: '',
    medication: '',
    personality: '',
    activityLevel: '',
    training: '',
    noiseLevel: '',
    shelterName: '',
    shelterLocation: '',
    contactPerson: '',
    staffName: '',
    detailContent: ''
  });

  const [mainImages, setMainImages] = useState([]);
  const [detailImages, setDetailImages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이미지 압축 함수
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 비율 유지하면서 크기 조정
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // 이미지 그리기
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 압축된 이미지를 Base64로 변환
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // 메인 이미지 처리 함수
  const handleMainImageChange = (e) => {
    const files = Array.from(e.target.files);

    // 최대 4장 제한
    if (files.length > 4) {
      alert('메인 이미지는 최대 4장까지 선택할 수 있습니다.');
      return;
    }

    // 파일 크기 체크 (예: 5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일만 허용
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('JPEG, PNG, GIF 파일만 업로드 가능합니다.');
      return;
    }

    // 파일을 압축하여 미리보기 생성
    const imagePromises = files.map(async (file) => {
      const compressedDataUrl = await compressImage(file, 800, 0.7); // 800px, 70% 품질
      return {
        file: file,
        preview: compressedDataUrl,
        originalSize: file.size,
        compressedSize: compressedDataUrl.length,
        id: Date.now() + Math.random(),
        type: 'main'
      };
    });

    Promise.all(imagePromises).then(images => {
      console.log('메인 이미지 압축 완료:', images.map(img => ({
        original: (img.originalSize / 1024).toFixed(1) + 'KB',
        compressed: (img.compressedSize / 1024).toFixed(1) + 'KB'
      })));
      setMainImages(images);
    });
  };

  // 상세 이미지 처리 함수
  const handleDetailImageChange = (e) => {
    const files = Array.from(e.target.files);

    // 최대 8장 제한 (상세 이미지는 더 많이 허용)
    if (files.length > 8) {
      alert('상세 이미지는 최대 8장까지 선택할 수 있습니다.');
      return;
    }

    // 파일 크기 체크 (예: 5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일만 허용
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      alert('JPEG, PNG, GIF 파일만 업로드 가능합니다.');
      return;
    }

    // 파일을 압축하여 미리보기 생성
    const imagePromises = files.map(async (file) => {
      const compressedDataUrl = await compressImage(file, 600, 0.6); // 600px, 60% 품질 (상세 이미지는 더 압축)
      return {
        file: file,
        preview: compressedDataUrl,
        originalSize: file.size,
        compressedSize: compressedDataUrl.length,
        id: Date.now() + Math.random(),
        type: 'detail'
      };
    });

    Promise.all(imagePromises).then(images => {
      console.log('상세 이미지 압축 완료:', images.map(img => ({
        original: (img.originalSize / 1024).toFixed(1) + 'KB',
        compressed: (img.compressedSize / 1024).toFixed(1) + 'KB'
      })));
      setDetailImages(images);
    });
  };

  const removeMainImage = (id) => {
    setMainImages(prev => prev.filter(img => img.id !== id));
  };

  const removeDetailImage = (id) => {
    setDetailImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = () => {
    console.log('🚀 handleSubmit 함수 시작');
    console.log('📋 현재 폼 데이터:', formData);
    console.log('🖼️ 메인 이미지:', mainImages);
    console.log('📸 상세 이미지:', detailImages);
    console.log('📍 선택된 위치:', selectedLocation);

    // 필수 필드 검증
    if (!formData.petName.trim()) {
      alert('반려동물 이름을 입력해주세요.');
      return;
    }

    if (!formData.petType) {
      alert('반려동물 종류를 선택해주세요.');
      return;
    }

    try {
      const petData = {
        ...formData,
        mainImages: mainImages,
        detailImages: detailImages,
        coordinates: selectedLocation ? {
          lat: parseFloat(selectedLocation.y || 0),
          lng: parseFloat(selectedLocation.x || 0)
        } : null
      };

      // 데이터 크기 계산
      const dataString = JSON.stringify(petData);
      const dataSize = new Blob([dataString]).size;
      console.log('💾 저장할 데이터 크기:', (dataSize / 1024 / 1024).toFixed(2) + 'MB');

      // localStorage 용량 체크 (보통 5-10MB 제한)
      if (dataSize > 4 * 1024 * 1024) { // 4MB 제한
        console.warn('⚠️ 데이터가 너무 큽니다. 이미지를 더 압축합니다.');

        // 이미지 수 제한으로 용량 줄이기
        const finalData = {
          ...petData,
          mainImages: petData.mainImages.slice(0, 2), // 메인 이미지 최대 2장
          detailImages: petData.detailImages.slice(0, 3) // 상세 이미지 최대 3장
        };

        const reducedString = JSON.stringify(finalData);
        const reducedSize = new Blob([reducedString]).size;
        console.log('🔄 압축된 데이터 크기:', (reducedSize / 1024 / 1024).toFixed(2) + 'MB');

        if (reducedSize > 4 * 1024 * 1024) {
          alert('이미지가 너무 많거나 큽니다. 이미지 수를 줄이거나 더 작은 이미지를 사용해주세요.');
          return;
        }

        // Context에 펫 데이터 추가
        const success = addPet(finalData);
        if (success) {
          alert('이미지가 압축되어 저장되었습니다. (메인 이미지 최대 2장, 상세 이미지 최대 3장)');
        } else {
          alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
          return;
        }
      } else {
        // 정상 크기일 때 저장
        const success = addPet(petData);
        if (!success) {
          alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
          return;
        }
      }

      console.log('📝 등록 완료');
      alert('반려동물 등록이 완료되었습니다!');

      // PetList 페이지로 리다이렉트
      console.log('🔄 페이지 리다이렉트 시작');
      navigate('/pet-list');

    } catch (error) {
      console.error('❌ 등록 중 오류 발생:', error);

      if (error.name === 'QuotaExceededError') {
        alert('저장 공간이 부족합니다. 이미지 수를 줄이거나 더 작은 이미지를 사용해주세요.');
      } else {
        alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 보호소/동물병원 검색 함수 (목업 데이터)
  const searchPlaces = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    console.log('🔍 검색 시작:', keyword);

    // 목업 데이터 (실제로는 서버 API나 외부 API에서 가져올 데이터)
    const mockData = [
      { place_name: '광주광역시 동물보호소', address_name: '광주광역시 북구 본촌동 27', phone: '062-571-2808', category_name: '동물보호소' },
      { place_name: '서울특별시 동물보호센터', address_name: '서울특별시 중랑구 봉화산로 179', phone: '02-2600-0144', category_name: '동물보호소' },
      { place_name: '부산광역시 동물보호소', address_name: '부산광역시 강서구 강서로 692', phone: '051-970-3451', category_name: '동물보호소' },
      { place_name: '대구광역시 동물보호소', address_name: '대구광역시 북구 연암로 284', phone: '053-803-7942', category_name: '동물보호소' },
      { place_name: '인천광역시 동물보호소', address_name: '인천광역시 서구 백석로 167', phone: '032-440-8697', category_name: '동물보호소' },
      { place_name: '24시 응급동물병원', address_name: '서울특별시 강남구 테헤란로 123', phone: '02-1234-5678', category_name: '동물병원' },
      { place_name: '우리동물병원', address_name: '경기도 성남시 분당구 정자로 456', phone: '031-987-6543', category_name: '동물병원' },
      { place_name: '사랑동물병원', address_name: '대전광역시 유성구 대학로 789', phone: '042-555-0123', category_name: '동물병원' },
      { place_name: '행복동물병원', address_name: '울산광역시 남구 삼산로 321', phone: '052-777-8888', category_name: '동물병원' },
      { place_name: '희망동물병원', address_name: '경상북도 포항시 북구 포스코대로 654', phone: '054-111-2222', category_name: '동물병원' }
    ];

    // 키워드로 필터링
    const filteredResults = mockData.filter(place =>
      place.place_name.includes(keyword) ||
      place.address_name.includes(keyword) ||
      (keyword.includes('보호소') && place.category_name.includes('보호소')) ||
      (keyword.includes('동물병원') && place.category_name.includes('동물병원')) ||
      (keyword.includes('병원') && place.category_name.includes('동물병원'))
    );

    // 검색 시뮬레이션을 위한 지연
    setTimeout(() => {
      setSearchResults(filteredResults.slice(0, 8));
      setIsSearching(false);
      console.log('✅ 검색 완료, 결과 개수:', filteredResults.length);
    }, 300);
  };

  // 보호소 위치 입력 핸들러 (검색 기능 포함)
  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    console.log('=== handleLocationInputChange 시작 ===');
    console.log('입력값:', value);

    // 폼 데이터 업데이트
    setFormData(prev => ({
      ...prev,
      shelterLocation: value
    }));

    // 이전 타이머 정리
    if (searchTimeout) {
      console.log('이전 타이머 정리');
      clearTimeout(searchTimeout);
    }

    // 검색어가 없으면 결과 초기화
    if (!value.trim()) {
      console.log('검색어가 비어있음 - 결과 초기화');
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    console.log('디바운싱 타이머 설정 (500ms)');
    // 디바운싱: 입력 후 500ms 후 검색 실행
    const newTimeout = setTimeout(() => {
      console.log('⏰ 디바운싱 완료 - 검색 실행:', value);
      searchPlaces(value);
    }, 500);
    setSearchTimeout(newTimeout);
    console.log('=== handleLocationInputChange 완료 ===');
  };

  // 장소 선택 핸들러
  const handleLocationSelect = (place) => {
    setSelectedLocation(place);
    setFormData(prev => ({
      ...prev,
      shelterName: place.place_name,
      shelterLocation: place.address_name,
      contactPerson: place.phone || ''
    }));
    setSearchResults([]);
  };

  // 컴포넌트 초기화
  useEffect(() => {
    console.log('🚀 PetRegistration 컴포넌트 로드 완료');
  }, []);


  return (
    <div className="adoption-form-container">
        <div className="form-wrapper">
            {/* 기본정보 섹션 */}
            <div className="form-section">
                <h3 className="section-title registration">기본정보</h3>
            
                {/* 메인 이미지 첨부 영역 */}
                <div className="form-group">
                    <div className="section-header">
                    <label className="form-label">메인 이미지 첨부 (슬라이드 영역 표시)</label>
                    </div>

                    <div className="image-upload-area">
                    <input
                        type="file"
                        id="mainImageInput"
                        multiple
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="file-input"
                    />

                    {mainImages.length === 0 ? (
                        <label htmlFor="mainImageInput" className="upload-placeholder">
                        <div className="upload-content">
                            <div className="upload-icon">📷</div>
                            <p>메인 이미지를 선택하거나 드래그해주세요</p>
                            <p className="upload-subtitle">JPEG, PNG, GIF 파일 (최대 5MB) - 상단 슬라이드에 표시됩니다</p>
                        </div>
                        </label>
                    ) : (
                        <div className="image-preview-container">
                        <div className="image-grid">
                            {mainImages.map((image) => (
                            <div key={image.id} className="image-preview">
                                <img src={image.preview} alt="메인 이미지 미리보기" />
                                <button
                                type="button"
                                onClick={() => removeMainImage(image.id)}
                                className="remove-button"
                                >
                                ×
                                </button>
                            </div>
                            ))}

                            {mainImages.length < 4 && (
                            <label htmlFor="mainImageInput" className="add-more-button">
                                <div className="add-icon">+</div>
                                <span>추가</span>
                            </label>
                            )}
                        </div>

                        <div className="image-count">
                            {mainImages.length}/4 장 선택됨 (슬라이드 이미지)
                        </div>
                        </div>
                    )}
                    </div>
                </div>

            <div className="form-group">
                <label className="form-label">이름</label>
                <input 
                type="text" 
                name="petName" 
                value={formData.petName} 
                onChange={handleInputChange}
                className="form-input"
                placeholder="반려동물 이름을 입력하세요"
                />
            </div>

            <div className="form-group">
                <label className="form-label">반려동물 종류</label>
                <div className="radio-group">
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="petType" 
                    value="강아지"
                    checked={formData.petType === '강아지'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    강아지
                </label>
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="petType" 
                    value="고양이"
                    checked={formData.petType === '고양이'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    고양이
                </label>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                <label className="form-label">품종</label>
                <input 
                    type="text" 
                    name="breed" 
                    value={formData.breed} 
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="품종을 입력하세요"
                />
                </div>
                <div className="form-group">
                <label className="form-label">성별</label>
                <div className="radio-group">
                    <label className="radio-item">
                    <input 
                        type="radio" 
                        name="gender" 
                        value="수컷"
                        checked={formData.gender === '수컷'}
                        onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    수컷
                    </label>
                    <label className="radio-item">
                    <input 
                        type="radio" 
                        name="gender" 
                        value="암컷"
                        checked={formData.gender === '암컷'}
                        onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    암컷
                    </label>
                </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                <label className="form-label">나이</label>
                <input 
                    type="text" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="ex) 2세"
                />
                </div>
                <div className="form-group">
                <label className="form-label">체중</label>
                <input 
                    type="text" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="ex) 2.7kg"
                />
                </div>
            </div>
        </div>

        {/* 건강/의료 정보 섹션 */}
        <div className="form-section">
            <h3 className="section-title registration">건강/의료 정보</h3>
            
            <div className="form-group">
                <label className="form-label">예방접종 여부</label>
                <div className="radio-group">
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="vaccination" 
                    value="O"
                    checked={formData.vaccination === 'O'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    O
                </label>
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="vaccination" 
                    value="X"
                    checked={formData.vaccination === 'X'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    X
                </label>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">중성화 여부</label>
                <div className="radio-group">
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="neutered" 
                    value="O"
                    checked={formData.neutered === 'O'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    O
                </label>
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="neutered" 
                    value="X"
                    checked={formData.neutered === 'X'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    X
                </label>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">특이사항</label>
                <input 
                type="text" 
                name="healthStatus" 
                value={formData.healthStatus} 
                onChange={handleInputChange}
                className="form-input"
                placeholder="양호, 치료중, 관찰 필요 등"
                />
            </div>
        </div>

        {/* 성격/행동 특성 섹션 */}
        <div className="form-section">
            <h3 className="section-title registration">성격/행동 특성</h3>
            
            <div className="form-group">
                <label className="form-label">성격 특성</label>
                <input 
                type="text" 
                name="personality" 
                value={formData.personality} 
                onChange={handleInputChange}
                className="form-input"
                placeholder="활발함, 친화적, 온순함 등"
                />
            </div>

            <div className="form-group">
                <label className="form-label">배변 훈련</label>
                <div className="radio-group">
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="training" 
                    value="O"
                    checked={formData.training === 'O'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    O
                </label>
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="training" 
                    value="X"
                    checked={formData.training === 'X'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    X
                </label>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">짖음/소음 정도</label>
                <div className="radio-group">
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="noiseLevel" 
                    value="약"
                    checked={formData.noiseLevel === '약'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    약
                </label>
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="noiseLevel" 
                    value="중"
                    checked={formData.noiseLevel === '중'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    중
                </label>
                <label className="radio-item">
                    <input 
                    type="radio" 
                    name="noiseLevel" 
                    value="강"
                    checked={formData.noiseLevel === '강'}
                    onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    강
                </label>
                </div>
            </div>
        </div>

        {/* 보호소 정보 섹션 */}
        <div className="form-section">
            <h3 className="section-title registration">보호소 정보</h3>

            <div className="form-group">
                <label className="form-label">보호소 이름</label>
                <input
                type="text"
                name="shelterName"
                value={formData.shelterName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="보호소 이름을 입력하세요"
                />
            </div>

            <div className="form-group">
                <label className="form-label">보호소 위치</label>
                <div className="search-container">
                    <input
                        type="text"
                        name="shelterLocation"
                        value={formData.shelterLocation}
                        onChange={handleLocationInputChange}
                        className="form-input search-input"
                        placeholder="보호소나 동물병원을 검색하세요 (예: 광주 동물보호소, 서울 동물병원)"
                    />
                    {isSearching && (
                        <div className="search-loading">🔍 검색중...</div>
                    )}
                    {!isSearching && formData.shelterLocation && searchResults.length === 0 && (
                        <div className="search-no-results">
                            "{formData.shelterLocation}"에 대한 검색 결과가 없습니다. 다른 키워드로 검색해보세요.
                        </div>
                    )}
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map((place, index) => (
                                <div
                                    key={index}
                                    className="search-result-item"
                                    onClick={() => handleLocationSelect(place)}
                                >
                                    <div className="place-name">{place.place_name}</div>
                                    <div className="place-address">{place.address_name}</div>
                                    {place.category_name && (
                                        <div className="place-category">{place.category_name}</div>
                                    )}
                                    {place.phone && (
                                        <div className="place-phone">📞 {place.phone}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {selectedLocation && (
                    <div className="selected-location-info">
                        ✅ 선택된 장소: {selectedLocation.place_name}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label className="form-label">담당자 연락처</label>
                <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="form-input"
                placeholder="ex) 000-0000-0000"
                />
            </div>
        </div>

        {/* 상세내용 섹션 */}
        <div className="form-section">
            <h3 className="section-title registration">상세 내용</h3>

            {/* 상세 이미지 첨부 영역 */}
            <div className="form-group">
                <div className="section-header">
                    <label className="form-label">상세 이미지 첨부 (갤러리 영역 표시)</label>
                </div>

                <div className="image-upload-area">
                    <input
                        type="file"
                        id="detailImageInput"
                        multiple
                        accept="image/*"
                        onChange={handleDetailImageChange}
                        className="file-input"
                    />

                    {detailImages.length === 0 ? (
                        <label htmlFor="detailImageInput" className="upload-placeholder">
                        <div className="upload-content">
                            <div className="upload-icon">📷</div>
                            <p>상세 이미지를 선택하거나 드래그해주세요</p>
                            <p className="upload-subtitle">JPEG, PNG, GIF 파일 (최대 5MB) - 하단 갤러리에 표시됩니다</p>
                        </div>
                        </label>
                    ) : (
                        <div className="image-preview-container">
                            <div className="image-grid">
                                {detailImages.map((image) => (
                                <div key={image.id} className="image-preview">
                                    <img src={image.preview} alt="상세 이미지 미리보기" />
                                    <button
                                    type="button"
                                    onClick={() => removeDetailImage(image.id)}
                                    className="remove-button"
                                    >
                                    ×
                                    </button>
                                </div>
                                ))}

                                {detailImages.length < 8 && (
                                <label htmlFor="detailImageInput" className="add-more-button">
                                    <div className="add-icon">+</div>
                                    <span>추가</span>
                                </label>
                                )}
                            </div>

                            <div className="image-count">
                                {detailImages.length}/8 장 선택됨 (갤러리 이미지)
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 내용 입력 영역 */}
            <div className="form-group">
                <label className="form-label" htmlFor="contentTextarea">내용</label>
                <div className="textarea-container">
                    <textarea
                        id="contentTextarea"
                        name="detailContent"
                        value={formData.detailContent}
                        onChange={handleInputChange}
                        className="content-textarea"
                        placeholder="반려동물에 대한 상세한 설명을 입력해주세요.
                        예) 성격, 특징, 건강상태, 입양 시 주의사항 등"
                        rows={8}
                    />
                    <div className="character-count">
                        {formData.detailContent.length}/1000
                    </div>
                </div>
            </div>
        </div>

            {/* 등록 버튼 */}
            <div className="button-container">
                <button type="button" onClick={() => navigate('/pet-list')} className="cancel-button">
                    목록
                </button>
                <button type="button" onClick={handleSubmit} className="submit-button">
                    등록
                </button>
            </div>
        </div>
    </div>
  );
};

export default PetRegistration;