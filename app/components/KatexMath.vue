<script setup lang="ts">
import katex from "katex";

const props = defineProps<{
  latex: string;
}>();

const html = computed(() => {
  try {
    return katex.renderToString(props.latex, {
      throwOnError: false,
      displayMode: false,
    });
  } catch (e) {
    console.error("KaTeX error:", e);
    return props.latex;
  }
});
</script>

<template>
  <span v-html="html" />
</template>
