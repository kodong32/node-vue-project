import { defineStore } from "pinia";

export const useUserMainSearchStore = defineStore("userMainSearch", {
  state: () => ({
    writeDate: "",
    applicantName: "",
    managerName: "",
    searchTrigger: 0,
  }),

  actions: {
    setSearchCondition(payload) {
      this.writeDate = payload.writeDate || "";
      this.applicantName = payload.applicantName || "";
      this.managerName = payload.managerName || "";
      this.searchTrigger++;
    },

    resetSearchCondition(applicantName = "") {
      this.writeDate = "";
      this.applicantName = applicantName || "";
      this.managerName = "";
      this.searchTrigger++;
    },
  },
});