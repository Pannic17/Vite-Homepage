<script setup>
import SubRight from '../SubRight.vue';
defineProps({ title: String, backTo: String, showHome: {type: Boolean, default: true} });
</script>
<template>
  <header class="site-header">
    <div class="site-heading"><h1>{{ title }}</h1><p class="subtitle"><slot /></p></div>
    <SubRight :back-to="backTo" :show-home="showHome" />
  </header>
</template>
<style scoped>
.site-header {
  --header-unit: clamp(.5rem, 1vw, .8rem);
  --header-nav-size: var(--text-navigation);
  display: grid;
  grid-template-columns: minmax(0, 1fr) max-content;
  grid-template-rows: auto auto;
  column-gap: calc(var(--header-unit) * 2);
  row-gap: min(.25vw, .25rem);
  align-items: start;
  position: sticky;
  top: 0;
  z-index: 2;
  padding-block: var(--space-header-top) var(--space-header-bottom);
  margin-bottom: var(--space-section);
  border-bottom: 1px solid var(--context-color);
  background: var(--background-color);
  line-height: 1.2;
}
/* Shared rows align the lower corners even when the description wraps. */
.site-heading, .site-header :deep(.header-actions) { display: contents; }
.site-heading h1 {
  grid-area: 1 / 1;
  min-width: 0;
  font-size: var(--text-display);
  line-height: 1.15;
}
.subtitle {
  grid-area: 2 / 1;
  align-self: end;
  min-width: 0;
  margin: 0;
  font-size: var(--text-subtitle);
  line-height: 1.4;
  text-wrap: pretty;
}
.site-header :deep(.language-switch) {
  grid-area: 1 / 2;
  justify-self: end;
  align-items: flex-start;
  gap: calc(var(--header-unit) * .25);
  font-size: var(--header-nav-size);
}
.site-header :deep(.header-links) {
  grid-area: 2 / 2;
  align-self: end;
  justify-self: end;
  gap: var(--header-unit);
  font-size: var(--header-nav-size);
}
.site-header :deep(.header-links > a), .site-header :deep(.header-links > button) {
  padding: 0;
  border: 0;
  color: var(--context-color);
  min-height: 44px;
  min-width: 44px;
  align-items: end;
  line-height: 1.4;
  position: relative;
  white-space: nowrap;
  overflow-wrap: normal;
}
.site-header :deep(.header-home) { display: inline-grid; width: max-content; min-width: 4.5rem; flex: 0 0 auto; justify-content: end; }
.site-header :deep(.language-switch button) { display: inline-flex; align-items: flex-start; justify-content: center; line-height: inherit; padding: 0; color: var(--context-color); }
.site-header :deep(.language-switch button:last-child) { justify-content: flex-end; }
@media (max-width: 48rem) {
  .site-header :deep(.language-full) { display: none; }
  .site-header :deep(.language-short) { display: inline; }
}
@media (max-height: 34rem) { .site-header { position: static; } }
</style>
