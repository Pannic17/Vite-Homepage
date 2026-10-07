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
    <div v-if="entry.detail.heroKey" class="artwork-detail">
      <section class="detail-hero corner-frame" :aria-label="$t(entry.titleKey)">
        <div class="hero-art">
          <ResponsiveImage :src="entry.cover" :alt="$t(entry.titleKey)" class="hero-cover" sizes="(max-width: 760px) 90vw, 480px" loading="eager" />
        </div>
        <div class="hero-copy">
          <div class="hero-intro">
            <h2>{{ $t(entry.detail.heroKey) }}</h2>
            <p v-if="entry.introKey">{{ $t(entry.introKey) }}</p>
          </div>
          <nav class="detail-links" :class="{'detail-links-multiple': entry.detail.links.length > 1}" :aria-label="$t(entry.titleKey)">
            <a v-for="link in entry.detail.links" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer">{{ $t(link.labelKey) }}</a>
          </nav>
        </div>
      </section>
      <section v-if="entry.detail.video" class="detail-video" aria-labelledby="demo-heading">
        <div class="section-heading video-heading">
          <div class="section-title"><span class="section-index" aria-hidden="true">01 /</span><h2 id="demo-heading">{{ $t(entry.detail.video.titleKey) }}</h2></div>
          <a :href="entry.detail.video.href" target="_blank" rel="noopener noreferrer">{{ $t('catnet.watch') }}</a>
        </div>
        <div class="video-frame corner-frame">
          <iframe
            :src="entry.detail.video.embedUrl"
            :title="$t(entry.detail.video.titleKey)"
            loading="lazy"
            allow="fullscreen; picture-in-picture"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p class="video-help">{{ $t('catnet.videoHelp') }}</p>
      </section>
      <section class="detail-notes" aria-labelledby="process-heading">
        <div class="section-heading">
          <div class="section-title"><span class="section-index" aria-hidden="true">{{ entry.detail.video ? '02' : '01' }} /</span><h2 id="process-heading">{{ $t(entry.detail.sectionTitleKey) }}</h2></div>
        </div>
        <div class="detail-copy notes-grid" :class="{'notes-grid-three': entry.detail.paragraphKeys.length === 3}">
          <div v-for="(key, index) in entry.detail.paragraphKeys" :key="key" class="note">
            <h3>{{ $t(entry.detail.headingKeys[index]) }}</h3>
            <p>{{ $t(key) }}</p>
          </div>
        </div>
      </section>
    </div>
    <section v-else class="project-detail content-stack">
      <div class="detail-meta"><TagList :tags="entry.tags" /></div>
      <nav v-if="entry.detail.links?.length" class="detail-links" :aria-label="$t(entry.titleKey)">
        <a v-for="link in entry.detail.links" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer">{{ $t(link.labelKey) }}</a>
      </nav>
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
.artwork-detail { display: grid; gap: clamp(2.5rem, 6vw, 5rem); }
.detail-hero { display: grid; grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr); gap: clamp(2rem, 5vw, 4.5rem); padding-block: 1.25rem; }
.hero-art { min-width: 0; display: flex; align-items: center; }
.hero-art :deep(.hero-cover) { width: 100%; aspect-ratio: 1; object-fit: contain; }
.hero-copy { display: flex; flex-direction: column; justify-content: center; gap: 2rem; min-width: 0; text-align: right; padding-block: .5rem; }
.section-index { color: var(--hover-color); font-size: .8125rem; font-weight: 600; letter-spacing: .12em; }
.hero-intro { display: grid; gap: 1.5rem; }
.hero-intro h2 { font-size: clamp(2.5rem, 5vw, 4.5rem); letter-spacing: -.04em; text-shadow: 2px 2px 2px var(--context-color); }
.hero-intro p { line-height: var(--leading-copy); text-wrap: pretty; }
.detail-links { display: flex; flex-wrap: wrap; gap: 1rem; }
.hero-copy .detail-links { justify-content: flex-end; }
.hero-copy .detail-links-multiple { display: grid; justify-items: end; gap: .25rem; }
.detail-links a, .video-heading a { display: inline-flex; align-items: center; min-height: 44px; text-underline-offset: .25em; }
.detail-links a { color: var(--hover-color); font-weight: 600; }
.detail-video, .detail-notes { width: 100%; min-width: 0; display: grid; gap: 1.5rem; }
.section-heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem 1rem; padding-bottom: .75rem; border-bottom: 1px solid var(--border-color); }
.section-title { display: flex; align-items: baseline; gap: 1rem; min-width: 0; }
.section-heading h2 { font-size: clamp(1.25rem, 2.2vw, 1.75rem); }
.video-heading a { font-size: .875rem; color: var(--context-color); }
.video-frame { padding: .65rem; background: #1c1c1c; }
.video-frame::before, .video-frame::after { width: 1.5rem; height: 1.5rem; }
.detail-video iframe { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; background: #000; }
.video-help { color: var(--context-color); font-size: .875rem; }
.notes-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(2rem, 5vw, 4.5rem); }
.notes-grid-three { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(1.5rem, 3vw, 2.5rem); }
.note { min-width: 0; display: grid; align-content: start; gap: 1rem; }
.note h3 { font-size: 1.125rem; color: var(--title-color); }
.note p { line-height: var(--leading-copy); }
@media (hover: hover) { .detail-links a:hover, .video-heading a:hover { color: var(--title-color); } }
@media (max-width: 47.5rem) {
  .detail-hero { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
  .hero-art { justify-content: center; }
  .hero-art :deep(.hero-cover) { max-width: 28rem; }
  .hero-copy { text-align: left; gap: 1.5rem; }
  .hero-intro { gap: 1rem; }
  .hero-copy .detail-links { justify-content: flex-start; }
  .hero-copy .detail-links-multiple { justify-items: start; }
  .notes-grid { grid-template-columns: minmax(0, 1fr); }
  .section-title { gap: .65rem; }
  .video-heading { align-items: start; }
  .video-frame { padding: .4rem; }
}
</style>
