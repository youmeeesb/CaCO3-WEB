<script setup lang="ts">
import { features } from '../content'

// 内联 SVG 图标：按 content.ts 里的 icon 名映射到 24x24 描边路径
const icons: Record<string, string> = {
  survival: 'M12 21C6 16 3.5 12.5 3.5 9A4.5 4.5 0 0 1 12 6.6 4.5 4.5 0 0 1 20.5 9c0 3.5-2.5 7-8.5 12Z',
  door: 'M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M14 12h.01',
  package: 'M21 8 12 3 3 8v8l9 5 9-5V8ZM3.3 8.3 12 13l8.7-4.7M12 13v8',
  mountain: 'M3 20h18M5 20l5-11 3 5.5L15 11l4 9',
}
</script>

<template>
  <section id="features" class="scroll-mt-20 py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 class="text-center text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
        服务器特色
      </h2>

      <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <!-- 毛玻璃卡片：hover 时边框微微发亮 -->
        <div
          v-for="f in features"
          :key="f.title"
          class="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur transition hover:border-orange-400/70 dark:border-slate-700 dark:bg-white/5 dark:hover:border-orange-400/70"
        >
          <svg
            class="h-8 w-8 text-orange-600 dark:text-orange-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path :d="icons[f.icon]" />
          </svg>
          <h3 class="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{{ f.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
