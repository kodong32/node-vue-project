<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAdminAuthStore } from "@/stores/counter";

const router = useRouter();
const adminAuthStore = useAdminAuthStore();

const form = reactive({
  loginId: "",
  password: "",
});

const goAdminLogin = async () => {
  const success = await adminAuthStore.login(form.loginId, form.password);

  if (success) {
    alert("로그인 성공");
    router.push("/admin/surveyinsert");
  } else {
    alert("아이디 또는 비밀번호가 올바르지 않습니다.");
  }
};
</script>

<template>
  <div class="admin-login-page">
    <div class="login-card">
      <div class="login-left">
        <div class="brand">발달장애인 지원 프로그램</div>
        <h1>시스템 관리자 로그인</h1>
        <p class="desc">
          관리자 계정으로 로그인 후 시스템 관리자 페이지에 접근할 수 있습니다.
        </p>

        <form class="login-form" @submit.prevent="goAdminLogin">
          <div class="form-group">
            <label for="loginId">아이디</label>
            <input
              id="loginId"
              v-model="form.loginId"
              type="text"
              placeholder="관리자 아이디를 입력하세요"
            />
          </div>

          <div class="form-group">
            <label for="password">비밀번호</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button type="submit" class="login-btn">로그인</button>
        </form>

        <p class="bottom-text">시스템 관리자 전용 페이지입니다.</p>
      </div>

      <div class="login-right">
        <div class="overlay"></div>
        <div class="right-content">
          <h2>Admin Access</h2>
          <p>권한이 확인된 사용자만 접근할 수 있습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f7f6;
  padding: 24px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 1100px;
  min-height: 650px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.12);
}

.login-left {
  padding: 72px 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand {
  display: inline-block;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 700;
  color: #19b394;
  letter-spacing: 0.04em;
}

.login-left h1 {
  margin: 0 0 16px;
  font-size: 38px;
  line-height: 1.2;
  color: #1f2a37;
  font-weight: 800;
}

.desc {
  margin: 0 0 36px;
  font-size: 16px;
  line-height: 1.6;
  color: #6b7280;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 15px;
  color: #111827;
  box-sizing: border-box;
  outline: none;
  transition: 0.2s;
}

.form-group input:focus {
  border-color: #19b394;
  box-shadow: 0 0 0 4px rgba(25, 179, 148, 0.12);
}

.login-btn {
  width: 100%;
  height: 54px;
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  background: #19b394;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.login-btn:hover {
  background: #14997e;
}

.bottom-text {
  margin-top: 28px;
  font-size: 13px;
  color: #9ca3af;
}

.login-right {
  position: relative;
  background-image: url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80");
  background-size: cover;
  background-position: center;
  min-height: 650px;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(25, 179, 148, 0.72), rgba(19, 102, 88, 0.78));
}

.right-content {
  position: absolute;
  left: 48px;
  right: 48px;
  bottom: 56px;
  z-index: 2;
  color: #ffffff;
}

.right-content h2 {
  margin: 0 0 12px;
  font-size: 34px;
  font-weight: 800;
}

.right-content p {
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
}

@media (max-width: 991px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .login-right {
    display: none;
  }

  .login-left {
    padding: 48px 28px;
  }

  .login-left h1 {
    font-size: 30px;
  }
}
</style>
