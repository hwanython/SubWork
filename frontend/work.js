
// 전사 감수 작업 페이지용 스크립트

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
  loadProjectData(projectId);
  
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
  
  // 저장 버튼 이벤트
  document.getElementById('saveBtn').addEventListener('click', function() {
    saveProjectData();
  });
  
  // 자동 저장 타이머 설정 (10초 간격)
  setInterval(function() {
    saveProjectData();
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
    completeProject(projectId);
  });
  
  // 맞춤법 검사 (입력 시 실시간 검사)
  const editableArea = document.getElementById('editableTranscription');
  
  editableArea.addEventListener('input', function() {
    // TODO: API 연결 예정
    // 간단한 예시 맞춤법 오류 검사 (실제로는 맞춤법 검사 API 사용)
    const text = this.innerText;
    const errorWords = ['같애요', '됬어요', '햇어요', '맞는대요', '있을껄요']; // 예시 오류 단어
    
    // 오류 스타일링 제거
    this.innerHTML = text;
    
    // 오류 단어에 스타일 적용
    errorWords.forEach(word => {
      if (text.includes(word)) {
        const regex = new RegExp(word, 'g');
        this.innerHTML = this.innerHTML.replace(regex, `<span class="error-highlight">${word}</span>`);
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

// 프로젝트 데이터 로드 함수
function loadProjectData(projectId) {
  // TODO: API 연결 예정
  // 모의 프로젝트 데이터 (실제로는 서버에서 데이터를 가져와야 함)
  const mockProject = {
    id: projectId,
    title: '인터뷰 전사 프로젝트',
    status: 'incomplete',
    audioUrl: 'https://example.com/audio/sample.mp3', // 실제 오디오 파일 경로로 대체 필요
    transcription: '안녕하세요. 오늘은 인공지능과 자연어 처리에 대해 이야기해 보겠습니다. 자연어 처리는 컴퓨터가 사람의 언어를 이해하고 생성할 수 있도록 하는 기술입니다. 최근에는 딥러닝의 발전으로 많은 발전이 있었습니다. 특히 트랜스포머 모델의 등장으로 번역, 요약, 질의응답 등 다양한 태스크에서 좋은 성능을 보이고 있습니다. 감사합니다.'
  };
  
  // 프로젝트 정보 표시
  document.getElementById('projectTitle').textContent = mockProject.title;
  document.getElementById('projectStatus').textContent = '진행 중';
  
  // 오디오 플레이어 설정
  // 참고: 실제 구현에서는 서버에서 오디오 파일 URL을 가져와야 함
  // document.getElementById('audioSource').src = mockProject.audioUrl;
  // document.getElementById('audioPlayer').load();
  
  // 전사 결과 표시
  document.getElementById('originalTranscription').textContent = mockProject.transcription;
  
  // 편집 영역에 초기 내용 설정
  const editableTranscription = document.getElementById('editableTranscription');
  
  // 로컬 스토리지에서 저장된 편집 내용 확인
  const savedContent = localStorage.getItem(`project_${projectId}_transcription`);
  if (savedContent) {
    editableTranscription.innerHTML = savedContent;
  } else {
    editableTranscription.textContent = mockProject.transcription;
  }
}

// 프로젝트 저장 함수
function saveProjectData() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  
  const editableContent = document.getElementById('editableTranscription').innerHTML;
  
  // 로컬 스토리지에 저장 (실제로는 서버에 저장해야 함)
  localStorage.setItem(`project_${projectId}_transcription`, editableContent);
  
  // TODO: API 연결 예정
  console.log('프로젝트가 저장되었습니다.');
}

// 프로젝트 완료 처리 함수
function completeProject(projectId) {
  const tags = document.getElementById('tagInput').value;
  
  // TODO: API 연결 예정
  // 실제로는 서버에 상태 변경 요청 및 번역 API 호출 요청을 보내야 함
  console.log('프로젝트 완료 처리:', projectId, '태그:', tags);
  
  alert('작업이 완료되었습니다. 번역 작업이 시작됩니다.');
  
  // 번역 페이지로 이동
  window.location.href = `translation.html?id=${projectId}`;
}
