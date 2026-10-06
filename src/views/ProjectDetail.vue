<script setup>
import {computed} from 'vue';
import SiteLayout from '../layouts/SiteLayout.vue';
import TagList from '../components/portfolio/TagList.vue';
import NotFound from './NotFound.vue';
import {findEntry} from '../content/portfolio';
import ResponsiveImage from '../components/ResponsiveImage.vue';
const props = defineProps({id:{type:String,required:true}});
const entry = computed(() => findEntry(props.id));
</script>
<template>
  <SiteLayout v-if="entry?.detail" :title="$t(entry.titleKey)" :back-to="entry.detail.parent">
    <template #subtitle>{{ $t(entry.categoryKey) }} · {{ $t(entry.dateKey) }}</template>
    <section class="project-detail content-stack">
      <div class="detail-meta"><TagList :tags="entry.tags" /></div>
      <ResponsiveImage :src="entry.cover" :alt="$t(entry.titleKey)" class="gcs-cover detail-cover" sizes="(max-width: 680px) 90vw, 640px" loading="eager" />
      <div class="detail-copy reading-copy">
        <p v-if="entry.introKey">{{ $t(entry.introKey) }}</p>
        <p v-for="key in entry.detail.paragraphKeys" :key="key">{{ $t(key) }}</p>
        <p v-if="entry.detail.status === 'pending'">{{ $t('status.detailsPending') }}</p>
      </div>
    </section>
  </SiteLayout>
  <NotFound v-else />
</template>
<style scoped>
:deep(.detail-cover) { width: 100%; max-width: 40rem; }
</style>
