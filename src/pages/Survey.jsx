import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Survey.css';

const Survey = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const sections = [
    {
      id: 1,
      title: "생활환경 관련",
      questions: [
        {
          id: 1,
          question: "현재 거주 형태는 무엇입니까?",
          options: [
            "아파트(엘리베이터 有)",
            "아파트(엘리베이터 無)",
            "단독주택(마당 有)",
            "단독주택(마당 無)",
            "원룸/오피스텔"
          ]
        },
        {
          id: 2,
          question: "집에서 반려동물이 활동할 수 있는 실내 공간 크기는 어느 정도인가요?",
          options: [
            "10평 이하",
            "11~20평",
            "21평 이상"
          ]
        },
        {
          id: 3,
          question: "하루 평균 집을 비우는 시간은 몇 시간 정도인가요?",
          options: [
            "1~3시간",
            "4~6시간",
            "7~10시간",
            "10시간 이상"
          ]
        },
        {
          id: 4,
          question: "하루 평균 산책/놀이 시간을 얼마나 확보할 수 있나요?",
          options: [
            "30분 이하",
            "1시간",
            "2시간 이상"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "책임감/경제적 준비",
      questions: [
        {
          id: 5,
          question: "반려동물 양육에 월 평균 얼마 정도 지출할 계획인가요?",
          options: [
            "5만 원 이하",
            "5~10만 원",
            "10~20만 원",
            "20만원 이상"
          ]
        },
        {
          id: 6,
          question: "갑작스러운 의료비(예: 수술비 50만~100만 원 이상)가 발생했을 때, 감당할 수 있나요?",
          options: [
            "예",
            "아니오"
          ]
        },
        {
          id: 7,
          question: "반려동물 보험 가입을 고려하고 있나요?",
          options: [
            "예",
            "아니오"
          ]
        }
      ]
    },
    {
      id: 3,
      title: "가족/동거인 동의",
      questions: [
        {
          id: 8,
          question: "함께 거주하는 모든 가족/동거인과 충분히 상의했나요?",
          options: [
            "예, 모두 동의함",
            "일부만 동의",
            "아직 상의하지 않음"
          ]
        },
        {
          id: 9,
          question: "가족 중 알레르기 반응이 있는 사람이 있나요? 있다면 대처 방법이 준비되어 있나요?",
          options: [
            "없음",
            "있음, 대처 방법 준비됨",
            "있음, 준비 없음"
          ]
        }
      ]
    },
    {
      id: 4,
      title: "경험/지식",
      questions: [
        {
          id: 10,
          question: "이전에 반려동물을 키운 경험이 있다면, 몇 년간 키웠나요?",
          options: [
            "없음",
            "1년 이하 ",
            "2~5년",
            "6년 이상"
          ]
        },
        {
          id: 11,
          question: "기본 훈련(배변, 짖음 조절, 사회화)에 대해 어떤 방식으로 교육할 계획인가요?",
          options: [
            "직접 학습 후 교육",
            "전문가/훈련소 도움 예정",
            "아직 계획 없음"
          ]
        },
        {
          id: 12,
          question: "반려동물 문제행동(짖음, 배변실수, 분리불안 등)이 생기면 어떻게 대처할 생각인가요?",
          options: [
            "전문 상담/훈련 이용",
            "온라인 정보 학습",
            "처벌/강압적 훈련(⚠️부적합)"
          ]
        }
      ]
    },
    {
      id: 5,
      title: "장기적 책임",
      questions: [
        {
          id: 13,
          question: "반려동물의 평균 수명(10~15년)을 고려했을 때, 앞으로 10년 후의 본인 생활을 어떻게 예상하시나요?",
          options: [
            "안정적(주거·직업·가정 변화 적음)",
            "변화 가능성 있음(이사·결혼·출산 등)",
            "불안정(유학·해외근무·잦은 이사 예상)"
          ]
        },
        {
          id: 14,
          question: "이사, 결혼, 출산 등으로 생활환경이 크게 바뀌더라도 반려동물을 끝까지 책임질 수 있나요?",
          options: [
            "예",
            "아니오"
          ]
        }
      ]
    }
  ];

  // 선택 저장
  const handleMultiOptionSelect = (questionIndex, option) => {
    const key = `${currentSection}-${questionIndex}`;
    const newAnswers = { ...answers, [key]: option };
    setAnswers(newAnswers);
  };

  // 현재 섹션 모든 질문에 답했는지 확인
  const isCurrentSectionComplete = () => {
    if (!sections[currentSection] || !sections[currentSection].questions) {
      return false;
    }
    return sections[currentSection].questions.every((_, questionIndex) => {
      const key = `${currentSection}-${questionIndex}`;
      return answers.hasOwnProperty(key);
    });
  };

  const handleNext = () => {
    if (!isCurrentSectionComplete()) {
      alert('모든 질문에 답해주세요.');
      return;
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleRestart = () => {
    setCurrentSection(0);
    setAnswers({});
    setShowResult(false);
  };

  const handleConfirm = () => {
    navigate('/main');
  };

  const getTotalQuestions = () => {
    return sections.reduce((total, section) => total + section.questions.length, 0);
  };

  const getCurrentQuestionNumber = () => {
    let questionNumber = 0;
    for (let i = 0; i < currentSection; i++) {
      questionNumber += sections[i].questions.length;
    }
    return questionNumber + 1;
  };

  const answeredQuestionsCount = Object.keys(answers).length;
  const totalQuestions = getTotalQuestions();
  const progressPercentage = showResult ? 100 : (answeredQuestionsCount / totalQuestions) * 100;

  const mapOptionToScore = (questionId, option) => {
    const mapping = {
      1: { 
        "단독주택(마당 有)": 3,
        "아파트(엘리베이터 有)": 2,
        "아파트(엘리베이터 無)": 1,
        "단독주택(마당 無)": 2,
        "원룸/오피스텔": 0
      },
      2: {
        "21평 이상": 3,
        "11~20평": 2,
        "10평 이하": 0
      },
      3: {
        "1~3시간": 3,
        "4~6시간": 2,
        "7~10시간": 1,
        "10시간 이상": 0
      },
      4: {
        "2시간 이상": 3,
        "1시간": 2,
        "30분 이하": 0
      },
      5: {
        "20만원 이상": 3,
        "10~20만 원": 2,
        "5~10만 원": 1,
        "5만 원 이하": 0
      },
      6: {
        "예": 3,
        "아니오": 0
      },
      7: {
        "예": 2,
        "아니오": 0
      },
      8: {
        "예, 모두 동의함": 3,
        "일부만 동의": 1,
        "아직 상의하지 않음": 0
      },
      9: {
        "없음": 3,
        "있음, 대처 방법 준비됨": 2,
        "있음, 준비 없음": 0
      },
      10: {
        "6년 이상": 3,
        "2~5년": 2,
        "1년 이하 ": 1,
        "없음": 0
      },
      11: {
        "전문가/훈련소 도움 예정": 3,
        "직접 학습 후 교육": 2,
        "아직 계획 없음": 0
      },
      12: {
        "전문 상담/훈련 이용": 3,
        "온라인 정보 학습": 1,
        "처벌/강압적 훈련(⚠️부적합)": 0
      },
      13: {
        "안정적(주거·직업·가정 변화 적음)": 3,
        "변화 가능성 있음(이사·결혼·출산 등)": 1,
        "불안정(유학·해외근무·잦은 이사 예상)": 0
      },
      14: {
        "예": 3,
        "아니오": 0
      }
    };

    if (mapping[questionId] && mapping[questionId][option] !== undefined) {
      return mapping[questionId][option];
    }
    // 디폴트 점수: 0
    return 0;
  };

  // 섹션별 피드백 생성
  const getSectionFeedback = (sectionScore, sectionMaxScore, sectionTitle) => {
    const percentage = (sectionScore / sectionMaxScore) * 100;

    const feedbackMap = {
      '생활환경 관련': {
        low: '현재 생활환경이 반려동물에게 다소 제한적일 수 있습니다. 충분한 활동 공간과 산책 시간을 확보하는 것이 중요합니다.',
        medium: '기본적인 생활환경은 갖춰져 있으나, 반려동물의 활동성과 스트레스 해소를 위해 더 나은 환경을 고려해보세요.',
        high: '반려동물이 건강하고 행복하게 생활할 수 있는 훌륭한 환경을 갖추고 있습니다.'
      },
      '책임감/경제적 준비': {
        low: '반려동물 양육에 필요한 경제적 준비가 부족합니다. 의료비와 생활비를 충분히 고려하여 계획을 세워보세요.',
        medium: '기본적인 경제적 준비는 되어있으나, 응급상황을 대비한 추가적인 준비가 필요합니다.',
        high: '반려동물의 모든 필요를 충족할 수 있는 훌륭한 경제적 준비가 되어있습니다.'
      },
      '가족/동거인 동의': {
        low: '가족 구성원들과의 충분한 상의와 동의가 필요합니다. 모든 가족이 함께 책임질 수 있도록 준비해주세요.',
        medium: '기본적인 동의는 얻었으나, 모든 가족 구성원의 완전한 이해와 참여가 필요합니다.',
        high: '모든 가족 구성원이 반려동물 입양에 적극적으로 동의하고 준비되어 있습니다.'
      },
      '경험/지식': {
        low: '반려동물 관련 지식과 경험이 부족합니다. 입양 전 충분한 학습과 준비가 필요합니다.',
        medium: '기본적인 지식은 있으나, 더 체계적인 학습과 훈련 계획이 필요합니다.',
        high: '반려동물을 돌보고 훈련시킬 수 있는 훌륭한 지식과 경험을 갖추고 있습니다.'
      },
      '장기적 책임': {
        low: '장기적인 책임에 대한 고려가 부족합니다. 10-15년간의 변화를 고려한 계획이 필요합니다.',
        medium: '기본적인 장기 계획은 있으나, 예상되는 변화에 대한 더 구체적인 준비가 필요합니다.',
        high: '반려동물의 평생을 책임질 수 있는 훌륭한 장기적 계획과 의지를 갖추고 있습니다.'
      }
    };

    let status, feedback;
    if (percentage < 40) {
      status = '개선 필요';
      feedback = feedbackMap[sectionTitle]?.low || '이 영역에서 더 많은 준비가 필요합니다.';
    } else if (percentage < 70) {
      status = '보완 필요';
      feedback = feedbackMap[sectionTitle]?.medium || '이 영역에서 추가적인 보완이 필요합니다.';
    } else {
      status = '훌륭함';
      feedback = feedbackMap[sectionTitle]?.high || '이 영역에서 훌륭한 준비가 되어있습니다.';
    }

    return { status, feedback };
  };

  // answers -> 계산된 결과(총점, 퍼센트, 권고문, 섹션별 요약) 반환
  const calculateResults = () => {
    const summary = [];
    let totalScore = 0;
    let maxPossibleScore = 0;

    sections.forEach((section, sectionIndex) => {
      let sectionScore = 0;
      let sectionMaxScore = 0;
      const sectionSummary = {
        id: section.id,
        title: section.title,
        items: []
      };

      section.questions.forEach((question, questionIndex) => {
        const key = `${sectionIndex}-${questionIndex}`;
        const selected = answers[key] ?? '응답 없음';
        const score = answers[key] ? mapOptionToScore(question.id, selected) : 0;
        const questionMax = 3;

        sectionScore += score;
        sectionMaxScore += questionMax;
        totalScore += score;
        maxPossibleScore += questionMax;

        sectionSummary.items.push({
          question: question.question,
          answer: selected,
          score
        });
      });

      // 섹션별 피드백 생성
      const sectionFeedback = getSectionFeedback(sectionScore, sectionMaxScore, section.title);
      sectionSummary.sectionScore = sectionScore;
      sectionSummary.sectionMaxScore = sectionMaxScore;
      sectionSummary.sectionFeedback = sectionFeedback;

      summary.push(sectionSummary);
    });

    const percent = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

    // 권고문: 간단한 규칙 (사용자 기준에 따라 수정 가능)
    let recommendation = '';
    if (percent >= 80) recommendation = '입양 준비가 잘 되어 있는 편입니다.';
    else if (percent >= 50) recommendation = '입양은 가능하나 준비가 더 필요합니다.';
    else recommendation = '입양 전 환경/준비를 더 점검하세요.';

    return {
      summary,
      totalScore,
      maxPossibleScore,
      percent,
      recommendation
    };
  };

  // 원형 차트 컴포넌트
  const CircularProgress = ({ percentage }) => {
    const radius = 50;
    const strokeWidth = 6;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${percentage / 100 * circumference} ${circumference}`;

    return (
      <div className="circular-progress">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="circular-progress-svg"
        >
          <circle
            stroke="#e6e6e6"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#ea580c"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            style={{ strokeDashoffset: 0 }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="progress-circle"
          />
        </svg>
        <div className="progress-text">
          <span className="progress-percentage">{percentage}</span>
          <span className="progress-label">점</span>
        </div>
      </div>
    );
  };

  // 결과 화면
  if (showResult) {
    const results = calculateResults();

    return (
      <div className="survey-container">
        <div className="survey-card">
          <div className="result-section">
            <CircularProgress percentage={results.percent} />
            <h2 className="result-title">당신의 적합점수는 {results.percent}점 입니다</h2>
            <p className="result-description">
              {results.recommendation}
            </p>

            <h3 className="feedback-title"><img src="../../public/img/peedback.png" alt="" />맞춤 피드백</h3>

            <div className="answer-summary">
              {results.summary.map((section) => (
                <div key={section.id} className="section-summary">
                  <div className="section-header">
                    <h4 className="section-summary-title">{section.id}. {section.title}</h4>
                    <div className="section-feedback">
                      <span className={`feedback-status ${section.sectionFeedback.status === '훌륭함' ? 'excellent' : section.sectionFeedback.status === '보완 필요' ? 'good' : 'needs-improvement'}`}>
                        {section.sectionFeedback.status}
                      </span>
                      <p className="feedback-description">{section.sectionFeedback.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <button onClick={handleConfirm} className="restart-button">확인</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 설문 진행 화면
  const currentSectionData = sections[currentSection];
  const isSectionComplete = isCurrentSectionComplete();

  return (
    <>
      <div className="survey-container">
        <div className="survey-card">
          <div className="header-section">
            <h1 className="main-title">입양 적합성 설문조사</h1>
            <p className="main-description">
              입양 전, 나의 생활환경과 준비 상태를 확인해 보세요.
            </p>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="question-section">
            <h2 className="section-title survey">{currentSectionData.id}. {currentSectionData.title}</h2>
            <div className="questions-grid">
              {currentSectionData.questions.map((question, questionIndex) => (
                <div key={question.id} className="question-container">
                  <div className="question-number-small">
                    <span className="number-small">{getCurrentQuestionNumber() + questionIndex}</span>
                  </div>
                  <h3 className="question-text">{question.question}</h3>
                  <div className="options-container">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="option-label">
                        <input
                          type="radio"
                          name={`survey-option-${currentSection}-${questionIndex}`}
                          value={option}
                          checked={answers[`${currentSection}-${questionIndex}`] === option}
                          onChange={() => handleMultiOptionSelect(questionIndex, option)}
                          className="option-input"
                        />
                        <div className={`option-card ${answers[`${currentSection}-${questionIndex}`] === option ? 'selected' : ''}`}>
                          <span className="option-text">{option}</span>
                          <div className={`radio-button ${answers[`${currentSection}-${questionIndex}`] === option ? 'checked' : ''}`}>
                            {answers[`${currentSection}-${questionIndex}`] === option && <div className="radio-dot"></div>}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="footer-section">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className={`prev-button ${currentSection > 0 ? 'enabled' : 'disabled'}`}
            >
              이전
            </button>
            <button
              onClick={handleNext}
              disabled={!isSectionComplete}
              className={`next-button ${isSectionComplete ? 'enabled' : 'disabled'}`}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Survey;
