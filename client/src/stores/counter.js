import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

//기관용 이용자 정보 저장(김경환 2026.03.25 ~ 진행 중)
export const useInstiAuthStore = defineStore("instiAuth", {
  state: () => ({
    user: null, // 로그인한 유저 정보 저장
    roll: null,
    isLoggedIn: false, // 로그인 여부
  }),
  actions: {
    async login(id, password) {
      try {
        // 백엔드 주소로 POST 요청 보냄
        const response = await axios.post("/api/user/ilogin", {
          id: id,
          password: password,
        });

        // 백엔드가 준 결과(result) 확인
        if (response.data.success) {
          this.user = response.data.user; // 유저 정보 저장
          this.roll = response.data.roll;
          this.isLoggedIn = true; // 로그인 상태 true
          return true; // 컴포넌트에 성공 알림
        } else {
          return false; // 아이디/비밀번호 불일치
        }
      } catch (error) {
        console.error("로그인 요청 중 오류 발생:", error);
        return false;
      }
    },
    async logout() {
      try {
        await axios.post("api/user/ilogout");
      } catch (error) {
        console.error("로그아웃 요청 중 오류 발생:", error);
      } finally {
        this.user = null;
        this.isLoggedIn = false;
      }
    },
  },
});
//로그인 이용자 정보 저장(김경환 2026.03.25)
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // 로그인한 유저 정보 저장
    isLoggedIn: false, // 로그인 여부
  }),
  actions: {
    async login(id, password) {
      try {
        // 백엔드 주소로 POST 요청 보냄
        const response = await axios.post("/api/user/login", {
          id: id,
          password: password,
        });

        // 백엔드가 준 결과(result) 확인
        if (response.data.success) {
          this.user = response.data.user; // 유저 정보 저장
          this.isLoggedIn = true; // 로그인 상태 true
          return true; // 컴포넌트에 성공 알림
        } else {
          return false; // 아이디/비밀번호 불일치
        }
      } catch (error) {
        console.error("로그인 요청 중 오류 발생:", error);
        return false;
      }
    },
    logout() {
      this.user = null;
      this.isLoggedIn = false;
    },
  },
});

//sysadmin pinia
export const useAdminAuthStore = defineStore("adminAuth", {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),
  actions: {
    async login(id, password) {
      try {
        const response = await axios.post("/api/admin/login", {
          id: id,
          password: password,
        });

        if (response.data.status === "Success") {
          this.user = response.data.user;
          this.isLoggedIn = true;
          return true;
        } else {
          this.user = null;
          this.isLoggedIn = false;
          return false;
        }
      } catch (error) {
        console.error("관리자 로그인 요청 중 오류 발생:", error);
        this.user = null;
        this.isLoggedIn = false;
        return false;
      }
    },
    //back단 session은 살아있을 수 있기에 check로직 추가
    async checkLogin() {
      try {
        const response = await axios.get("/api/admin/me");

        if (response.data.status === "Success") {
          this.user = response.data.user;
          this.isLoggedIn = true;
          return true;
        } else {
          this.user = null;
          this.isLoggedIn = false;
          return false;
        }
      } catch (error) {
        console.error("관리자 로그인 확인 중 오류 발생:", error);
        this.user = null;
        this.isLoggedIn = false;
        return false;
      }
    },

    async logout() {
      try {
        await axios.post("/api/admin/logout");
      } catch (error) {
        console.error("관리자 로그아웃 요청 중 오류 발생:", error);
      } finally {
        this.user = null;
        this.isLoggedIn = false;
      }
    },
  },
});
