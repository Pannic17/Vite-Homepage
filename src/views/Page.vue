<script setup>
import SiteLayout from '../layouts/SiteLayout.vue';
import {publicAsset} from '../utils/publicAsset';
</script>
<template>
  <SiteLayout :title="$t('menu.test')">
    <template #subtitle>{{ $t('tags.ar-mini') }} · {{ $t('dates.december2024') }}</template>
    <section class="content-stack">
      <img class="test-cover" :src="publicAsset('image/ZAR-Cover.png')" :alt="$t('title.ZAR')">
      <p>{{ $t('status.detailsPending') }}</p>
    </section>
  </SiteLayout>
</template>
<style scoped>
.test-cover { max-width: 40rem; width: 100%; }
</style>
