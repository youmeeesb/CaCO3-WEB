<script setup lang="ts">
import { qq, serverInfo } from '../content'
</script>

<template>
  <footer class="border-t border-slate-200 py-8 dark:border-slate-800">
    <div class="mx-auto max-w-6xl space-y-2 px-4 text-center text-sm text-slate-500 sm:px-6 dark:text-slate-400">
      <p class="font-semibold text-slate-700 dark:text-slate-200">{{ serverInfo.name }} 服务器</p>
      <p>QQ 交流群：{{ qq.group }} · {{ qq.ipTip }}</p>
      <p>© 2026 CaCO3 Server</p>
    </div>
  </footer>
</template>
