<script setup>
const { data: home } = await useAsyncData(() =>
  queryCollection("content").path("/").first()
);
</script>

<template>
  <div>
    <h1>Home</h1>
    <ContentRenderer v-if="home" :value="home" />
  </div>
</template>
