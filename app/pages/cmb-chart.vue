<template>
  <div class="container">
    <h1>CMB Power Spectrum Visualization</h1>

    <div v-if="loading" class="loading">Loading data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="charts-grid">
      <div class="chart-container">
        <h2>Multipole Moments vs Angular Scale</h2>
        <Scatter
          v-if="multipoleData"
          :data="multipoleData"
          :options="multipoleOptions"
        />
      </div>

      <div class="chart-container">
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
        <Line v-if="cmbData" :data="cmbData" :options="cmbOptions" />
      </div>
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
import { Scatter, Line } from "vue-chartjs";

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
const multipoleData = ref(null);
const cmbData = ref(null);
const dmValues = ref("0.10,0.12,0.15");

const multipoleOptions = {
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

const cmbOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: "logarithmic",
      min: 2,
      max: 2500,
      title: { display: true, text: "Multipole Moment (ℓ)" },
    },
    y: {
      title: { display: true, text: "Power Spectrum ΔT (μK)" },
    },
  },
};

// Fetch Multipole Data
async function fetchMultipoleData() {
  try {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase;

    const res = await $fetch(`${baseUrl}/multipole-plot`);
    multipoleData.value = {
      datasets: [
        {
          label: "Multipole Moments",
          data: res.ell_values.map((ell, i) => ({
            x: ell,
            y: res.angular_scales[i],
          })),
          backgroundColor: "red",
        },
      ],
    };
  } catch (e) {
    console.error(e);
    error.value = "Failed to load multipole data";
  }
}

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
  await Promise.all([fetchMultipoleData(), fetchCmbData()]);
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

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.chart-container {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
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
