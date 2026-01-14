// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxt/ui", "@nuxt/content"],
  css: ["~/assets/css/main.css", "katex/dist/katex.min.css"],
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:8000"
          : "https://cmb-three.vercel.app",
    },
  },
});
