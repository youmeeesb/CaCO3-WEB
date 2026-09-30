<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useTheme } from './composables/useTheme'

// 在根组件激活主题系统，保证整个应用共享同一状态
useTheme()
</script>

<template>
  <div class="min-h-screen bg-white text-slate-700 transition-colors dark:bg-[#0a0f1a] dark:text-slate-300">
    <NavBar />
    <RouterView />
    <SiteFooter />
  </div>
</template>
