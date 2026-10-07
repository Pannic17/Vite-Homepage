<script setup>
import SiteLayout from '../layouts/SiteLayout.vue';
import ResponsiveImage from '../components/ResponsiveImage.vue';
import {kaiwu} from '../content/portfolio';
const areas = ['experience', 'access', 'journey', 'operations'];
const chapters = ['viewing', 'clients', 'services', 'issuance', 'delivery'];
</script>
<template>
  <SiteLayout :title="$t(kaiwu.titleKey)" back-to="/projects">
    <template #subtitle>{{ $t('kaiwuDetail.subtitle') }}</template>
    <article class="kaiwu-detail">
      <section class="detail-intro corner-frame" aria-labelledby="kaiwu-overview">
        <div class="intro-brand">
          <img src="../assets/logo_kaiwu.png" alt="" width="112" height="112">
          <h2 id="kaiwu-overview">{{ $t('kaiwuDetail.headline') }}</h2>
        </div>
        <div class="intro-copy">
          <p class="eyebrow">KaiwuArt</p>
          <p>{{ $t('kaiwuDetail.overview') }}</p>
          <p>{{ $t('kaiwuDetail.role') }}</p>
          <RouterLink class="preview-link" :to="{name:'KaiwuViewer',query:{debug:'1'}}">{{ $t('kaiwuDetail.preview') }} ↗</RouterLink>
        </div>
      </section>

      <dl class="scope-grid">
        <div v-for="area in areas" :key="area">
          <dt>{{ $t(`kaiwuDetail.scope.${area}.title`) }}</dt>
          <dd>{{ $t(`kaiwuDetail.scope.${area}.text`) }}</dd>
        </div>
      </dl>

      <figure class="project-posters">
        <div class="poster-grid">
          <ResponsiveImage v-for="poster in kaiwu.posters" :key="poster.number" :src="poster.src" :alt="$t('kaiwu.poster', {number:poster.number})" sizes="(max-width: 760px) 45vw, 23vw" />
        </div>
        <figcaption>{{ $t('kaiwuDetail.posters') }}</figcaption>
      </figure>

      <section v-for="(chapter, index) in chapters" :key="chapter" class="chapter" :aria-labelledby="`kaiwu-${chapter}`">
        <header class="chapter-heading">
          <span class="section-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }} /</span>
          <h2 :id="`kaiwu-${chapter}`">{{ $t(`kaiwuDetail.chapters.${chapter}.title`) }}</h2>
        </header>
        <div class="chapter-copy">
          <p class="chapter-lead">{{ $t(`kaiwuDetail.chapters.${chapter}.lead`) }}</p>
          <p>{{ $t(`kaiwuDetail.chapters.${chapter}.body`) }}</p>
        </div>
      </section>

      <section class="closing corner-frame" aria-labelledby="kaiwu-contribution">
        <p class="eyebrow">{{ $t('kaiwuDetail.contributionLabel') }}</p>
        <h2 id="kaiwu-contribution">{{ $t('kaiwuDetail.contributionTitle') }}</h2>
        <p>{{ $t('kaiwuDetail.contribution') }}</p>
      </section>
    </article>
  </SiteLayout>
</template>
<style scoped>
.kaiwu-detail { display: grid; gap: var(--space-section); }
.detail-intro { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-column); padding-block: 1.25rem; }
.intro-brand { display: flex; align-items: center; gap: clamp(1rem, 3vw, 2rem); }
.intro-brand img { width: clamp(3rem, 7vw, 7rem); height: auto; flex-shrink: 0; }
.eyebrow, .section-index { color: var(--hover-color); font-size: .8125rem; font-weight: 600; letter-spacing: .12em; }
.intro-brand h2 { min-width: 0; font-size: clamp(1.5rem, 4vw, 3.75rem); line-height: 1.25; text-wrap: balance; text-shadow: 2px 2px 2px var(--context-color); }
.intro-copy, .chapter-copy { display: grid; align-content: start; gap: var(--space-copy); }
.kaiwu-detail p { margin: 0; }
.intro-copy p, .chapter-copy p, .closing > p:last-child { line-height: var(--leading-copy); text-wrap: pretty; }
.preview-link { justify-self: start; display: inline-flex; align-items: center; min-height: 44px; color: var(--hover-color); text-underline-offset: .25em; }
.scope-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-column); margin: 0; padding-block: 1.5rem; border-block: 1px solid var(--border-color); }
.scope-grid dt { margin-bottom: .75rem; color: var(--title-color); font-weight: 600; }
.scope-grid dd { margin: 0; line-height: 1.65; }
.project-posters { margin: 0; min-width: 0; }
.poster-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: start; }
.poster-grid :deep(img) { width: 100%; }
.project-posters figcaption { margin-top: .75rem; font-size: .875rem; line-height: 1.6; }
.chapter { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: var(--space-column); padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
.chapter-heading { display: flex; align-items: baseline; gap: .75rem; }
.section-index { flex-shrink: 0; }
.chapter-heading h2, .closing h2 { font-size: var(--text-title); line-height: 1.4; text-wrap: balance; }
.chapter-lead { color: var(--title-color); }
.closing { display: grid; gap: 1.25rem; padding: 1.5rem; }
.closing > p:last-child { max-width: var(--reading-width); }
@media (max-width: 47.5rem) {
  .chapter { grid-template-columns: minmax(0, 1fr); }
  .scope-grid, .poster-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .closing { padding: 1rem; }
}
</style>
