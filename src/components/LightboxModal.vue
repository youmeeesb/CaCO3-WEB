<script setup lang="ts">
import { nextTick, ref, watch, onBeforeUnmount } from 'vue'

// 放大查看的图片；image 为 null 时弹层关闭
const props = defineProps<{ image: { src: string; alt: string } | null }>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDivElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)

// 焦点圈定：Tab 在弹层内循环，防止焦点逃出到背景页面
function trapFocus(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
    return
  }
  if (e.key !== 'Tab' || !dialog.value) return
  const focusables = dialog.value.querySelectorAll<HTMLElement>('button, [href]')
  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

// 打开时锁定页面滚动 + 监听键盘，关闭时还原
function onKeydown(e: KeyboardEvent) {
  trapFocus(e)
}

watch(
  () => props.image,
  async (img) => {
    if (img) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      closeBtn.value?.focus()
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="image"
      ref="dialog"
      role="dialog"
      aria-modal="true"
      :aria-label="image.alt"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      @click.self="emit('close')"
    >
      <figure class="max-h-full max-w-6xl">
        <img :src="image.src" :alt="image.alt" class="max-h-[85vh] w-auto rounded-xl shadow-2xl" />
        <figcaption class="mt-3 text-center text-sm text-slate-200">{{ image.alt }}</figcaption>
      </figure>

      <button
        ref="closeBtn"
        type="button"
        class="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        aria-label="关闭大图"
        @click="emit('close')"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  </Teleport>
</template>
