<script setup>
import SiteLayout from '../layouts/SiteLayout.vue';
import ProfileIdentity from '../components/ProfileIdentity.vue';
import ContactLinks from '../components/ContactLinks.vue';
</script>
<template>
  <SiteLayout :title="$t('menu.about')">
    <template #subtitle>PANNIC</template>
    <section class="biography">
      <h2>{{ $t('home.name') }}</h2>
      <ProfileIdentity :show-name="false" />
      <div class="reading-copy">
        <p>{{ $t('about.background') }}</p>
        <p>{{ $t('about.practice') }}</p>
        <p>{{ $t('about.experience') }}</p>
      </div>
      <ContactLinks />
    </section>
  </SiteLayout>
</template>
<style scoped>
.biography { max-width: var(--reading-width); display: grid; gap: var(--space-block); }
</style>
