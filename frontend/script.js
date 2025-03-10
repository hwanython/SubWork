
// 로그인 및 회원가입 페이지용 스크립트

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignupLink = document.getElementById('showSignup');
  const showLoginLink = document.getElementById('showLogin');
  const loginFormContainer = document.querySelector('.login-form');
  const signupFormContainer = document.querySelector('.signup-form');
  
  // 로컬 스토리지에서 로그인 상태 확인
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    // 이미 로그인되어 있으면 대시보드로 리다이렉션
    window.location.href = 'dashboard.html';
  }
  
  // 회원가입 폼 보이기
  if (showSignupLink) {
    showSignupLink.addEventListener('click', function(e) {
      e.preventDefault();
      loginFormContainer.style.display = 'none';
      signupFormContainer.style.display = 'block';
    });
  }
  
  // 로그인 폼 보이기
  if (showLoginLink) {
    showLoginLink.addEventListener('click', function(e) {
      e.preventDefault();
      signupFormContainer.style.display = 'none';
      loginFormContainer.style.display = 'block';
    });
  }
  
  // 로그인 폼 제출
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // TODO: API 연결 예정
      // 임시 로그인 처리 (실제로는 서버에 인증 요청을 보내야 함)
      if (username && password) {
        // 모의 사용자 데이터 (실제 구현에서는 서버 응답으로 대체)
        const mockUsers = [
          { username: 'reviewer', role: 'reviewer', name: '감수자' },
          { username: 'editor', role: 'editor', name: '검토자' },
          { username: 'admin', role: 'admin', name: '관리자' }
        ];
        
        const user = mockUsers.find(u => u.username === username);
        
        if (user) {
          // 로그인 성공 시 사용자 정보를 로컬 스토리지에 저장
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userRole', user.role);
          
          // 대시보드로 이동
          window.location.href = 'dashboard.html';
        } else {
          alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
      } else {
        alert('아이디와 비밀번호를 입력해주세요.');
      }
    });
  }
  
  // 회원가입 폼 제출
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('newUsername').value;
      const password = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const role = document.getElementById('role').value;
      
      if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      
      // TODO: API 연결 예정
      // 임시 회원가입 처리 (실제로는 서버에 계정 생성 요청을 보내야 함)
      alert('회원가입이 성공적으로 완료되었습니다. 로그인해주세요.');
      
      // 로그인 폼으로 전환
      signupFormContainer.style.display = 'none';
      loginFormContainer.style.display = 'block';
      
      // 입력 필드 초기화
      document.getElementById('newUsername').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    });
  }
});
