<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NInput,
  NCheckbox,
  FormItemRule,
  NAlert,
} from 'naive-ui';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import WoxlinkButton from '@/components/ui/WoxlinkButton.vue';
import LabelInput from '@/components/ui/LabelInput.vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();
const authStore = useAuthStore();
const { formLoginGetters, loginActionDataGetters } = storeToRefs(authStore);

const { loginAction, resetFormLoginError } = authStore;

const disabledbtn = computed(() => {
  resetFormLoginError(false);
  if (
    formLoginGetters.value.email === '' ||
    formLoginGetters.value.password === ''
  ) {
    return true;
  } else {
    return false;
  }
});

const rules = {
  email: {
    required: true,
    validator: (_rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error(t('RULES_FIELD_IS_REQUIRED'));
      }
      return true;
    },
    trigger: ['blur', 'input'],
  },
  password: {
    required: true,
    validator: (_rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error(t('RULES_FIELD_IS_REQUIRED'));
      }
      return true;
    },
    trigger: ['blur', 'input'],
  },
};
</script>

<template>
  <div class="flex flex-col grow w-full">
    <div class="px-4 pt-8 flex flex-col items-center h-full gap-8 w-full">
      <span class="text-center text-xl font-semibold leading-[54px]">{{
        t('LOGIN')
      }}</span>
      <n-form
        ref="formRef"
        :model="formLoginGetters"
        :rules="rules"
        class="w-full max-w-[600px]"
      >
        <n-alert
          v-if="loginActionDataGetters.error.error"
          :show-icon="false"
          style="border-radius: 20px !important"
          :style="`background: #F2D4D7;border: 1px solid #E90000;`"
          class="mb-[32px] w-auto max-w-full bg-[#F2D4D7]"
        >
          <div
            v-if="loginActionDataGetters.error.attemptsError"
            class="flex flex-col gap-4"
          >
            <span class="text-[14px] text-center text-[#101623]">{{
              t('email_address_or_password_is_incorrect')
            }}</span>
            <span class="text-[14px] font-[600] text-center text-[#101623]">{{
              t('attempts_remaining', {
                attempts: loginActionDataGetters.error.attempts,
              }).replace(
                '{attempts}',
                String(loginActionDataGetters.error.attempts),
              )
            }}</span>
          </div>
          <div v-else class="flex flex-col">
            <span class="text-[14px] text-center text-[#101623]">{{
              t(loginActionDataGetters.error.message)
            }}</span>
          </div>
        </n-alert>
        <n-form-item :show-label="false" path="email">
          <n-input
            v-model:value="formLoginGetters.email"
            placeholder=""
            :input-props="{ required: true }"
          >
            <template #prefix>
              <LabelInput :text="'EMAIL'" :required="true" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item :show-label="false" path="password">
          <n-input
            type="password"
            v-model:value="formLoginGetters.password"
            placeholder=""
            show-password-on="click"
            :input-props="{ required: true }"
          >
            <template #prefix>
              <LabelInput :text="'PASSWORD'" :required="true" />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item :show-label="false">
          <n-checkbox
            v-model:checked="formLoginGetters.rememberMe"
            class="custom-checkbox"
          >
            <span class="text-[#4A5D6D] text-[16px]">{{
              t('keep_me_signed_in')
            }}</span>
          </n-checkbox>
        </n-form-item>
        <WoxlinkButton
          :color="'#0165FC'"
          :text-color="'#fff'"
          :text="'LOGIN'"
          :disabled="disabledbtn"
          :loading="loginActionDataGetters.loading"
          :action="() => loginAction()"
        />
      </n-form>
    </div>
  </div>
</template>

<style scoped></style>
