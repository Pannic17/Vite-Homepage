<script setup>
import LanguageSwitch from './LanguageSwitch.vue';
import {useRouter} from 'vue-router';
import {backOrFallback} from '../utils/navigation';
defineProps({backTo: String, showHome: {type: Boolean, default: true}});
const router=useRouter();
</script>
<template>
  <nav class="header-actions" :aria-label="$t('accessibility.navigation')">
    <LanguageSwitch />
    <div class="header-links">
      <button v-if="backTo" class="text-link" type="button" @click="backOrFallback(router, backTo)">{{ $t('menu.back') }}</button>
      <RouterLink v-if="showHome" class="text-link header-home" to="/"><span class="home-width" aria-hidden="true">首页</span><span class="home-width" aria-hidden="true">HOME</span><span class="home-label">{{ $t('menu.main') }}</span></RouterLink>
    </div>
  </nav>
</template>
<style scoped>
.header-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
.header-links { display: flex; align-items: center; gap: var(--header-space, .75rem); }
.header-home { display: inline-grid; flex: 0 0 auto; white-space: nowrap; }
.header-home > span { grid-area: 1 / 1; justify-self: end; }
.home-width { visibility: hidden; }
</style>
