<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import AdminHeader from "./adminPageHeader.vue";
// Argon 컴포넌트 경로 (프로젝트 설정에 맞게 수정 필요)
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const router = useRouter();

// 🌟 1. 주소 관련 상태 변수 (팀원 코드 완벽 이식)
const zipCode = ref("");
const mainAddress = ref("");
const detailAddress = ref("");
const detailRef = ref(null);

// 🌟 2. 기관 정보 폼 데이터
const instInfo = reactive({
  name: "",
  tel: "",
  email: "", // 🚨 DB에 이메일 컬럼 추가 필요!
});

watch(
  () => instInfo.tel,
  (newValue) => {
    if (newValue) {
      // 정규식(Regex)을 사용해 숫자(0~9)가 아닌 모든 문자를 찾아 빈칸으로 날려버림
      instInfo.tel = newValue.replace(/[^0-9]/g, "");
    }
  },
);

// 🌟 3. 카카오(Daum) 우편번호 검색 API API 호출
const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: (data) => {
      zipCode.value = data.zonecode;
      mainAddress.value = data.roadAddress;
      // 상세주소 입력창으로 포커스 자동 이동
      if (detailRef.value) {
        detailRef.value.$el.querySelector("input").focus();
      }
    },
  }).open();
};

// 🌟 4. 기관 등록 함수
const registerInstitution = async () => {
  // 유효성 검사 (빈칸 방지)
  if (!instInfo.name) return alert("기관명을 입력해주세요.");
  if (!zipCode.value || !mainAddress.value)
    return alert("주소를 검색하여 입력해주세요.");
  if (!instInfo.tel) return alert("대표번호를 입력해주세요.");
  if (instInfo.tel.includes("-")) {
    return alert("대표번호는 '-' 기호 없이 숫자만 입력해주세요.");
  }

  // 백엔드로 보낼 데이터 조립
  const payload = {
    name: instInfo.name,
    zipCode: zipCode.value,
    address: `${mainAddress.value} ${detailAddress.value}`.trim(),
    tel: instInfo.tel,
    email: instInfo.email, // 🚨 DB 매퍼 업데이트 전까지는 백엔드에서 무시될 수 있음
    status: "운영", // 🌟 대기 상태 없이 바로 '운영'으로 하드코딩! (DB 코드값에 맞춰 수정하세요. 예: 'b001')
  };

  try {
    // 🚨 백엔드 라우터 주소에 맞게 수정 필요 (예: /api/admin/institution/register)
    const response = await fetch("/api/admin/institution/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      alert("기관이 성공적으로 등록되었습니다.");
      // 등록 성공 시 기관 목록 페이지로 이동
      router.push("/admin");
    } else {
      alert(result.message || "기관 등록에 실패했습니다.");
    }
  } catch (error) {
    console.error("기관 등록 에러:", error);
    alert("서버 통신 중 오류가 발생했습니다.");
  }
};
</script>

<template>
  <div class="container-fluid py-4">
    <AdminHeader />
    <div class="row mt-4 justify-content-center">
      <div class="col-lg-8 col-md-10">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-transparent border-bottom pt-4 pb-3">
            <h5 class="mb-0">기관 등록</h5>
          </div>

          <div class="card-body p-4">
            <form @submit.prevent="registerInstitution">
              <div class="row align-items-center mb-4">
                <div class="col-md-3">
                  <label class="form-control-label mb-0">기관명</label>
                </div>
                <div class="col-md-9">
                  <argon-input
                    type="text"
                    placeholder="기관명 입력"
                    v-model="instInfo.name"
                    class="mb-0"
                  />
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-md-3 pt-2">
                  <label class="form-control-label mb-0">주소</label>
                </div>
                <div class="col-md-9">
                  <div class="d-flex gap-2 mb-2">
                    <argon-input
                      type="text"
                      readonly
                      placeholder="우편번호"
                      v-model="zipCode"
                      class="mb-0 w-50"
                    />
                    <argon-button
                      color="secondary"
                      size="sm"
                      class="mb-0 px-3"
                      @click.prevent="openPostcode"
                    >
                      우편번호 검색
                    </argon-button>
                  </div>
                  <argon-input
                    type="text"
                    readonly
                    placeholder="기본주소"
                    v-model="mainAddress"
                    class="mb-2"
                  />
                  <argon-input
                    type="text"
                    placeholder="상세주소 입력"
                    v-model="detailAddress"
                    ref="detailRef"
                    class="mb-0"
                  />
                </div>
              </div>

              <div class="row align-items-center mb-4">
                <div class="col-md-3">
                  <label class="form-control-label mb-0">대표번호</label>
                </div>
                <div class="col-md-9">
                  <argon-input
                    type="tel"
                    placeholder="예: 0212345678 ('-' 없이 입력)"
                    v-model="instInfo.tel"
                    class="mb-0"
                  />
                </div>
              </div>

              <div class="row align-items-center mb-5">
                <div class="col-md-3">
                  <label class="form-control-label mb-0">이메일</label>
                </div>
                <div class="col-md-9">
                  <argon-input
                    type="email"
                    placeholder="예: example@domain.com"
                    v-model="instInfo.email"
                    class="mb-0"
                  />
                </div>
              </div>

              <div class="text-center">
                <argon-button color="warning" size="md" class="px-5">
                  등록
                </argon-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기획서에 맞춰 폼 레이아웃에 살짝 여백을 주는 용도 */
.form-control-label {
  font-weight: 700;
  color: #344767;
}
</style>
