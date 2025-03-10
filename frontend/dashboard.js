
// 대시보드 페이지용 스크립트

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
  
  // 검토자/관리자인 경우 검토 대기 프로젝트 영역 표시
  if (userRole === 'editor' || userRole === 'admin') {
    document.getElementById('reviewingProjectsContainer').style.display = 'block';
  }
  
  // 로그아웃 버튼 이벤트
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
  });
  
  // 새 프로젝트 모달
  const newProjectBtn = document.getElementById('newProjectBtn');
  const newProjectModal = document.getElementById('newProjectModal');
  const closeModalBtn = newProjectModal.querySelector('.close');
  
  newProjectBtn.addEventListener('click', function() {
    newProjectModal.style.display = 'block';
  });
  
  closeModalBtn.addEventListener('click', function() {
    newProjectModal.style.display = 'none';
  });
  
  window.addEventListener('click', function(e) {
    if (e.target === newProjectModal) {
      newProjectModal.style.display = 'none';
    }
  });
  
  // 새 프로젝트 생성 폼 제출
  document.getElementById('newProjectForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const projectName = document.getElementById('projectName').value;
    const audioFile = document.getElementById('audioFile').files[0];
    
    if (projectName && audioFile) {
      // TODO: API 연결 예정
      // 모의 프로젝트 생성 (실제로는 서버에 업로드 및 STT 처리 요청)
      alert('프로젝트가 생성되었습니다. STT 처리가 시작됩니다.');
      newProjectModal.style.display = 'none';
      
      // 페이지 새로고침하여 프로젝트 목록 업데이트
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      alert('프로젝트 이름과 음성 파일을 모두 입력해주세요.');
    }
  });
  
  // 대시보드 통계 및 프로젝트 목록 로드
  loadDashboardData();
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

// 프로젝트 상태 이름 변환 함수
function getStatusDisplayName(status) {
  switch(status) {
    case 'incomplete': return '진행 중';
    case 'reviewing': return '검토 중';
    case 'complete': return '완료';
    default: return '진행 중';
  }
}

// 대시보드 데이터 로드 함수
function loadDashboardData() {
  // TODO: API 연결 예정
  // 모의 데이터 (실제로는 서버에서 데이터를 가져와야 함)
  const mockStats = {
    incomplete: 5,
    reviewing: 3,
    complete: 12
  };
  
  const mockProjects = [
    { id: 1, name: '인터뷰 전사 1', creator: '김감수', status: 'incomplete', file: 'interview1.mp3', lastUpdated: '2023-04-15 14:30' },
    { id: 2, name: '강연 전사 1', creator: '이감수', status: 'incomplete', file: 'lecture1.mp3', lastUpdated: '2023-04-14 10:15' },
    { id: 3, name: '인터뷰 전사 2', creator: '김감수', status: 'reviewing', file: 'interview2.mp3', lastUpdated: '2023-04-13 16:45' },
    { id: 4, name: '강연 전사 2', creator: '박감수', status: 'reviewing', file: 'lecture2.mp3', lastUpdated: '2023-04-12 09:30' },
    { id: 5, name: '인터뷰 전사 3', creator: '최감수', status: 'complete', file: 'interview3.mp3', lastUpdated: '2023-04-11 11:20' }
  ];
  
  // 통계 데이터 표시
  document.getElementById('incompleteCount').textContent = mockStats.incomplete;
  document.getElementById('reviewingCount').textContent = mockStats.reviewing;
  document.getElementById('completeCount').textContent = mockStats.complete;
  
  // 내 프로젝트 목록 표시
  const projectList = document.getElementById('projectList');
  projectList.innerHTML = '';
  
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  
  // 사용자 역할에 따라 프로젝트 필터링
  let filteredProjects = mockProjects;
  if (userRole === 'reviewer') {
    // 일반 감수자는 자신의 프로젝트만 볼 수 있음
    filteredProjects = mockProjects.filter(project => project.creator === userName);
  }
  
  filteredProjects.forEach((project, index) => {
    const row = document.createElement('tr');
    
    const statusClass = project.status === 'incomplete' ? 'status-incomplete' : 
                        project.status === 'reviewing' ? 'status-reviewing' : 'status-complete';
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${project.creator}</td>
      <td>${project.file}</td>
      <td><span class="${statusClass}">${getStatusDisplayName(project.status)}</span></td>
      <td>${project.lastUpdated}</td>
      <td>
        <button class="btn btn-view" data-id="${project.id}">보기</button>
        <button class="btn btn-work" data-id="${project.id}">작업</button>
      </td>
    `;
    
    projectList.appendChild(row);
  });
  
  // 검토 대기 프로젝트 목록 표시 (검토자와 관리자에게만 표시)
  if (userRole === 'editor' || userRole === 'admin') {
    const reviewingProjectList = document.getElementById('reviewingProjectList');
    reviewingProjectList.innerHTML = '';
    
    const reviewingProjects = mockProjects.filter(project => project.status === 'reviewing');
    
    reviewingProjects.forEach((project, index) => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${project.creator}</td>
        <td>${project.file}</td>
        <td>${project.lastUpdated}</td>
        <td>
          <button class="btn btn-review" data-id="${project.id}">검토</button>
        </td>
      `;
      
      reviewingProjectList.appendChild(row);
    });
  }
  
  // 작업 버튼 이벤트 설정
  document.querySelectorAll('.btn-work').forEach(button => {
    button.addEventListener('click', function() {
      const projectId = this.getAttribute('data-id');
      window.location.href = `work.html?id=${projectId}`;
    });
  });
  
  // 검토 버튼 이벤트 설정
  document.querySelectorAll('.btn-review').forEach(button => {
    button.addEventListener('click', function() {
      const projectId = this.getAttribute('data-id');
      window.location.href = `review.html?id=${projectId}`;
    });
  });
  
  // 보기 버튼 이벤트 설정
  document.querySelectorAll('.btn-view').forEach(button => {
    button.addEventListener('click', function() {
      const projectId = this.getAttribute('data-id');
      const project = mockProjects.find(p => p.id == projectId);
      
      if (project.status === 'complete') {
        // 완료된 프로젝트는 읽기 전용으로 보기
        alert('완료된 프로젝트입니다.');
      } else if (project.status === 'reviewing') {
        // 검토 중인 프로젝트는 검토 페이지로 이동
        window.location.href = `review.html?id=${projectId}`;
      } else {
        // 진행 중인 프로젝트는 작업 페이지로 이동
        window.location.href = `work.html?id=${projectId}`;
      }
    });
  });
}

// 검색 기능 (추가 구현)
document.getElementById('searchBtn').addEventListener('click', function() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#projectList tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});
