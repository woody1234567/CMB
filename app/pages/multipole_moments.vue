<template>
  <div class="container">
    <h1>Multipole Moments Visualization</h1>

    <div v-if="loading" class="loading">Loading data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="chart-container">
      <h2>Multipole Moments vs Angular Scale</h2>
      <Line
        v-if="multipoleData"
        :data="multipoleData"
        :options="multipoleOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);

const loading = ref(true);
const error = ref("");
const multipoleData = ref<any>(null);

const multipoleOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: "logarithmic",
      title: { display: true, text: "Multipole Moment (ℓ)" },
    },
    y: {
      title: { display: true, text: "Angular Scale (θ in degrees)" },
    },
  },
};

// Fetch Multipole Data
async function fetchMultipoleData() {
  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase;

    const res: any = await $fetch(`${baseUrl}/multipole-plot`);
    multipoleData.value = {
      datasets: [
        {
          label: "Multipole Moments",
          data: res.ell_values.map((ell: number, i: number) => ({
            x: ell,
            y: res.angular_scales[i],
          })),
          backgroundColor: "red",
        },
      ],
    };
    loading.value = false;
  } catch (e) {
    console.error(e);
    error.value = "Failed to load multipole data";
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchMultipoleData();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.chart-container {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
  margin-bottom: 2rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: red;
}
</style>
