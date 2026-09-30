<script setup lang="ts">
import { timeline } from '../content'
</script>

<template>
  <section class="py-24">
    <div class="mx-auto max-w-3xl px-4 sm:px-6">
      <h2 class="text-center text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
        服务器历程
      </h2>
      <p class="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
        从 2021 年至今的每一次启程
      </p>

      <!-- 左竖线时间轴：条目按 content.ts 顺序渲染 -->
      <ol class="relative mt-12 space-y-8 border-l-2 border-slate-200 pl-8 dark:border-slate-700">
        <li v-for="t in timeline" :key="t.name" class="timeline-item relative">
          <!-- 时间轴圆点：进行中的测试用点缀色高亮 -->
          <span
            class="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-2"
            :class="
              'current' in t && t.current
                ? 'border-orange-500 bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.2)]'
                : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
            "
            aria-hidden="true"
          ></span>

          <h3
            class="flex flex-wrap items-center gap-2 text-lg font-semibold"
            :class="'current' in t && t.current ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'"
          >
            {{ t.name }}
            <!-- 进行中的测试加徽标 -->
            <span
              v-if="'current' in t && t.current"
              class="rounded-full bg-orange-600 px-2 py-0.5 text-xs font-medium text-white"
            >
              进行中
            </span>
          </h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ t.period }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
