<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-lg mb-4">
          <!-- 헤더 -->
          <div class="card-header pb-0 p-4">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0 font-weight-bolder text-info">조사지 신청하기</h6>
              <div class="d-flex align-items-center">
                <span class="text-sm me-2 text-secondary font-weight-bold"
                  >작성일</span
                >
                <div class="date-display p-2 bg-light border-radius-md border">
                  <span class="text-xs font-weight-bold">2026.03.12</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-body p-4">
            <!-- ================= 지원사유 ================= -->
            <div
              class="d-flex justify-content-between align-items-center mb-4 p-3 bg-gray-100 border-radius-lg"
            >
              <div class="d-flex align-items-center">
                <span class="text-success me-2">●</span>
                <span class="text-sm font-weight-bolder">지원사유</span>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table align-items-center mb-0 border-top">
                <thead>
                  <tr class="bg-light">
                    <th colspan="2" class="ps-4 text-sm font-weight-bolder">
                      설문 항목
                    </th>
                    <th class="text-center text-xs text-secondary">예</th>
                    <th class="text-center text-xs text-secondary">아니오</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-gray-100">
                    <td
                      colspan="4"
                      class="py-2 ps-4 text-xs font-weight-bold text-success text-uppercase"
                    >
                      긴급 지원 필요
                      <span
                        class="ms-2 font-weight-normal text-secondary text-lowercase"
                        >즉시 지원인식 및 서비스 필요</span
                      >
                    </td>
                  </tr>

                  <tr v-for="(item, index) in section1" :key="'s1-' + index">
                    <td class="text-center text-xs text-secondary ps-4">
                      {{ index + 1 }}
                    </td>
                    <td class="text-sm text-dark text-wrap align-top">
                      {{ item }}
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s1_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s1_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                  </tr>

                  <tr class="bg-gray-100">
                    <td
                      colspan="4"
                      class="py-2 ps-4 text-xs font-weight-bold text-info text-uppercase"
                    >
                      중점 지원 필요
                      <span
                        class="ms-2 font-weight-normal text-secondary text-lowercase"
                        >즉시 지원인식 및 서비스 필요</span
                      >
                    </td>
                  </tr>

                  <tr v-for="(item, index) in section2" :key="'s2-' + index">
                    <td class="text-center text-xs text-secondary ps-4">
                      {{ index + 1 }}
                    </td>
                    <td class="text-sm text-dark text-wrap align-top">
                      {{ item }}
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s2_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s2_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                  </tr>

                  <tr class="bg-gray-100">
                    <td
                      colspan="4"
                      class="py-2 ps-4 text-xs font-weight-bold text-primary text-uppercase"
                    >
                      계획 수립 필요
                      <span
                        class="ms-2 font-weight-normal text-secondary text-lowercase"
                        >즉시 지원인식 및 서비스 필요</span
                      >
                    </td>
                  </tr>

                  <tr v-for="(item, index) in section3" :key="'s3-' + index">
                    <td class="text-center text-xs text-secondary ps-4">
                      {{ index + 1 }}
                    </td>
                    <td class="text-sm text-dark text-wrap align-top">
                      {{ item }}
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s3_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s3_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- ================= 지원이 필요한 서비스 ================= -->
            <div
              class="d-flex justify-content-between align-items-center mt-5 mb-4 p-3 bg-gray-100 border-radius-lg"
            >
              <div class="d-flex align-items-center">
                <span class="text-success me-2">●</span>
                <span class="text-sm font-weight-bolder"
                  >지원이 필요한 서비스</span
                >
              </div>
            </div>

            <div class="table-responsive">
              <table class="table align-items-center mb-0 border-top">
                <thead>
                  <tr class="bg-light">
                    <th colspan="2" class="ps-4 text-sm font-weight-bolder">
                      설문 항목
                    </th>
                    <th class="text-center text-xs text-secondary">예</th>
                    <th class="text-center text-xs text-secondary">아니오</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-gray-100">
                    <td
                      colspan="4"
                      class="py-2 ps-4 text-xs font-weight-bold text-info text-uppercase"
                    >
                      개인별 지원
                    </td>
                  </tr>

                  <tr v-for="(item, index) in section4" :key="'s4-' + index">
                    <td class="text-center text-xs text-secondary ps-4">
                      {{ index + 1 }}
                    </td>
                    <td class="text-sm text-dark text-wrap align-top">
                      {{ item }}
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s4_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s4_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                  </tr>

                  <tr class="bg-gray-100">
                    <td
                      colspan="4"
                      class="py-2 ps-4 text-xs font-weight-bold text-info text-uppercase"
                    >
                      교통
                    </td>
                  </tr>

                  <tr v-for="(item, index) in section5" :key="'s5-' + index">
                    <td class="text-center text-xs text-secondary ps-4">
                      {{ index + 1 }}
                    </td>
                    <td class="text-sm text-dark text-wrap align-top">
                      {{ item }}
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s5_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s5_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- ================= 이용중인 복지 서비스 ================= -->
            <div
              class="d-flex justify-content-between align-items-center mt-5 mb-4 p-3 bg-gray-100 border-radius-lg"
            >
              <div class="d-flex align-items-center">
                <span class="text-success me-2">●</span>
                <span class="text-sm font-weight-bolder"
                  >이용중인 복지 서비스</span
                >
              </div>
            </div>

            <div class="table-responsive">
              <table class="table align-items-center mb-0 border-top">
                <thead>
                  <tr class="bg-light">
                    <th colspan="2" class="ps-4 text-sm font-weight-bolder">
                      설문 항목
                    </th>
                    <th class="text-center text-xs text-secondary">예</th>
                    <th class="text-center text-xs text-secondary">아니오</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-gray-100">
                    <td
                      colspan="4"
                      class="py-2 ps-4 text-xs font-weight-bold text-info text-uppercase"
                    >
                      생활안정
                    </td>
                  </tr>

                  <tr v-for="(item, index) in section6" :key="'s6-' + index">
                    <td class="text-center text-xs text-secondary ps-4">
                      {{ index + 1 }}
                    </td>
                    <td class="text-sm text-dark text-wrap align-top">
                      {{ item }}
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s6_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s6_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                  </tr>

                  <tr class="bg-gray-100">
                    <td
                      colspan="4"
                      class="py-2 ps-4 text-xs font-weight-bold text-info text-uppercase"
                    >
                      고용
                    </td>
                  </tr>

                  <tr v-for="(item, index) in section7" :key="'s7-' + index">
                    <td class="text-center text-xs text-secondary ps-4">
                      {{ index + 1 }}
                    </td>
                    <td class="text-sm text-dark text-wrap align-top">
                      {{ item }}
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s7_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                    <td class="text-center">
                      <input
                        type="radio"
                        :name="'s7_q' + index"
                        class="form-check-input custom-radio"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 추가 요청 -->
            <div class="mt-4">
              <h6 class="text-sm font-weight-bolder mb-2 text-secondary">
                <span class="text-success me-1">●</span> 추가 요청사항
              </h6>
              <textarea class="form-control" rows="4"></textarea>
            </div>

            <!-- 버튼 -->
            <div class="d-flex justify-content-end mt-4">
              <button class="btn btn-success me-2">저장</button>
              <button class="btn btn-outline-secondary">취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const section1 = [
  "현재 긴급하게 도움이 필요한 상황(주거, 건강, 안전 등)이 있다.",
  "최근 돌봄 제공자(가족, 보호자)의 부재 또는 돌봄 공백이 발생하였다.",
  "현재 상황이 즉각적인 공공기관 또는 서비스 지원이 필요할 정도로 위급하다.",
];

const section2 = [
  "일상생활을 유지하기 위해 지속적인 도움이나 지원 서비스가 필요하다.",
  "현재 받고 있는 지원만으로는 생활 유지에 어려움이 있다.",
  "특정 영역(건강, 생활, 이동 등)에서 우선적으로 지원이 필요하다.",
];

const section3 = [
  "앞으로의 생활 또는 서비스 이용을 위한 장기적인 계획이 필요하다.",
  "현재 이용 가능한 지원 서비스나 제도에 대한 안내 및 상담이 필요하다.",
  "향후 생활 지원을 위한 개인 맞춤형 계획 수립이 필요하다.",
];

const section4 = [
  "개인의 상황에 맞는 맞춤형 지원 서비스가 필요하다.",
  "일상생활(식사, 위생, 정리 등)에 개인 지원이 필요하다.",
  "개인 활동(외출, 사회활동 등)에 도움이 필요하다.",
];

const section5 = [
  "병원, 복지시설 등 필요한 장소로 이동하는데 어려움이 있다.",
  "대중교통 이용이 어렵거나 제한이 있다.",
];

const section6 = [
  "현재 생활비 또는 기본적인 생계 유지에 어려움이 있다.",
  "안정적인 주거 환경 유지에 어려움이 있다.",
  "생활을 유지하기 위해 추가적인 경계적 지원이 필요하다.",
];

const section7 = [
  "취업을 원하지만 취업 기회를 얻기 어렵다.",
  "취업을 위해 직업 교육 또는 취업 지원 서비스가 필요하다.",
];
</script>

<style scoped>
.custom-radio {
  cursor: pointer;
  width: 1.2rem;
  height: 1.2rem;
  border: 1px solid #d2d6da;
  border-radius: 4px !important;
}

.custom-radio:checked {
  background-color: #2dce89;
  border-color: #2dce89;
}

.table td {
  padding: 1rem 0.5rem;
  vertical-align: middle;
}

.bg-gray-100 {
  background-color: #f8f9fa !important;
}

.date-display {
  min-width: 120px;
  text-align: center;
}

.text-wrap {
  white-space: normal !important;
}
</style>
