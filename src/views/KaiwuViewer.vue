<script setup>
import {onMounted,onBeforeUnmount,ref,watch} from 'vue';
import {useRoute} from 'vue-router';
import SiteLayout from '../layouts/SiteLayout.vue';
import {loadConfig} from '../features/kaiwu/config';
import {errorKey,failure} from '../features/kaiwu/errors';
import '../features/kaiwu/kaiwu.css';
const route=useRoute(),container=ref(null),status=ref('loading'),playing=ref(false),background=ref(''),error=ref('');
let scene,abort,generation=0,timer;
async function start(){
  const current=++generation;clearTimeout(timer);abort?.abort();scene?.dispose();scene=null;
  abort=new AbortController();status.value='loading';background.value='';
  const work=async()=>{
    const base=new URL(import.meta.env.BASE_URL,location.origin).href;
    const config=await loadConfig(route.query,base,{getItem:key=>sessionStorage.getItem(key)},abort.signal);
    const {createScene}=await import('../features/kaiwu/scene');
    if(current!==generation)return;
    background.value=config.bgPath||'';playing.value=!!config.autoPlay;
    scene=createScene(container.value,config,{debug:route.query.debug==='1',onPlayingChange:value=>{playing.value=value;},onError:reason=>{
      if(current!==generation)return;
      generation++;clearTimeout(timer);abort.abort();error.value=errorKey(reason);status.value='failed';
    }});await scene.ready;
  };
  let timeoutId;
  try{
    await Promise.race([work(),new Promise((_,reject)=>{timeoutId=setTimeout(()=>reject(failure('timeout')),30000);timer=timeoutId;})]);
    if(current===generation)status.value='ready';
  }catch(reason){
    if(current===generation){generation++;abort.abort();scene?.dispose();scene=null;error.value=errorKey(reason);status.value='failed';}
  }finally{clearTimeout(timeoutId);}
}
function toggle(){playing.value=!playing.value;scene?.setPlaying(playing.value);}
onMounted(start);watch(()=>route.fullPath,()=>{if(container.value)start();});
onBeforeUnmount(()=>{generation++;clearTimeout(timer);abort?.abort();scene?.dispose();});
</script>
<template>
  <SiteLayout :title="$t('kaiwuViewer.title')" back-to="/projects/kaiwu">
    <template #subtitle>KaiwuArt</template>
    <div class="kaiwu-page content-stack">
      <nav class="kaiwu-nav" :aria-label="$t('accessibility.navigation')">
        <RouterLink to="/projects">{{ $t('kaiwuViewer.projects') }}</RouterLink>
        <RouterLink :to="{name:'KaiwuHome'}">{{ $t('kaiwuViewer.configure') }}</RouterLink>
      </nav>
      <div ref="container" class="kaiwu-stage" :data-state="status" :aria-busy="status==='loading'" :style="background ? {backgroundImage:'url('+JSON.stringify(background)+')'} : {}" />
      <p v-if="status==='loading'" class="kaiwu-status" role="status">{{ $t('kaiwuViewer.loading') }}</p>
      <div v-if="status==='failed'" class="kaiwu-status" role="alert"><p>{{ $t(error) }}</p><button @click="start">{{ $t('kaiwuViewer.retry') }}</button><RouterLink :to="{name:'KaiwuHome'}">{{ $t('kaiwuViewer.configure') }}</RouterLink></div>
      <div class="kaiwu-controls"><button :disabled="status!=='ready'" :aria-pressed="playing" @click="toggle">{{ $t(playing?'kaiwuViewer.pause':'kaiwuViewer.play') }}</button><button :disabled="status!=='ready'" @click="scene?.reset()">{{ $t('kaiwuViewer.reset') }}</button></div>
    </div>
  </SiteLayout>
</template>
