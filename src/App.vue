<script setup lang="ts">
import { ref } from 'vue'
import Palette from './components/ColorPalette.vue'
import Sidebar from './components/SidebarForm.vue'
import type { TPixelColor } from './lib/color'

const colors = ref<TPixelColor[]>([])
</script>

<template>
  <main>
    <Sidebar @generateColors="(genColors) => (colors = genColors)" />
    <Palette :colors="colors" />
  </main>
</template>

<style scoped></style>
