<template>
  <div class="container">
    <UButton
      to="/cmb_power_spectrum"
      icon="i-heroicons-arrow-left-20-solid"
      color="gray"
      variant="ghost"
      class="mb-4"
    >
      Back to CMB Power Spectrum
    </UButton>

    <div v-if="post">
      <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
      <div class="text-gray-500 mb-6">
        {{ new Date(post.date).toLocaleDateString() }}
      </div>

      <div class="prose max-w-none">
        <ContentRenderer :value="post" />
      </div>
    </div>
    <div v-else>Post not found</div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection("posts").path(route.path).first();
});

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
