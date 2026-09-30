import { computed, ref, watchEffect } from 'vue'

// 主题三态：手动深色 / 手动浅色 / 跟随系统
export type ThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'caco3-theme'

// 模块级单例状态：所有组件共享同一份主题状态
const mode = ref<ThemeMode>(readStoredMode())
const media = window.matchMedia('(prefers-color-scheme: dark)')

// 系统偏好做成响应式数据：auto 模式下系统切换时，
// 依赖 isDark 的所有计算属性（<html> 类名与全部深浅配图）都会实时更新
const systemDark = ref(media.matches)
media.addEventListener('change', (e) => {
  systemDark.value = e.matches
})

// isDark 是唯一直接驱动 UI 的计算值：手动态看 mode，自动态看系统偏好
const isDark = computed(
  () => mode.value === 'dark' || (mode.value === 'auto' && systemDark.value),
)

function readStoredMode(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'light' || saved === 'dark' ? saved : 'auto'
}

// 把主题落到 <html> 的 dark 类上，Tailwind 的 dark: 变体据此生效
watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})

/** 在 深 → 浅 → 自动 之间循环切换；自动态不保留手动选择 */
function cycleMode() {
  mode.value = mode.value === 'dark' ? 'light' : mode.value === 'light' ? 'auto' : 'dark'
  if (mode.value === 'auto') {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(STORAGE_KEY, mode.value)
  }
}

export function useTheme() {
  return { mode, isDark, cycleMode }
}
