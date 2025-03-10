
// 관리자 페이지용 스크립트

document.addEventListener('DOMContentLoaded', function() {
  // 로그인 상태 및 관리자 권한 확인
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userRole = localStorage.getItem('userRole');
  
  if (isLoggedIn !== 'true' || userRole !== 'admin') {
    // 로그인되지 않았거나 관리자가 아닌 경우 대시보드로 리다이렉션
    window.location.href = 'dashboard.html';
    return;
  }
  
  // 사용자 정보 표시
  const userName = localStorage.getItem('userName') || '관리자';
  document.getElementById('userName').textContent = userName;
  document.getElementById('userRole').textContent = '관리자';
  
  // 로그아웃 버튼 이벤트
  document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
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
  
  // 관리자 대시보드 데이터 로드
  loadAdminData();
  
  // 사용자 추가 모달
  const addUserBtn = document.getElementById('addUserBtn');
  const addUserModal = document.getElementById('addUserModal');
  const closeModalBtn = addUserModal.querySelector('.close');
  
  addUserBtn.addEventListener('click', function() {
    addUserModal.style.display = 'block';
  });
  
  closeModalBtn.addEventListener('click', function() {
    addUserModal.style.display = 'none';
  });
  
  window.addEventListener('click', function(e) {
    if (e.target === addUserModal) {
      addUserModal.style.display = 'none';
    }
  });
  
  // 사용자 추가 폼 제출
  document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    
    if (username && password) {
      // TODO: API 연결 예정
      // 모의 사용자 추가 (실제로는 서버에 사용자 생성 요청)
      alert('사용자가 추가되었습니다.');
      addUserModal.style.display = 'none';
      
      // 페이지 새로고침하여 사용자 목록 업데이트
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      alert('사용자명과 비밀번호를 모두 입력해주세요.');
    }
  });
  
  // 프로젝트 검색 이벤트
  document.getElementById('projectSearchBtn').addEventListener('click', function() {
    filterProjects();
  });
  
  // 사용자 검색 이벤트
  document.getElementById('userSearchBtn').addEventListener('click', function() {
    filterUsers();
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

// 상태 이름 변환 함수
function getStatusDisplayName(status) {
  switch(status) {
    case 'incomplete': return '진행 중';
    case 'reviewing': return '검토 중';
    case 'complete': return '완료';
    default: return '진행 중';
  }
}

// 관리자 데이터 로드 함수
function loadAdminData() {
  // TODO: API 연결 예정
  // 모의 데이터 (실제로는 서버에서 데이터를 가져와야 함)
  const mockProjects = [
    { id: 1, name: '인터뷰 전사 1', creator: '김감수', status: 'incomplete', createdAt: '2023-04-10', updatedAt: '2023-04-15 14:30' },
    { id: 2, name: '강연 전사 1', creator: '이감수', status: 'incomplete', createdAt: '2023-04-09', updatedAt: '2023-04-14 10:15' },
    { id: 3, name: '인터뷰 전사 2', creator: '김감수', status: 'reviewing', createdAt: '2023-04-08', updatedAt: '2023-04-13 16:45' },
    { id: 4, name: '강연 전사 2', creator: '박감수', status: 'reviewing', createdAt: '2023-04-07', updatedAt: '2023-04-12 09:30' },
    { id: 5, name: '인터뷰 전사 3', creator: '최감수', status: 'complete', createdAt: '2023-04-06', updatedAt: '2023-04-11 11:20' },
    { id: 6, name: '강연 전사 3', creator: '정감수', status: 'complete', createdAt: '2023-04-05', updatedAt: '2023-04-10 15:45' },
    { id: 7, name: '인터뷰 전사 4', creator: '한감수', status: 'complete', createdAt: '2023-04-04', updatedAt: '2023-04-09 13:10' }
  ];
  
  const mockUsers = [
    { id: 1, username: '김감수', role: 'reviewer', createdAt: '2023-04-01', lastLoginAt: '2023-04-15 09:30', projectCount: 2 },
    { id: 2, username: '이감수', role: 'reviewer', createdAt: '2023-04-01', lastLoginAt: '2023-04-14 11:45', projectCount: 1 },
    { id: 3, username: '박감수', role: 'reviewer', createdAt: '2023-04-02', lastLoginAt: '2023-04-13 14:20', projectCount: 1 },
    { id: 4, username: '최감수', role: 'editor', createdAt: '2023-04-02', lastLoginAt: '2023-04-12 10:15', projectCount: 1 },
    { id: 5, username: '정감수', role: 'editor', createdAt: '2023-04-03', lastLoginAt: '2023-04-11 16:30', projectCount: 1 },
    { id: 6, username: '한감수', role: 'reviewer', createdAt: '2023-04-03', lastLoginAt: '2023-04-10 13:45', projectCount: 1 },
    { id: 7, username: '관리자', role: 'admin', createdAt: '2023-04-01', lastLoginAt: '2023-04-15 10:00', projectCount: 0 }
  ];
  
  const mockStats = {
    totalProjects: mockProjects.length,
    totalUsers: mockUsers.length,
    completedProjects: mockProjects.filter(p => p.status === 'complete').length,
    activeUsers: 5
  };
  
  // 통계 데이터 표시
  document.getElementById('totalProjects').textContent = mockStats.totalProjects;
  document.getElementById('totalUsers').textContent = mockStats.totalUsers;
  document.getElementById('completedProjects').textContent = mockStats.completedProjects;
  document.getElementById('activeUsers').textContent = mockStats.activeUsers;
  
  // 프로젝트 목록 표시
  const projectList = document.getElementById('adminProjectList');
  projectList.innerHTML = '';
  
  mockProjects.forEach((project, index) => {
    const row = document.createElement('tr');
    
    const statusClass = project.status === 'incomplete' ? 'status-incomplete' : 
                        project.status === 'reviewing' ? 'status-reviewing' : 'status-complete';
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${project.name}</td>
      <td>${project.creator}</td>
      <td><span class="${statusClass}">${getStatusDisplayName(project.status)}</span></td>
      <td>${project.createdAt}</td>
      <td>${project.updatedAt}</td>
      <td>
        <button class="btn btn-view" data-id="${project.id}">보기</button>
        <button class="btn btn-delete" data-id="${project.id}">삭제</button>
      </td>
    `;
    
    projectList.appendChild(row);
  });
  
  // 사용자 목록 표시
  const userList = document.getElementById('adminUserList');
  userList.innerHTML = '';
  
  mockUsers.forEach(user => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${getRoleDisplayName(user.role)}</td>
      <td>${user.createdAt}</td>
      <td>${user.lastLoginAt}</td>
      <td>${user.projectCount}</td>
      <td>
        <button class="btn btn-edit" data-id="${user.id}">수정</button>
        <button class="btn btn-delete-user" data-id="${user.id}" ${user.role === 'admin' ? 'disabled' : ''}>삭제</button>
      </td>
    `;
    
    userList.appendChild(row);
  });
  
  // 프로젝트 보기 버튼 이벤트 설정
  document.querySelectorAll('.btn-view').forEach(button => {
    button.addEventListener('click', function() {
      const projectId = this.getAttribute('data-id');
      const project = mockProjects.find(p => p.id == projectId);
      
      if (project.status === 'complete') {
        // 완료된 프로젝트는 읽기 전용으로 보기
        window.location.href = `review.html?id=${projectId}&readonly=true`;
      } else if (project.status === 'reviewing') {
        // 검토 중인 프로젝트는 검토 페이지로 이동
        window.location.href = `review.html?id=${projectId}`;
      } else {
        // 진행 중인 프로젝트는 작업 페이지로 이동
        window.location.href = `work.html?id=${projectId}`;
      }
    });
  });
  
  // 프로젝트 삭제 버튼 이벤트 설정
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function() {
      const projectId = this.getAttribute('data-id');
      if (confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
        // TODO: API 연결 예정
        // 실제로는 서버에 삭제 요청을 보내야 함
        alert('프로젝트가 삭제되었습니다.');
        this.closest('tr').remove();
      }
    });
  });
  
  // 사용자 수정 버튼 이벤트 설정
  document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-id');
      const user = mockUsers.find(u => u.id == userId);
      
      // TODO: 사용자 수정 모달 구현
      alert(`사용자 ${user.username}의 정보를 수정합니다.`);
    });
  });
  
  // 사용자 삭제 버튼 이벤트 설정
  document.querySelectorAll('.btn-delete-user').forEach(button => {
    button.addEventListener('click', function() {
      const userId = this.getAttribute('data-id');
      if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
        // TODO: API 연결 예정
        // 실제로는 서버에 삭제 요청을 보내야 함
        alert('사용자가 삭제되었습니다.');
        this.closest('tr').remove();
      }
    });
  });
}

// 프로젝트 필터링 함수
function filterProjects() {
  const searchTerm = document.getElementById('projectSearchInput').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  
  const rows = document.querySelectorAll('#adminProjectList tr');
  
  rows.forEach(row => {
    const projectText = row.cells[1].textContent.toLowerCase(); // 프로젝트 이름
    const creatorText = row.cells[2].textContent.toLowerCase(); // 작업자 이름
    const statusText = row.cells[3].textContent.toLowerCase(); // 상태
    
    const textMatch = projectText.includes(searchTerm) || creatorText.includes(searchTerm);
    const statusMatch = statusFilter === 'all' || 
                       (statusFilter === 'incomplete' && statusText.includes('진행 중')) ||
                       (statusFilter === 'reviewing' && statusText.includes('검토 중')) ||
                       (statusFilter === 'complete' && statusText.includes('완료'));
    
    if (textMatch && statusMatch) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// 사용자 필터링 함수
function filterUsers() {
  const searchTerm = document.getElementById('userSearchInput').value.toLowerCase();
  const roleFilter = document.getElementById('roleFilter').value;
  
  const rows = document.querySelectorAll('#adminUserList tr');
  
  rows.forEach(row => {
    const usernameText = row.cells[1].textContent.toLowerCase(); // 사용자명
    const roleText = row.cells[2].textContent.toLowerCase(); // 역할
    
    const textMatch = usernameText.includes(searchTerm);
    const roleMatch = roleFilter === 'all' || 
                     (roleFilter === 'reviewer' && roleText.includes('일반 감수자')) ||
                     (roleFilter === 'editor' && roleText.includes('검토자')) ||
                     (roleFilter === 'admin' && roleText.includes('관리자'));
    
    if (textMatch && roleMatch) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}
