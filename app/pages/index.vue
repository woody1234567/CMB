<script setup>
const { data: home } = await useAsyncData(() =>
  queryCollection("content").path("/").first()
);
</script>

<template>
  <UContainer class="py-12">
    <div class="text-center mb-12">
      <h1
        class="text-4xl font-bold mb-4 text-primary-600 dark:text-primary-400"
      >
        Cosmic Microwave Background & Dark Matter
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        Exploring the Echoes of the Early Universe and the Influence of Dark
        Matter
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <UCard>
        <template #header>
          <div class="font-bold text-lg">What is the CMB?</div>
        </template>
        <p class="text-gray-600 dark:text-gray-300">
          The Cosmic Microwave Background (CMB) is the remnant thermal radiation
          from the Big Bang, filling the entire universe. By observing the CMB
          power spectrum, we can decipher the composition and evolutionary
          history of the early universe.
        </p>
      </UCard>

      <UCard>
        <template #header>
          <div class="font-bold text-lg">The Influence of Dark Matter</div>
        </template>
        <p class="text-gray-600 dark:text-gray-300">
          Dark matter does not interact with the electromagnetic force but
          influences matter distribution through gravity. In this project, you
          can adjust the dark matter density (<KatexMath
            latex="\Omega_c h^2"
          />) and observe how it alters the characteristic peaks of the CMB
          power spectrum.
        </p>
      </UCard>
    </div>

    <div class="text-center">
      <UButton
        icon="i-heroicons-chart-bar"
        size="xl"
        to="/cmb_power_spectrum"
        color="primary"
      >
        Start Exploring Power Spectrum
      </UButton>
    </div>
  </UContainer>
</template>
