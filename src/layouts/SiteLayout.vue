<script setup>
import SiteHeader from '../components/layout/SiteHeader.vue';
import '../styles/portfolio.css';
defineProps({ title: String, portfolio: Boolean, backTo: String, showHome: {type: Boolean, default: true} });
</script>
<template>
  <div class="page-container" :class="{'portfolio-layout': portfolio}">
    <SiteHeader :title="title" :back-to="backTo" :show-home="showHome"><slot name="subtitle" /></SiteHeader>
    <main id="main-content" tabindex="-1"><slot /></main>
  </div>
</template>
