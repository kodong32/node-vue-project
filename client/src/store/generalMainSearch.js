import { defineStore } from "pinia";

export const useGeneralMainSearchStore = defineStore("generalMainSearch", {
  state: () => ({
    writeDate: "",
    applicantName: "",
    managerId: "",
    managerName: "",
    searchTrigger: 0,
  }),

  actions: {
    setSearchCondition(payload) {
      this.writeDate = payload.writeDate || "";
      this.applicantName = payload.applicantName || "";
      this.managerId = payload.managerId || "";
      this.managerName = payload.managerName || "";
      this.searchTrigger++;
    },

    resetSearchCondition() {
      this.writeDate = "";
      this.applicantName = "";
      this.managerId = "";
      this.managerName = "";
      this.searchTrigger++;
    },
  },
});