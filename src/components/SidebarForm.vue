<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { groupRgbValues, quantizeColors } from './../lib/color'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const imageUrl = ref('')
const imageName = ref('')
const formErrors = ref<string[]>([])
const colorDepth = ref(4)

const emitColors = defineEmits(['generateColors'])

let ctx: CanvasRenderingContext2D | null | undefined

onMounted(() => {
  ctx = canvasRef.value?.getContext('2d', { willReadFrequently: true })
})

const onFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file?.type.startsWith('image/')) {
    const reader = new FileReader()

    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string
      imageName.value = file.name
    }

    reader.readAsDataURL(file)
  }
}

const validateForm = () => {
  formErrors.value = []
  if (!imageUrl.value) {
    formErrors.value.push('No image selected!')
  } else if (!colorDepth.value) {
    formErrors.value.push('No. of colors in the palette is not selected!')
  }
}

const generatePalette = (event: Event) => {
  event.preventDefault()

  validateForm()
  if (formErrors.value.length) {
    return
  }

  if (ctx) {
    const image = new Image()
    image.src = imageUrl.value
    image.crossOrigin = 'Anonymus'
    image.addEventListener('load', () => {
      if (canvasRef.value) {
        canvasRef.value.style.height = `${150}px`
        canvasRef.value.style.width = `${150}px`
      }
      ctx?.drawImage(image, 0, 0, 150, 150)
      const imageData = ctx?.getImageData(0, 0, 150, 150)

      if (imageData?.data) {
        const rgbValues = groupRgbValues(imageData.data)
        const quantizedColors = quantizeColors(rgbValues, 0, colorDepth.value)
        emitColors('generateColors', [...new Set(quantizedColors)])
      }
    })
  }
}
</script>

<template>
  <div class="sidebar">
    <h1 class="title">Color Maestro</h1>
    <p class="description">
      Color Maestro will create a fancy color palette from your favorite image. <br />
      Please, upload a .jpeg or .png image up to 1MB in size.
    </p>

    <div class="flex">
      <label for="fileUpload" class="gloom-button mini-button">Select file</label>
      <input
        id="fileUpload"
        accept=".png,.jpeg"
        class="uploader"
        type="file"
        @change="onFileUpload"
      />

      <p class="upload-info" v-if="imageName">
        <font-awesome-icon icon="fa-solid fa-check-circle" class="mint" />
        {{ imageName }} was successfully uploaded!
      </p>
    </div>

    <!-- <font-awesome-icon icon="fa-solid fa-user-secret" /> -->

    <p class="description">How many colors in the palette?</p>

    <div class="color-depth-container">
      <button
        class="wine-button"
        :class="{ pressed: colorDepth === 1 }"
        type="button"
        @click="colorDepth = 1"
      >
        2
      </button>
      <button
        class="seaside-button"
        :class="{ pressed: colorDepth === 2 }"
        type="button"
        @click="colorDepth = 2"
      >
        4
      </button>
      <button
        class="mint-button"
        :class="{ pressed: colorDepth === 3 }"
        type="button"
        @click="colorDepth = 3"
      >
        8
      </button>
      <button
        class="sunrise-button"
        :class="{ pressed: colorDepth === 4 }"
        type="button"
        @click="colorDepth = 4"
      >
        16
      </button>
    </div>

    <p class="description">Select the Color quantization algorithm:</p>

    <div class="method-container">
      <button class="gloom-button" type="button" @click="generatePalette">
        Median Cut Algorithm
      </button>

      <button class="gloom-button" type="button">K-Means Clustering</button>
    </div>

    <button class="seaside-button" type="button" @click="generatePalette">Generate palette</button>

    <div class="error-wrapper">
      <div v-for="(error, index) in formErrors" :key="index">
        {{ error }}
      </div>
    </div>
  </div>

  <canvas ref="canvasRef" class="canvas" />
</template>

<style scoped lang="scss">
@mixin fancy-button($color) {
  position: relative;
  display: block;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  font-family: inherit;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 800;
  color: var(--#{$color}A);
  border: 0;
  padding: 1em 2em;
  border: 2px solid var(--#{$color}A);
  border-radius: 1em;
  background-color: var(--#{$color}E);
  transform-style: preserve-3d;
  transition: all 175ms cubic-bezier(0, 0, 1, 1);

  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--#{$color}C);
    border-radius: inherit;
    box-shadow:
      0 0 0 2px var(--#{$color}B),
      0 0.75em 0 0 var(--#{$color}A);
    transform: translate3d(0, 0.75em, -1em);
    transition: all 175ms cubic-bezier(0, 0, 1, 1);
  }

  &:hover {
    background: var(--#{$color}D);
    transform: translate(0, 0.375em);

    &::before {
      transform: translate3d(0, 0.75em, -1em);
    }
  }

  &:active {
    transform: translate(0em, 0.75em);
  }

  &:active::before {
    transform: translate3d(0, 0, -1em);
    box-shadow:
      0 0 0 2px var(--#{$color}B),
      0 0.25em 0 0 var(--#{$color}B);
  }

  &.pressed {
    &:active {
      transform: none;
    }

    &::before {
      box-shadow: none;
      transform: translate3d(0, 0.25em, -1em);
    }

    &:active::before {
      transform: none;
      box-shadow: none;
    }
  }
}

.canvas {
  display: none;
}

.sidebar {
  place-items: center;
  grid-area: sidebar;
}

.description {
  font-size: 18px;
  padding: 16px 0;
}

.title {
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 0;
}

.upload-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  gap: 8px;
}

.input {
  position: relative;
  display: block;
  border: 2px solid var(--mintA);
  border-radius: 1em;
  margin-bottom: 16px;
  min-width: 320px;
  min-height: 40px;
  padding: 0px 16px;
}

.uploader {
  display: none;
}

.input:focus-visible {
  border: 2px solid var(--mintC);
  outline-color: var(--mintC);
}

.color-depth-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 16px;
  gap: 8px;
  font-size: 24px;
  margin-bottom: 24px;
}

.method-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 48px;
}

.mint {
  color: var(--mintC);
}

.mint-button {
  @include fancy-button('mint');
}

.wine-button {
  @include fancy-button('wine');
}

.sunrise-button {
  @include fancy-button('sunrise');
}

.seaside-button {
  @include fancy-button('seaside');
}

.gloom-button {
  @include fancy-button('gloom');
}

.mini-button {
  width: fit-content;
  margin-bottom: 32px;
}

.error-wrapper {
  margin-top: 32px;
  color: red;
  font-size: 28px;
}
</style>
