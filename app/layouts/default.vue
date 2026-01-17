<template>
  <div
    class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
  >
    <header
      class="border-b border-gray-200 dark:border-gray-800 bg-white/75 dark:bg-gray-900/75 backdrop-blur-md sticky top-0 z-50"
    >
      <UContainer class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="group flex items-center gap-2">
          <UIcon
            name="i-heroicons-cube-transparent"
            class="w-8 h-8 text-primary-500 group-hover:rotate-12 transition-transform"
          />
          <span
            class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600"
          >
            CMB Darkmatter
          </span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-2">
          <UButton
            to="/"
            variant="ghost"
            color="gray"
            active-class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            Home
          </UButton>
          <UButton
            to="/multipole_moments"
            variant="ghost"
            color="gray"
            active-class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            Multipole Moments
          </UButton>
          <UButton
            to="/cmb_power_spectrum"
            variant="ghost"
            color="gray"
            active-class="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            CMB Power Spectrum
          </UButton>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Mobile Menu Button (Visible on small screens) -->
          <div class="md:hidden">
            <UButton
              icon="i-heroicons-bars-3"
              color="gray"
              variant="ghost"
              @click="isMenuOpen = !isMenuOpen"
            />
          </div>

          <ClientOnly>
            <UButton
              :icon="
                isDark
                  ? 'i-heroicons-moon-20-solid'
                  : 'i-heroicons-sun-20-solid'
              "
              color="gray"
              variant="ghost"
              aria-label="Theme"
              @click="isDark = !isDark"
              class="transition-transform hover:scale-110"
            />
            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>
        </div>
      </UContainer>

      <!-- Mobile Menu -->
      <div
        v-if="isMenuOpen"
        class="md:hidden border-t border-gray-200 dark:border-gray-800"
      >
        <div class="p-4 space-y-2 bg-white dark:bg-gray-900">
          <UButton
            to="/"
            block
            variant="ghost"
            color="gray"
            @click="isMenuOpen = false"
          >
            Home
          </UButton>
          <UButton
            to="/multipole_moments"
            block
            variant="ghost"
            color="gray"
            @click="isMenuOpen = false"
          >
            Multipole moments
          </UButton>
          <UButton
            to="/cmb_power_spectrum"
            block
            variant="ghost"
            color="gray"
            @click="isMenuOpen = false"
          >
            CMB Power Spectrum
          </UButton>
        </div>
      </div>
    </header>

    <main class="flex-grow py-8">
      <UContainer>
        <slot />
      </UContainer>
    </main>

    <footer
      class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8 mt-auto"
    >
      <UContainer>
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} StudyWithWoody. All rights
            reserved.
          </div>
          <div class="flex items-center gap-4">
            <UButton
              icon="i-simple-icons-github"
              color="gray"
              variant="ghost"
              to="https://github.com/woody1234567"
              target="_blank"
              aria-label="GitHub"
            />
          </div>
        </div>
      </UContainer>
    </footer>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const isMenuOpen = ref(false);

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

// Close mobile menu on route change
const route = useRoute();
watch(
  () => route.path,
  () => {
    isMenuOpen.value = false;
  },
);
</script>

<style>
/* Smooth transition for color mode changes */
body {
  @apply transition-colors duration-300;
}
</style>
