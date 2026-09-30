// 全站内容数据：文案改动只需编辑此文件，组件不硬编码任何文案
import img01 from './assets/images/01.png'
import img01Light from './assets/images/01_light.png'
import img02 from './assets/images/02.png'
import img02Light from './assets/images/02_light.png'
import img03 from './assets/images/03.png'
import img03Light from './assets/images/03_light.png'
import img04 from './assets/images/04.png'
import img04Light from './assets/images/04_light.png'
import img05 from './assets/images/05.png'
import img05Light from './assets/images/05_light.png'

// 服务器基础信息
export const serverInfo = {
  name: 'CaCO3',
  slogan: '纯净生存 · 回归 MC 最本真的乐趣',
  description:
    '欢迎来到 CaCO3 服务器！超低门槛，纯原版即可直连进服；内置 Terralith 数据包，重塑壮丽山河，为你带来前所未有的丰富地形与绝美群系。',
}

// 首页四个特性卡片
export const features = [
  {
    icon: 'survival',
    title: '纯净生存',
    desc: '回归 Minecraft 最本真的乐趣，安心种田建造。',
  },
  {
    icon: 'door',
    title: '超低门槛',
    desc: '纯原版即可直连进服，无需繁琐的 Mod 加载器。',
  },
  {
    icon: 'package',
    title: '高度包容',
    desc: '支持自带个人整合包，也欢迎体验官方精心配置的整合包。',
  },
  {
    icon: 'mountain',
    title: 'Terralith 地形',
    desc: '内置 Terralith 数据包，壮丽山河与绝美群系等你探索。',
  },
] as const

// 截图画廊：dark / light 成对，按主题切换展示
export const gallery = [
  {
    dark: img01,
    light: img01Light,
    alt: '夜幕下山脚灯火通明的日式风格建筑群',
  },
  {
    dark: img02,
    light: img02Light,
    alt: '江南水乡风格的白墙黛瓦建筑群与跨海大桥夜景',
  },
  {
    dark: img03,
    light: img03Light,
    alt: '红墙金瓦的中式宫殿建筑群夜景全景',
  },
  {
    dark: img04,
    light: img04Light,
    alt: '雾夜中亮着烛光的哥特式石质大教堂',
  },
  {
    dark: img05,
    light: img05Light,
    alt: '悬浮在云海之上的大教堂与星空',
  },
]

// 测试时间线：文本逐字取自「服务器介绍.md」（九测日期待确认，先按原文录入）
export const timeline = [
  { name: '一测', period: '2021年12月～2022年7月' },
  { name: '二测', period: '2022年11月7号～2022年11月19号' },
  { name: '三测', period: '2022年11月25号～2022年12月2号' },
  { name: '四测', period: '2023年1月18号～2023年11月3号' },
  { name: '五测', period: '2024年1月1号～2024年3月1号' },
  { name: '六测', period: '2024年3月4号～2024年3月12号' },
  { name: '七测', period: '2024年4月2号～2024年4月4号' },
  { name: '八测', period: '2024年6月1号～2024年8月27号' },
  { name: '九测', period: '2024年1月5号～2024年3月2号' },
  { name: '十测', period: '2024年6月29号～2024年8月7号' },
  { name: '补测', period: '2024年8月12号～2025年2月7号（小卓郑某运营时期）' },
  { name: '十一测', period: '2025年1月19号～2026年2月01号' },
  { name: '十二测', period: '2026年2月9号～???', current: true },
] as const

// QQ 群信息（加入页使用）
export const qq = {
  group: '951244608',
  ipTip: '服务器IP：请从QQ群获取',
  version: 'Minecraft 1.21.11',
} as const
