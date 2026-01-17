import React, { createContext, useContext, useState, useEffect } from 'react';

const PetContext = createContext();

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);

  // 로컬스토리지에서 등록된 펫 데이터 로드
  useEffect(() => {
    const savedPets = localStorage.getItem('registeredPets');
    if (savedPets) {
      try {
        const parsedPets = JSON.parse(savedPets);
        setPets(Array.isArray(parsedPets) ? parsedPets : [parsedPets]);
      } catch (error) {
        console.error('저장된 펫 데이터 로드 중 오류:', error);
        setPets([]);
      }
    }
  }, []);

  // 새 펫 등록 함수
  const addPet = (petData) => {
    const newPet = {
      ...petData,
      id: Date.now() + Math.random(), // 고유 ID 생성
      registeredAt: new Date().toISOString()
    };

    const updatedPets = [...pets, newPet];
    setPets(updatedPets);

    // 로컬스토리지에 저장
    try {
      localStorage.setItem('registeredPets', JSON.stringify(updatedPets));
      console.log('새 펫이 등록되었습니다:', newPet);
      return true;
    } catch (error) {
      console.error('펫 데이터 저장 중 오류:', error);
      // 저장 실패시 상태 롤백
      setPets(pets);
      return false;
    }
  };

  // 펫 삭제 함수 (추후 필요시)
  const removePet = (petId) => {
    const updatedPets = pets.filter(pet => pet.id !== petId);
    setPets(updatedPets);
    localStorage.setItem('registeredPets', JSON.stringify(updatedPets));
  };

  // Context 값
  const contextValue = {
    pets,
    addPet,
    removePet,
    totalPets: pets.length
  };

  return (
    <PetContext.Provider value={contextValue}>
      {children}
    </PetContext.Provider>
  );
};