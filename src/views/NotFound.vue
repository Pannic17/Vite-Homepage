<script setup>
import {useI18n} from 'vue-i18n';
import SiteLayout from '../layouts/SiteLayout.vue';
const {t} = useI18n();
</script>

<template>
  <SiteLayout title="404">
    <template #subtitle>PANNIC</template>
    <p class="reading-copy">{{ t('status.notFound') }}</p>
  </SiteLayout>
</template>
