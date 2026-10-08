<script setup>
import {useI18n} from 'vue-i18n';
const {locale} = useI18n({useScope: 'global'});
</script>
<template>
  <div class="language-switch" role="group" :aria-label="$t('accessibility.language')">
    <button type="button" lang="zh-CN" aria-label="中文" :aria-pressed="locale === 'zh-CN'" @click="locale = 'zh-CN'"><span class="language-full">中文</span><span class="language-short" aria-hidden="true">中</span></button>
    <span aria-hidden="true">/</span>
    <button type="button" lang="en" aria-label="ENGLISH" :aria-pressed="locale === 'en-US'" @click="locale = 'en-US'"><span class="language-full">ENGLISH</span><span class="language-short" aria-hidden="true">EN</span></button>
    <span aria-hidden="true">/</span>
    <button type="button" lang="es" aria-label="ESPAÑOL" :aria-pressed="locale === 'es-ES'" @click="locale = 'es-ES'"><span class="language-full">ESPAÑOL</span><span class="language-short" aria-hidden="true">ES</span></button>
  </div>
</template>
<style scoped>
.language-switch { display: flex; align-items: center; gap: .25rem; }
.language-short { display: none; }
button { min-height: 44px; min-width: 44px; padding: .5rem; border: 0; background: none; }
button[aria-pressed="true"] { text-decoration: underline; text-underline-offset: .3em; color: var(--hover-color); }
</style>
