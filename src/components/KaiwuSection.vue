<script setup>
import ResponsiveImage from './ResponsiveImage.vue';
import {kaiwu} from '../content/portfolio';
</script>
<template>
  <section class="kaiwu corner-frame">
    <header class="k-head">
      <img class="k-logo" src="../assets/logo_kaiwu.png" alt="" width="112" height="112">
      <div class="k-heading">
        <h2>{{ $t(kaiwu.titleKey) }}</h2>
        <ul class="kaiwu-links">
          <li v-for="link in kaiwu.links" :key="link.id"><span class="k-label">{{ $t(link.labelKey) }}</span></li>
        </ul>
      </div>
    </header>
    <div class="k-actions">
      <RouterLink class="k-action k-brand-link" :to="kaiwu.destination.to" :aria-label="$t('kaiwu.siteLabel')">KAIWUART.CN</RouterLink>
      <span class="k-action-separator" aria-hidden="true">|</span>
      <RouterLink class="k-action k-detail" :to="{name:'KaiwuViewer',query:{debug:'1'}}" :aria-label="$t('kaiwu.previewLabel')">PREVIEW</RouterLink>
    </div>
    <div class="posters">
      <ResponsiveImage v-for="poster in kaiwu.posters" :key="poster.number" :src="poster.src" :alt="$t('kaiwu.poster', {number:poster.number})" sizes="22.5vw" loading="eager" />
    </div>
    <p>{{ $t(kaiwu.paragraphs[0]) }}</p>
    <p>{{ $t(kaiwu.paragraphs[1]) }}</p>
  </section>
</template>
<style scoped>
.kaiwu { display: grid; gap: 1vh; margin-block: 4vh; padding-block: 1vh; }
.k-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.k-heading { flex: 1 1 20rem; min-width: 0; text-align: right; margin-left: auto; }
.k-head h2 { font-size: max(1.5rem, 8vmin); line-height: 1.2; text-shadow: 2px 2px 2px var(--hover-color); }
.k-logo { width: 21vmin; height: 21vmin; object-fit: contain; }
.k-label { color: var(--context-color); }
.k-actions { justify-self: center; display: flex; align-items: center; justify-content: center; gap: .65rem; max-width: 100%; margin-block: 1vh; font-size: clamp(1rem, 1.5vw, 1.25rem); }
.k-action { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; color: var(--title-color); font-size: inherit; font-weight: 600; letter-spacing: .08em; text-decoration: underline; text-underline-offset: .3em; white-space: nowrap; transition: color .18s ease; }
.k-action-separator { color: var(--hover-color); }
.k-action:focus-visible { color: var(--hover-color); }
.posters { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: start; }
.posters :deep(img) { width: 100%; }
.kaiwu-links { display: flex; justify-content: flex-end; flex-wrap: wrap; list-style: none; padding: 0; margin: 1.5vmin 0 0; font-size: max(.875rem, 2vmin); line-height: 1.4; }
.kaiwu-links li { display: inline-flex; align-items: baseline; max-width: 100%; }
.kaiwu-links li:not(:last-child)::after { content: '|'; color: var(--hover-color); margin-inline: .35em; }
.kaiwu p { margin-block: 1vh; }
@media (hover: hover) { .k-action:hover { color: var(--hover-color); } }
</style>
