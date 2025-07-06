<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';
import WoxlinkButton from '@/components/ui/WoxlinkButton.vue';
import bgStartedPage from '@/assets/images/bg/bgStartedPage.svg';
import startedIconCenter from '@/assets/images/startedIconCenter.png';
import logoStartedPage from '@/assets/images/logos/logoStartedPage.png';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { capitalizeFirstLetter } from '@/utils/helper';
import { Config } from '@/config';

const router = useRouter();

const { locale, t } = useI18n();

const routeToLogin = () => {
  router.push({ path: '/login' });
};

const switchLan = () => {
  const allowedLanguages = String(Config.SUPPORTED_LANGUAGES).split(',');
  const currentIndex = allowedLanguages.indexOf(locale.value);
  const nextIndex = (currentIndex + 1) % allowedLanguages.length;
  const nextLocale = allowedLanguages[nextIndex];
  locale.value = nextLocale;
  localStorage.setItem('locale', nextLocale);
};
</script>

<template>
  <div class="flex flex-col grow start-page">
    <img
      :src="bgStartedPage"
      class="fixed left-0 top-0 w-full h-full object-cover"
    />
    <div class="px-4 flex flex-col justify-center items-center relative h-full">
      <div class="flex absolute left-4 top-0">
        <n-button text :text-color="'#fff'" @click="switchLan">
          <template #icon>
            <n-icon :size="24">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 12H22"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </n-icon>
          </template>
          <span class="pl-2">{{ capitalizeFirstLetter(locale) }}</span>
        </n-button>
      </div>
      <div
        class="flex flex-col justify-center items-center relative w-full max-w-[375px] pt-14"
      >
        <img
          :src="startedIconCenter"
          class="absolute w-full max-w-[332px] opacity-70 top-0 left-1/2 transform -translate-x-1/2 object-contain"
        />
        <div
          class="flex flex-col justify-center items-center relative text-center"
        >
          <img
            :src="logoStartedPage"
            class="max-w-[147px] mx-auto mb-7"
            alt=""
          />
          <span class="text-white font-semibold mb-[94px]">
            {{ t('started_page_text') }}
          </span>
          <WoxlinkButton
            :color="'#fff'"
            :text-color="'#0165FC'"
            :text="'LOGIN'"
            :action="routeToLogin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.start-page {
  background: #0085fe;
}
</style>
