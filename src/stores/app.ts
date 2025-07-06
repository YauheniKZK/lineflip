import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAppStore = defineStore('app', () => {

  // ------------STATE------------

  const errorServerData = ref({
    error: false,
    type: 'server',
    messageTitle: '',
    messageContent: '',
  });

  // ------------GETTERS------------

  const errorServerDataGetters = computed(() => errorServerData.value);

  // ------------ACTION------------

  function setErrorServerData(
    type: 'server' | 'common',
    title: string,
    content: string,
  ) {
    errorServerData.value.type = type;
    errorServerData.value.messageContent = title;
    errorServerData.value.messageTitle = content;
    errorServerData.value.error = true;
  }

  function resetErrorServerData() {
    errorServerData.value.error = false;
    errorServerData.value.messageContent = '';
    errorServerData.value.messageTitle = '';
  }

  return {

    errorServerDataGetters,
    resetErrorServerData,
    setErrorServerData
  };
});
