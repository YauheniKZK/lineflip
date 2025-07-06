<script setup lang="ts">
import { useNotification } from 'naive-ui';
import { RouterView } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const notification = useNotification();

const appStore = useAppStore();

const { errorServerDataGetters } = storeToRefs(appStore);
const { resetErrorServerData } = appStore;

const notify = () => {
  notification['error']({
    content: errorServerDataGetters.value.messageTitle,
    meta: errorServerDataGetters.value.messageContent,
    duration: 2500,
    keepAliveOnHover: false,
  });
};

watch(
  () => errorServerDataGetters.value.error,
  (newVal) => {
    if (newVal) {
      notify();
      setTimeout(() => {
        resetErrorServerData();
      }, 2500);
    }
  },
);
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
