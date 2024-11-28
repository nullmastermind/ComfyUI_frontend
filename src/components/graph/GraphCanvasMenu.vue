<template>
  <ButtonGroup
    class="p-buttongroup-horizontal fixed bottom-[10px] z-[1000] pointer-events-auto"
  >
    <Button
      severity="secondary"
      icon="pi pi-plus"
      v-tooltip.left="t('graphCanvasMenu.zoomIn')"
      @mousedown="repeat('Comfy.Canvas.ZoomIn')"
      @mouseup="stopRepeat"
    />
    <Button
      class="zoom-value"
      severity="secondary"
      v-tooltip.left="t('graphCanvasMenu.resetView')"
      @click="() => commandStore.execute('Comfy.Canvas.FitView')"
    >
      {{ zoomText }}
    </Button>
    <Button
      severity="secondary"
      icon="pi pi-minus"
      v-tooltip.left="t('graphCanvasMenu.zoomOut')"
      @mousedown="repeat('Comfy.Canvas.ZoomOut')"
      @mouseup="stopRepeat"
    />
    <Button
      severity="secondary"
      icon="pi pi-expand"
      v-tooltip.left="t('graphCanvasMenu.fitView')"
      @click="() => commandStore.execute('Comfy.Canvas.FitView')"
    />
    <Button
      severity="secondary"
      v-tooltip.left="
        t(
          'graphCanvasMenu.' +
            (canvasStore.canvas?.read_only ? 'panMode' : 'selectMode')
        ) + ' (Space)'
      "
      @click="() => commandStore.execute('Comfy.Canvas.ToggleLock')"
    >
      <template #icon>
        <i-material-symbols:pan-tool-outline
          v-if="canvasStore.canvas?.read_only"
        />
        <i-simple-line-icons:cursor v-else />
      </template>
    </Button>
  </ButtonGroup>
</template>

<script setup lang="ts">
import ButtonGroup from 'primevue/buttongroup'
import Button from 'primevue/button'
import { useCommandStore } from '@/stores/commandStore'
import { useCanvasStore } from '@/stores/graphStore'
import { useSettingStore } from '@/stores/settingStore'
import { useI18n } from 'vue-i18n'
import { LiteGraph } from '@comfyorg/litegraph'
import { computed, ref, onMounted, onUnmounted } from 'vue'

const { t } = useI18n()
const commandStore = useCommandStore()
const canvasStore = useCanvasStore()
const settingStore = useSettingStore()

const linkHidden = computed(
  () => settingStore.get('Comfy.LinkRenderMode') === LiteGraph.HIDDEN_LINK
)

let interval: number | null = null
const repeat = (command: string) => {
  if (interval) return
  const cmd = () => commandStore.execute(command)
  cmd()
  interval = window.setInterval(cmd, 100)
}
const stopRepeat = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

const currentZoom = ref(100)

const zoomText = computed(() => `${Math.round(currentZoom.value)}%`)

const updateZoom = () => {
  if (canvasStore.canvas) {
    currentZoom.value = canvasStore.canvas.ds.scale * 100
  }
}

onMounted(() => {
  if (canvasStore.canvas) {
    canvasStore.canvas.onDrawBackground = function () {
      updateZoom()
      if (this._old_onDrawBackground) {
        this._old_onDrawBackground.call(this)
      }
    }
  }
})

onUnmounted(() => {
  if (canvasStore.canvas) {
    canvasStore.canvas.onDrawBackground = null
  }
})
</script>

<style scoped>
.p-buttongroup-horizontal {
  display: flex;
  flex-direction: row;
  border-radius: var(--p-button-border-radius);
  overflow: hidden;
  border: 1px solid var(--p-panel-border-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  left: calc(50% - 100px);
}

.p-buttongroup-horizontal .p-button {
  margin: 0;
  border-radius: 0;
}

.zoom-value {
  width: 40px;
  font-size: small;
}
</style>
