
// 검토 페이지용 스크립트

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
  loadReviewData(projectId);
  
  // 오디오 플레이어 컨트롤
  const audioPlayer = document.getElementById('audioPlayer');
  
  document.getElementById('playBackward').addEventListener('click', function() {
    audioPlayer.currentTime -= 5;
  });
  
  document.getElementById('playForward').addEventListener('click', function() {
    audioPlayer.currentTime += 5;
  });
  
  document.getElementById('slowDown').addEventListener('click', function() {
    audioPlayer.playbackRate = 0.8;
  });
  
  document.getElementById('speedUp').addEventListener('click', function() {
    audioPlayer.playbackRate = 1.2;
  });
  
  // 탭 전환 이벤트
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      // 모든 탭 버튼에서 active 클래스 제거
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // 모든 탭 콘텐츠에서 active 클래스 제거
      tabContents.forEach(content => content.classList.remove('active'));
      
      // 선택한 탭 버튼과 콘텐츠에 active 클래스 추가
      this.classList.add('active');
      document.getElementById(`${tabName}Tab`).classList.add('active');
    });
  });
  
  // 저장 버튼 이벤트
  document.getElementById('saveBtn').addEventListener('click', function() {
    saveReviewData();
  });
  
  // 자동 저장 타이머 설정 (10초 간격)
  setInterval(function() {
    saveReviewData();
  }, 10000);
  
  // 최종 승인 버튼 이벤트
  document.getElementById('approveBtn').addEventListener('click', function() {
    // 승인 모달 표시
    document.getElementById('approveModal').style.display = 'block';
  });
  
  // 모달 닫기 버튼
  document.querySelector('#approveModal .close').addEventListener('click', function() {
    document.getElementById('approveModal').style.display = 'none';
  });
  
  // 모달 취소 버튼
  document.getElementById('cancelApprove').addEventListener('click', function() {
    document.getElementById('approveModal').style.display = 'none';
  });
  
  // 모달 확인 버튼 (최종 승인 처리)
  document.getElementById('confirmApprove').addEventListener('click', function() {
    approveProject(projectId);
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

// 검토 데이터 로드 함수
function loadReviewData(projectId) {
  // TODO: API 연결 예정
  // 모의 프로젝트 데이터 (실제로는 서버에서 데이터를 가져와야 함)
  const mockProject = {
    id: projectId,
    title: '인터뷰 전사 프로젝트',
    status: 'reviewing',
    audioUrl: 'https://example.com/audio/sample.mp3', // 실제 오디오 파일 경로로 대체 필요
    transcription: '안녕하세요. 오늘은 인공지능과 자연어 처리에 대해 이야기해 보겠습니다. 자연어 처리는 컴퓨터가 사람의 언어를 이해하고 생성할 수 있도록 하는 기술입니다. 최근에는 딥러닝의 발전으로 많은 발전이 있었습니다. 특히 트랜스포머 모델의 등장으로 번역, 요약, 질의응답 등 다양한 태스크에서 좋은 성능을 보이고 있습니다. 감사합니다.',
    translation: 'Hello. Today we will talk about artificial intelligence and natural language processing. Natural language processing is a technology that enables computers to understand and generate human language. Recently, there have been many developments with the advancement of deep learning. In particular, with the emergence of transformer models, good performance is being shown in various tasks such as translation, summarization, and question answering. Thank you.'
  };
  
  // 프로젝트 정보 표시
  document.getElementById('projectTitle').textContent = mockProject.title;
  document.getElementById('projectStatus').textContent = '검토 중';
  
  // 오디오 플레이어 설정
  // 참고: 실제 구현에서는 서버에서 오디오 파일 URL을 가져와야 함
  // document.getElementById('audioSource').src = mockProject.audioUrl;
  // document.getElementById('audioPlayer').load();
  
  // 감수된 전사 및 번역 결과 표시
  const reviewedTranscription = document.getElementById('reviewedTranscription');
  const reviewedTranslation = document.getElementById('reviewedTranslation');
  
  // 로컬 스토리지에서 저장된 검토 내용 확인
  const savedTranscription = localStorage.getItem(`review_${projectId}_transcription`);
  const savedTranslation = localStorage.getItem(`review_${projectId}_translation`);
  
  if (savedTranscription) {
    reviewedTranscription.innerHTML = savedTranscription;
  } else {
    reviewedTranscription.textContent = mockProject.transcription;
  }
  
  if (savedTranslation) {
    reviewedTranslation.innerHTML = savedTranslation;
  } else {
    reviewedTranslation.textContent = mockProject.translation;
  }
}

// 검토 내용 저장 함수
function saveReviewData() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  
  const transcriptionContent = document.getElementById('reviewedTranscription').innerHTML;
  const translationContent = document.getElementById('reviewedTranslation').innerHTML;
  
  // 로컬 스토리지에 저장 (실제로는 서버에 저장해야 함)
  localStorage.setItem(`review_${projectId}_transcription`, transcriptionContent);
  localStorage.setItem(`review_${projectId}_translation`, translationContent);
  
  // TODO: API 연결 예정
  console.log('검토 내용이 저장되었습니다.');
}

// 프로젝트 최종 승인 함수
function approveProject(projectId) {
  // TODO: API 연결 예정
  // 실제로는 서버에 상태 변경 요청을 보내야 함
  console.log('프로젝트 최종 승인:', projectId);
  
  alert('프로젝트가 최종 승인되었습니다. 상태가 Complete로 변경되었습니다.');
  
  // 대시보드로 이동
  window.location.href = 'dashboard.html';
}
