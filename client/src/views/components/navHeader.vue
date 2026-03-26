<template>
  <div class="container-fluid">
    <div class="page-header min-height-100">
      <span class="mask bg-gradient-success opacity-6"></span>
    </div>

    <div class="card shadow-lg mt-n6">
      <div class="card-body p-3 position-relative">
        <div class="row gx-4">
          <div class="col-auto">
            <div class="avatar avatar-xl position-relative">
              <img
                :src="profileImage"
                alt="profile_image"
                class="shadow-sm w-100 border-radius-lg"
              />
            </div>
          </div>

          <div class="col-auto my-auto">
            <div class="h-100">
              <ul class="nav nav-pills custom-top-menu" role="tablist">
                <li
                  v-for="menu in topMenus"
                  :key="menu.label"
                  class="nav-item"
                >
                  <a
                    class="px-3 py-2 nav-link"
                    :class="{ active: menu.active }"
                    href="javascript:;"
                    role="tab"
                    aria-selected="true"
                    @click="$emit('click-top-menu', menu)"
                  >
                    <span class="ms-1">{{ menu.label }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            class="position-absolute top-50 start-50 translate-middle text-center fw-bold"
          >
            {{ userName }}님 환영합니다
          </div>

          <div class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0">
            <div class="nav-wrapper position-relative end-0">
              <ul class="p-1 bg-transparent nav nav-pills nav-fill" role="tablist">
                <li
                  v-for="menu in rightMenus"
                  :key="menu.label"
                  class="nav-item"
                >
                  <a
                    class="px-3 py-2 mb-0 nav-link"
                    :class="{ active: menu.active }"
                    href="javascript:;"
                    role="tab"
                    @click="$emit('click-right-menu', menu)"
                  >
                    <span class="ms-1">{{ menu.label }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userName: {
    type: String,
    default: "홍길동",
  },
  profileImage: {
    type: String,
    default: "../assets/img/team-1.jpg",
  },
  topMenus: {
    type: Array,
    default: () => [],
  },
  rightMenus: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["click-top-menu", "click-right-menu"]);
</script>