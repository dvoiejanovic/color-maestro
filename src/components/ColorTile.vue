<script setup lang="ts">
import { rgbToHex, type TPixelColor } from '@/lib/color'

const props = defineProps<{ color: TPixelColor }>()
const hex = rgbToHex(props.color)
const { r, g, b } = props.color
const luminance = (0.212 * r + 0.701 * g + 0.087 * b) / 255

const copyToClipboard = () => {
  navigator.clipboard.writeText(hex)
}
</script>

<template>
  <div class="tile" role="button" :style="{ backgroundColor: hex }" @click="copyToClipboard">
    <span class="text" :class="{ light: luminance <= 0.5, dark: luminance > 0.5 }">
      {{ hex }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.text {
  display: none;
  text-transform: uppercase;
  font-size: 24px;

  &.light {
    color: white;
  }

  &.dark {
    color: black;
  }
}

.tile {
  display: block;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    .text {
      display: inline-block;
    }
  }
}
</style>
