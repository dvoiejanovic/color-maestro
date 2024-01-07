<script setup lang="ts">
import type { TPixelColor } from '@/lib/color'
import ColorTile from './ColorTile.vue'
const props = defineProps<{ colors: TPixelColor[] }>()
</script>

<template>
  <div class="palette">
    <ColorTile v-for="(color, index) in props.colors" :key="index" :color="color" />
  </div>
</template>

<style scoped>
.palette {
  grid-area: palette;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
}
</style>
