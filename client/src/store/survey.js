import { defineStore } from "pinia";

export const useSurveyStore = defineStore("survey", {
  state: () => ({
    selectedUserId: "",
    userList: [],
  }),
  getters: {
    selectedUser: (state) => {
      return (
        state.userList.find((u) => u.support_id === state.selectedUserId) ||
        null
      );
    },
  },
});
