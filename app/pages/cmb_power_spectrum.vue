<template>
  <div class="container">
    <h1>CMB Power Spectrum Visualization</h1>

    <div v-if="loading" class="loading">Loading data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <div>
        <h2>CMB TT Power Spectrum</h2>
        <div class="controls">
          <label>Dark Matter Density (Ωc h²):</label>
          <input
            v-model="dmValues"
            type="text"
            placeholder="0.10,0.12,0.15"
            @change="fetchCmbData"
          />
          <button @click="fetchCmbData">Update</button>
        </div>
        <div class="chart-container">
          <Line v-if="cmbData" :data="cmbData" :options="cmbOptions" />
        </div>
      </div>
    </div>
    <UBlogPosts v-if="posts" :posts="posts" />
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

const cmbData = ref(null);
const dmValues = ref("0.10,0.12,0.15");

const cmbOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: "logarithmic",
      min: 15,
      max: 1000,
      title: { display: true, text: "Multipole Moment (ℓ)" },
    },
    y: {
      title: { display: true, text: "Power Spectrum ΔT (μK)" },
    },
  },
};

// Fetch CMB Spectrum Data
async function fetchCmbData() {
  try {
    loading.value = true;
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase;
    const res = await $fetch(
      `${baseUrl}/cmb-spectrum?dark_matter_values=${dmValues.value}`
    );

    cmbData.value = {
      labels: res.datasets[0].ell, // Use ell from first dataset as X-axis labels (approximate for line chart)
      datasets: res.datasets.map((ds) => ({
        label: `Ωc h² = ${ds.omch2}`,
        data: ds.tt.map((tt, i) => ({ x: ds.ell[i], y: tt })),
        borderColor: getRandomColor(),
        fill: false,
        pointRadius: 0, // Hide points for smooth line
      })),
    };
    loading.value = false;
  } catch (e) {
    console.error(e);
    error.value = "Failed to load CMB data";
    loading.value = false;
  }
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

onMounted(async () => {
  await fetchCmbData();
});

// Fetch Blog Posts from 'posts' collection
const { data: posts } = await useAsyncData(() =>
  queryCollection("posts").order("path", "ASC").all()
);
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

.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
}

input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0051a2;
}
</style>
