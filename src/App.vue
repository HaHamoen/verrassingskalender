<script setup lang="ts">
  import Header from './components/Header.vue';
  import CalendarGrid from './components/CalendarGrid.vue';
</script>

<template>
  <div class="app">
    <Header />
    <CalendarGrid />
  </div>
</template>

<style lang="scss" scoped>
  .app {
    min-height: 100vh;
  }
</style>
