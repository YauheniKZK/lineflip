<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';

</script>

<template>
  <div>
    <router-view v-slot="{ Component, route }" class="flex flex-col grow">
      <transition :name="String(route?.meta?.transition) || ''">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease-in-out;
  position: absolute;
  width: 100%;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
