<script setup lang="ts">
import { computed, ref } from 'vue'
import joinImg from '../assets/images/join.jpg'
import joinImgLight from '../assets/images/join_light.jpg'
import { qq, serverInfo } from '../content'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()
// 二维码图片按主题切换；用 computed 保证切换主题时实时更新
const qrImage = computed(() => (isDark.value ? joinImg : joinImgLight))

// 加入服务器的三个步骤（大数字引导）
const steps = [
  { title: '下载游戏', desc: `下载并安装 ${qq.version}。` },
  { title: '添加服务器', desc: '纯原版玩家直接添加服务器 IP 即可进服，无需任何 Mod。' },
  { title: '加入群聊', desc: '想优化体验？欢迎在 QQ 群下载官方精心配置的整合包。' },
]

// 复制群号：优先剪贴板 API，失败降级为手动复制提示
const copyState = ref<'idle' | 'done' | 'fallback'>('idle')
const groupNo = qq.group

async function copyGroup() {
  try {
    await navigator.clipboard.writeText(groupNo)
    copyState.value = 'done'
  } catch {
    copyState.value = 'fallback'
  }
  // 提示 2.5 秒后恢复初始文案
  setTimeout(() => (copyState.value = 'idle'), 2500)
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
    <h1 class="text-center text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
      加入 {{ serverInfo.name }}
    </h1>
    <p class="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
      三步开始你的生存之旅
    </p>

    <div class="mt-14 grid items-start gap-10 lg:grid-cols-5">
      <!-- 左侧：三步指引（占 3/5） -->
      <div class="space-y-8 lg:col-span-3">
        <ol class="space-y-8">
          <li
            v-for="(s, i) in steps"
            :key="s.title"
            class="flex gap-5 rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur dark:border-slate-700 dark:bg-white/5"
          >
            <!-- 大数字步骤标记 -->
            <span class="text-4xl font-bold leading-none text-orange-600 dark:text-orange-400" aria-hidden="true">
              {{ i + 1 }}
            </span>
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">{{ s.title }}</h2>
              <p class="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{{ s.desc }}</p>
            </div>
          </li>
        </ol>

        <!-- IP 提示：按内容约定，IP 从 QQ 群获取 -->
        <div class="rounded-2xl border border-dashed border-orange-400/60 bg-orange-50/60 p-5 text-sm text-slate-700 dark:bg-orange-500/10 dark:text-slate-300">
          {{ qq.ipTip }}
        </div>
      </div>

      <!-- 右侧：QQ 群二维码卡片（占 2/5） -->
      <aside class="rounded-2xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur lg:col-span-2 dark:border-slate-700 dark:bg-white/5">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">QQ 交流群</h2>
        <img
          :src="qrImage"
          alt="CaCO3服务器交流群 QQ 群二维码"
          class="mx-auto mt-6 w-56 rounded-xl shadow-md"
        />
        <p class="mt-6 text-2xl font-bold tracking-widest text-slate-900 dark:text-white">{{ groupNo }}</p>

        <button
          type="button"
          class="mt-4 w-full rounded-full bg-orange-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          @click="copyGroup"
        >
          {{ copyState === 'done' ? '✓ 已复制群号' : copyState === 'fallback' ? '复制失败，请手动复制群号' : '复制群号' }}
        </button>
        <p class="mt-4 text-xs text-slate-500 dark:text-slate-400">
          加群请备注来意，进群后从群公告获取服务器地址
        </p>
      </aside>
    </div>
  </main>
</template>
