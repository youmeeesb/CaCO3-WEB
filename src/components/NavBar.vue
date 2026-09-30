<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const { mode, cycleMode } = useTheme()
const route = useRoute()

// 滚动后导航栏从透明变为毛玻璃
const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 8
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// 移动端汉堡菜单开合
const menuOpen = ref(false)

const links = [
  { to: '/', label: '主页' },
  { to: '/join', label: '加入我们' },
]

// 主题按钮的图标与提示文字按当前模式显示
const themeMeta = {
  dark: { title: '当前：深色模式（点击切换到浅色）', icon: 'moon' },
  light: { title: '当前：浅色模式（点击切换为跟随系统）', icon: 'sun' },
  auto: { title: '当前：跟随系统（点击切换到深色）', icon: 'auto' },
} as const
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="
      scrolled || menuOpen
        ? 'bg-white/70 shadow-sm backdrop-blur-md dark:bg-slate-900/70'
        : 'bg-transparent'
    "
  >
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <RouterLink to="/" class="text-lg font-bold tracking-wide text-slate-900 dark:text-white">
        CaCO<span class="text-orange-600 dark:text-orange-400">3</span>
      </RouterLink>

      <!-- 桌面端导航链接 -->
      <div class="hidden items-center gap-8 md:flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-sm transition-colors hover:text-orange-600 dark:hover:text-orange-400"
          :class="
            route.path === link.to
              ? 'font-semibold text-orange-600 dark:text-orange-400'
              : 'text-slate-600 dark:text-slate-300'
          "
        >
          {{ link.label }}
        </RouterLink>

        <!-- 主题循环切换按钮：深 → 浅 → 自动 -->
        <button
          type="button"
          class="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-200/60 hover:text-orange-600 dark:text-slate-300 dark:hover:bg-slate-700/60 dark:hover:text-orange-400"
          :title="themeMeta[mode].title"
          :aria-label="themeMeta[mode].title"
          @click="cycleMode()"
        >
          <svg v-if="mode === 'dark'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <svg v-else-if="mode === 'light'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <!-- 跟随系统：半月图标 -->
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" />
            <path d="M12 3v18" opacity="0.5" />
          </svg>
        </button>
      </div>

      <!-- 移动端汉堡按钮 -->
      <button
        type="button"
        class="rounded-md p-2 text-slate-700 md:hidden dark:text-slate-200"
        aria-label="切换菜单"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <svg v-if="!menuOpen" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <svg v-else class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </nav>

    <!-- 移动端抽屉菜单 -->
    <div v-show="menuOpen" class="border-t border-slate-200/60 px-4 pb-4 md:hidden dark:border-slate-700/60">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="block py-2 text-sm text-slate-600 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400"
        :class="route.path === link.to ? 'font-semibold text-orange-600 dark:text-orange-400' : ''"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </RouterLink>
      <button
        type="button"
        class="mt-2 flex w-full items-center gap-2 py-2 text-sm text-slate-600 dark:text-slate-300"
        @click="cycleMode()"
      >
        <span>{{ themeMeta[mode].title }}</span>
      </button>
    </div>
  </header>
</template>
