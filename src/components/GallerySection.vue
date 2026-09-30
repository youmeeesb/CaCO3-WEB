<script setup lang="ts">
import { computed, ref } from 'vue'
import { gallery } from '../content'
import { useTheme } from '../composables/useTheme'
import LightboxModal from './LightboxModal.vue'

const { isDark } = useTheme()

// 每张图按主题取深 / 浅版本
const images = computed(() =>
  gallery.map((g) => ({ src: isDark.value ? g.dark : g.light, alt: g.alt })),
)

// 当前放大查看的图片索引；null 表示弹层关闭
const activeIndex = ref<number | null>(null)
const active = computed(() => (activeIndex.value === null ? null : images.value[activeIndex.value]))

function open(index: number) {
  activeIndex.value = index
}
function close() {
  activeIndex.value = null
}
</script>

<template>
  <section class="py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 class="text-center text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
        服务器风景
      </h2>
      <p class="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">点击图片可放大查看</p>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="(img, i) in images"
          :key="img.alt"
          type="button"
          class="group overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          :aria-label="'放大查看：' + img.alt"
          @click="open(i)"
        >
          <!-- hover 轻微上浮 + 图片放大 -->
          <img
            :src="img.src"
            :alt="img.alt"
            loading="lazy"
            class="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:shadow-xl"
          />
        </button>
      </div>
    </div>

    <LightboxModal :image="active" @close="close" />
  </section>
</template>
