import { defineStore } from "pinia";

export const useManagerMainSearchStore = defineStore("managerMainSearch", {
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

    resetSearchCondition(managerName = "") {
      this.writeDate = "";
      this.applicantName = "";
      this.managerName = managerName || "";
      this.searchTrigger++;
    },
  },
});