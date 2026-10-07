<script setup>
import {computed, ref, watch, onBeforeUnmount} from 'vue';
import {useRoute} from 'vue-router';
import SiteLayout from '../layouts/SiteLayout.vue';
import {experiments, labPath, loadExperiment} from '../features/three-lab/catalog.js';

const route = useRoute();
const selected = computed(() => experiments.find(entry => entry.id === route.params.experiment) || experiments[6]);
const host = ref(null), panel = ref(null), status = ref('loading'), paused = ref(false);
let runtime, generation = 0;
async function start() {
  const current = ++generation;
  runtime?.dispose(); runtime = undefined;
  status.value = 'loading'; paused.value = false;
  if (!host.value) return;
  try {
    const [{createRuntime}, {createScene}] = await Promise.all([
      import('../features/three-lab/runtime.js'), loadExperiment(selected.value.id),
    ]);
    if (current !== generation) return;
    runtime = createRuntime(host.value, panel.value, {
      onReady: () => { status.value = 'ready'; if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { paused.value = true; runtime.setPaused(true); } },
      onError: () => { status.value = 'error'; },
    });
    createScene(runtime);
  } catch (error) {
    if (current !== generation) return;
    runtime?.dispose(); status.value = 'error';
    console.error('Three.js experiment failed', error);
  }
}
function togglePause() { paused.value = !paused.value; runtime?.setPaused(paused.value); }
watch([host, () => selected.value.id], start, {flush:'post'});
onBeforeUnmount(() => { generation++; runtime?.dispose(); });
</script>

<template>
  <SiteLayout :title="$t('lab.title')" back-to="/works">
    <template #subtitle>{{ $t('lab.subtitle') }}</template>
    <section class="lab" aria-labelledby="experiment-title">
      <nav class="lab-nav" :aria-label="$t('lab.choose')">
        <RouterLink v-for="entry in experiments" :key="entry.id" :to="`${labPath}/${entry.id}`" :aria-current="selected.id === entry.id ? 'page' : undefined" :class="{selected:selected.id === entry.id}">
          <span class="lab-number">{{ entry.id }}</span><span>{{ $t(entry.key + '.title') }}</span>
        </RouterLink>
      </nav>
      <div class="lab-content">
        <div class="lab-heading">
          <h2 id="experiment-title"><span>{{ selected.id }} / 09</span>{{ $t(selected.key + '.title') }}</h2>
          <button v-if="status === 'ready'" type="button" @click="togglePause">{{ $t(paused ? 'lab.play' : 'lab.pause') }}</button>
        </div>
        <div class="lab-stage" :data-state="status" :data-experiment="selected.id">
          <div ref="host" class="lab-canvas" role="img" :aria-label="$t(selected.key + '.title')"></div>
          <div v-if="status !== 'ready'" class="lab-status" role="status">
            <p>{{ $t(status === 'error' ? 'lab.error' : 'lab.loading') }}</p>
            <button v-if="status === 'error'" type="button" @click="start">{{ $t('lab.retry') }}</button>
          </div>
        </div>
        <div class="lab-notes">
          <p>{{ $t(selected.key + '.description') }}</p>
          <p class="lab-hint">{{ $t(['04','05','06'].includes(selected.id) ? 'lab.watch' : 'lab.orbit') }}</p>
          <RouterLink class="lab-back" to="/works">{{ $t('lab.backWorks') }}</RouterLink>
        </div>
        <div ref="panel" class="lab-settings"></div>
      </div>
    </section>
  </SiteLayout>
</template>

<style scoped>
.lab { display:grid; grid-template-columns: 14rem minmax(0,1fr); gap:clamp(1.5rem,3vw,3rem); padding-bottom:var(--space-section); }
.lab-nav { display:flex; flex-direction:column; gap:.3rem; }
.lab-nav a { display:flex; gap:1rem; align-items:center; padding:.85rem .75rem; min-height:48px; text-decoration:none; border:1px solid transparent; color:var(--context-color); }
.lab-nav a:hover,.lab-nav a.selected { border-color:var(--hover-color); color:var(--title-color); background:#70c7b80c; }
.lab-number { flex-shrink:0; white-space:nowrap; color:var(--hover-color); font-size:.8rem; font-variant-numeric:tabular-nums; }
.lab-content { min-width:0; }
.lab-heading { display:flex; gap:1rem; align-items:center; justify-content:space-between; margin-bottom:1.25rem; }
h2 { display:flex; flex-direction:column; gap:.4rem; font-size:var(--text-title); }
h2 span { color:var(--hover-color); font-size:.8rem; letter-spacing:.15em; }
button { padding:.6rem 1rem; min-height:44px; border:1px solid var(--border-color); color:var(--title-color); background:transparent; cursor:pointer; font:inherit; }
button:hover { border-color:var(--hover-color); }
.lab-stage { position:relative; aspect-ratio:16/10; background:#080b0e; border:1px solid var(--border-color); overflow:hidden; }
.lab-canvas { position:absolute; inset:0; }
.lab-canvas :deep(canvas) { display:block; width:100%; height:100%; touch-action:none; }
.lab-status { position:absolute; inset:0; display:flex; flex-direction:column; gap:1rem; align-items:center; justify-content:center; background:#080b0eee; padding:2rem; text-align:center; }
.lab-notes { margin-top:1.25rem; line-height:1.7; }
.lab-hint { color:var(--hover-color); font-size:.85rem; margin-top:.75rem; }
.lab-back { display:inline-flex; align-items:center; min-height:44px; margin-top:.5rem; font-size:.85rem; }
.lab-settings { margin-top:1rem; }
.lab-settings :deep(.lil-gui) { width:min(100%, 30rem)!important; }
a:focus-visible,button:focus-visible { outline:2px solid var(--hover-color); outline-offset:3px; }
@media(max-width:800px) { .lab { grid-template-columns:1fr; gap:1.5rem; } .lab-nav { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); } .lab-nav a { gap:.5rem; padding:.5rem; font-size:.8rem; } .lab-stage { aspect-ratio:1; } }
@media(prefers-reduced-motion:reduce) { * { scroll-behavior:auto; } }
</style>
