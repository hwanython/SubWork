
// 번역 감수 페이지용 스크립트

document.addEventListener('DOMContentLoaded', function() {
  // 로그인 상태 확인
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉션
    window.location.href = 'index.html';
    return;
  }
  
  // 사용자 정보 표시
  const userName = localStorage.getItem('userName') || '사용자';
  const userRole = localStorage.getItem('userRole') || 'reviewer';
  
  document.getElementById('userName').textContent = userName;
  document.getElementById('userRole').textContent = getRoleDisplayName(userRole);
  
  // 관리자 메뉴 표시/숨김
  if (userRole === 'admin') {
    document.getElementById('adminMenu').style.display = 'block';
  }
  
  // 로그아웃 버튼 이벤트
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
  });
  
  // URL에서 프로젝트 ID 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  
  if (!projectId) {
    // 프로젝트 ID가 없으면 대시보드로 리다이렉션
    window.location.href = 'dashboard.html';
    return;
  }
  
  // 프로젝트 데이터 로드
  loadTranslationData(projectId);
  
  // 저장 버튼 이벤트
  document.getElementById('saveBtn').addEventListener('click', function() {
    saveTranslationData();
  });
  
  // 자동 저장 타이머 설정 (10초 간격)
  setInterval(function() {
    saveTranslationData();
  }, 10000);
  
  // 작업 완료 버튼 이벤트
  document.getElementById('completeBtn').addEventListener('click', function() {
    // 작업 완료 모달 표시
    document.getElementById('completeModal').style.display = 'block';
  });
  
  // 모달 닫기 버튼
  document.querySelector('#completeModal .close').addEventListener('click', function() {
    document.getElementById('completeModal').style.display = 'none';
  });
  
  // 모달 취소 버튼
  document.getElementById('cancelComplete').addEventListener('click', function() {
    document.getElementById('completeModal').style.display = 'none';
  });
  
  // 모달 확인 버튼 (작업 완료 처리)
  document.getElementById('confirmComplete').addEventListener('click', function() {
    completeTranslation(projectId);
  });
  
  // 맞춤법 검사 (입력 시 실시간 검사)
  const editableArea = document.getElementById('editableTranslation');
  
  editableArea.addEventListener('input', function() {
    // TODO: API 연결 예정
    // 간단한 예시 맞춤법 오류 검사 (실제로는 맞춤법 검사 API 사용)
    const text = this.innerText;
    const errorWords = ['recieve', 'seperate', 'accomodate', 'occurence', 'greatful']; // 예시 영어 오류 단어
    
    // 오류 스타일링 제거
    this.innerHTML = text;
    
    // 오류 단어에 스타일 적용
    errorWords.forEach(word => {
      if (text.toLowerCase().includes(word)) {
        const regex = new RegExp(word, 'gi');
        this.innerHTML = this.innerHTML.replace(regex, match => `<span class="error-highlight">${match}</span>`);
      }
    });
  });
});

// 권한 이름 변환 함수
function getRoleDisplayName(role) {
  switch(role) {
    case 'reviewer': return '일반 감수자';
    case 'editor': return '검토자';
    case 'admin': return '관리자';
    default: return '일반 감수자';
  }
}

// 번역 데이터 로드 함수
function loadTranslationData(projectId) {
  // TODO: API 연결 예정
  // 모의 번역 데이터 (실제로는 서버에서 데이터를 가져와야 함)
  const mockTranslation = {
    id: projectId,
    title: '인터뷰 전사 프로젝트',
    status: 'translating',
    translation: 'Hello. Today we will talk about artificial intelligence and natural language processing. Natural language processing is a technology that enables computers to understand and generate human language. Recently, there have been many developments with the advancement of deep learning. In particular, with the emergence of transformer models, good performance is being shown in various tasks such as translation, summarization, and question answering. Thank you.'
  };
  
  // 프로젝트 정보 표시
  document.getElementById('projectTitle').textContent = mockTranslation.title;
  document.getElementById('projectStatus').textContent = '번역 감수 중';
  
  // 번역 결과 표시
  document.getElementById('originalTranslation').textContent = mockTranslation.translation;
  
  // 편집 영역에 초기 내용 설정
  const editableTranslation = document.getElementById('editableTranslation');
  
  // 로컬 스토리지에서 저장된 편집 내용 확인
  const savedContent = localStorage.getItem(`project_${projectId}_translation`);
  if (savedContent) {
    editableTranslation.innerHTML = savedContent;
  } else {
    editableTranslation.textContent = mockTranslation.translation;
  }
}

// 번역 저장 함수
function saveTranslationData() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  
  const editableContent = document.getElementById('editableTranslation').innerHTML;
  
  // 로컬 스토리지에 저장 (실제로는 서버에 저장해야 함)
  localStorage.setItem(`project_${projectId}_translation`, editableContent);
  
  // TODO: API 연결 예정
  console.log('번역이 저장되었습니다.');
}

// 번역 완료 처리 함수
function completeTranslation(projectId) {
  const tags = document.getElementById('tagInput').value;
  
  // TODO: API 연결 예정
  // 실제로는 서버에 상태 변경 요청을 보내야 함
  console.log('번역 완료 처리:', projectId, '태그:', tags);
  
  alert('번역 감수 작업이 완료되었습니다. 프로젝트 상태가 검토 중으로 변경되었습니다.');
  
  // 대시보드로 이동
  window.location.href = 'dashboard.html';
}
