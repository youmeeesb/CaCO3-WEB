<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { gallery, heroQuotes, serverInfo } from '../content'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

// 满屏大图按主题取深色 / 浅色版本
const heroImage = computed(() => (isDark.value ? gallery[0].dark : gallery[0].light))

// 语句轮播：每 5 秒淡入淡出切换到下一句
const quoteIndex = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => {
    quoteIndex.value = (quoteIndex.value + 1) % heroQuotes.length
  }, 5000)
})
onUnmounted(() => clearInterval(timer))
const currentQuote = computed(() => heroQuotes[quoteIndex.value])
</script>

<template>
  <section class="relative flex min-h-screen items-center justify-center overflow-hidden">
    <!-- 背景大图：object-cover 适配各种屏幕比例 -->
    <img
      :src="heroImage"
      :alt="gallery[0].alt"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <!-- 渐变遮罩：浅色模式用白系、深色模式用黑系，保证标题在两种主题下都可读 -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/70 dark:from-black/40 dark:via-black/20 dark:to-black/70"
      aria-hidden="true"
    ></div>

    <div class="relative z-10 mx-auto max-w-3xl px-4 text-center text-slate-900 sm:px-6 dark:text-white">
      <h1 class="text-5xl font-bold tracking-wide drop-shadow-sm sm:text-7xl">
        {{ serverInfo.name }}
      </h1>

      <!-- 语句轮播：固定最小高度，长短句切换时按钮不跳动 -->
      <div class="mx-auto mt-4 flex min-h-32 max-w-2xl items-center justify-center sm:min-h-24">
        <Transition name="quote-fade" mode="out-in">
          <a
            v-if="currentQuote.url"
            :key="quoteIndex"
            :href="currentQuote.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-lg leading-relaxed underline decoration-white/40 underline-offset-4 transition hover:decoration-orange-400 sm:text-2xl"
          >
            {{ currentQuote.text }}
          </a>
          <p v-else :key="quoteIndex" class="text-lg leading-relaxed sm:text-2xl">
            {{ currentQuote.text }}
          </p>
        </Transition>
      </div>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <RouterLink
          to="/join"
          class="rounded-full bg-orange-600 px-7 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-500"
        >
          加入我们
        </RouterLink>
        <a
          href="#features"
          class="rounded-full border border-slate-900/25 px-7 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/50 dark:border-white/40 dark:hover:bg-white/10"
        >
          了解更多
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 轮播淡入淡出：0.5s 淡出旧句、淡入新句 */
.quote-fade-enter-active,
.quote-fade-leave-active {
  transition: opacity 0.5s ease;
}
.quote-fade-enter-from,
.quote-fade-leave-to {
  opacity: 0;
}
</style>
