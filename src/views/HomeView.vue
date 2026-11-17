<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Collection, Reading } from '@element-plus/icons-vue'
import { articles } from '../data/knowledge'
import { interviewRecords } from '../data/interview'

const router = useRouter()

const latestArticles = computed(() =>
  [...articles]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3)
)

const stats = computed(() => [
  { label: '面经', value: interviewRecords.length, unit: '篇' },
  { label: '知识库文章', value: articles.length, unit: '篇' },
  { label: '覆盖分类', value: new Set(articles.map((a) => a.category)).size, unit: '个' }
])

const go = (path: string) => router.push(path)
</script>

<template>
  <div class="home">
    <!-- ================= Hero ================= -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true">
        <span class="blob blob-1"></span>
        <span class="blob blob-2"></span>
        <span class="grid-mask"></span>
      </div>

      <div class="container hero-inner">
        <p class="eyebrow">
          <span class="pulse"></span>
          前端开发 · 面经 &amp; 知识沉淀
        </p>

        <h1 class="title">
          hello, world<span class="cursor">!</span>
        </h1>

        <p class="desc">
          我是 Kairynx，一名前端开发者。<br />
          这里存放我准备面试时的复盘记录，和那些「搞懂了就该写下来」的知识点。
        </p>

        <!-- 两个入口按钮 -->
        <div class="actions">
          <el-button
            type="primary"
            size="large"
            class="btn-main"
            @click="go('/interview')"
          >
            <el-icon class="btn-icon"><Reading /></el-icon>
            面经 · Interview
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>

          <el-button size="large" class="btn-ghost" @click="go('/knowledge')">
            <el-icon class="btn-icon"><Collection /></el-icon>
            知识库 · Knowledge
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>

        <div class="stats">
          <div v-for="s in stats" :key="s.label" class="stat">
            <strong>{{ s.value }}</strong>
            <span>{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 两个模块入口 ================= -->
    <section class="container entries">
      <div class="entry-card" @click="go('/interview')">
        <div class="entry-icon entry-icon--blue">
          <el-icon><Reading /></el-icon>
        </div>
        <h3>面经</h3>
        <p>每一场面试的题目清单、当场答不上的点，以及事后的复盘。真实记录，不做美化。</p>
        <span class="entry-more">共 {{ interviewRecords.length }} 篇记录 →</span>
      </div>

      <div class="entry-card" @click="go('/knowledge')">
        <div class="entry-icon entry-icon--purple">
          <el-icon><Collection /></el-icon>
        </div>
        <h3>知识库</h3>
        <p>JavaScript、计算机网络、工程化、框架原理的整理，带代码和结论，方便面试前快速过一遍。</p>
        <span class="entry-more">共 {{ articles.length }} 篇文章 →</span>
      </div>
    </section>

    <!-- ================= 最新文章 ================= -->
    <section class="container latest">
      <h2 class="section-title">最近更新</h2>
      <p class="section-desc">刚整理完的几篇，点进去可以直接看全文。</p>

      <div class="latest-list">
        <router-link
          v-for="item in latestArticles"
          :key="item.id"
          :to="`/knowledge/${item.id}`"
          class="latest-item"
        >
          <div class="latest-main">
            <div class="latest-head">
              <el-tag size="small" effect="plain" round>{{ item.category }}</el-tag>
              <h4>{{ item.title }}</h4>
            </div>
            <p class="latest-summary">{{ item.summary }}</p>
          </div>
          <span class="latest-date mono">{{ item.date }}</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  padding: 92px 0 76px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.55;
}

.blob-1 {
  width: 460px;
  height: 460px;
  top: -180px;
  left: -80px;
  background: radial-gradient(circle, rgba(79, 110, 247, 0.35), transparent 70%);
}

.blob-2 {
  width: 420px;
  height: 420px;
  top: -120px;
  right: -100px;
  background: radial-gradient(circle, rgba(124, 92, 247, 0.28), transparent 70%);
}

.grid-mask {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(28, 32, 51, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(28, 32, 51, 0.045) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 40%, transparent 100%);
}

.hero-inner {
  position: relative;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 18px;
  padding: 7px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  color: var(--ink-2);
  backdrop-filter: blur(6px);
}

.pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34c759;
  box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.18);
}

.title {
  margin: 0 0 18px;
  font-size: clamp(46px, 8vw, 88px);
  line-height: 1.04;
  letter-spacing: -0.045em;
  font-weight: 800;
  background: linear-gradient(120deg, #1c2033 15%, #4f6ef7 55%, #7c5cf7 85%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cursor {
  display: inline-block;
  margin-left: 2px;
  color: var(--brand);
  -webkit-text-fill-color: var(--brand);
  animation: blink 1.15s steps(1) infinite;
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.desc {
  margin: 0 0 34px;
  max-width: 640px;
  font-size: 16.5px;
  line-height: 1.85;
  color: var(--ink-2);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.actions :deep(.el-button) {
  height: 50px;
  padding: 0 26px;
  border-radius: 13px;
  font-size: 15px;
  font-weight: 600;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.btn-main {
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  border: none;
  box-shadow: 0 10px 26px rgba(79, 110, 247, 0.32);
}

.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(79, 110, 247, 0.4);
}

.btn-ghost {
  background: #fff;
  border: 1px solid var(--line);
  color: var(--ink);
  box-shadow: var(--shadow-sm);
}

.btn-ghost:hover {
  transform: translateY(-2px);
  border-color: var(--el-color-primary-light-5);
  color: var(--brand);
  background: #fff;
}

.btn-icon {
  margin-right: 8px;
  font-size: 17px;
}

.actions :deep(.el-icon--right) {
  margin-left: 8px;
  margin-right: 0;
}

.stats {
  display: flex;
  gap: 38px;
  margin-top: 46px;
  padding-top: 26px;
  border-top: 1px dashed var(--line);
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stat strong {
  font-size: 24px;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.5px;
}

.stat span {
  font-size: 13px;
  color: var(--ink-3);
}

/* ---------- 入口卡片 ---------- */
.entries {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding-bottom: 26px;
}

.entry-card {
  position: relative;
  padding: 26px 26px 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.entry-card:hover {
  transform: translateY(-3px);
  border-color: var(--el-color-primary-light-7);
  box-shadow: var(--shadow-md);
}

.entry-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 20px;
  margin-bottom: 16px;
}

.entry-icon--blue {
  background: rgba(79, 110, 247, 0.1);
  color: var(--brand);
}

.entry-icon--purple {
  background: rgba(124, 92, 247, 0.1);
  color: var(--brand-2);
}

.entry-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
}

.entry-card p {
  margin: 0 0 16px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--ink-2);
}

.entry-more {
  font-size: 13px;
  font-weight: 600;
  color: var(--brand);
}

/* ---------- 最新文章 ---------- */
.latest {
  padding: 34px 24px 90px;
}

.latest-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.latest-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 22px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  transition: all 0.18s ease;
}

.latest-item:hover {
  border-color: var(--el-color-primary-light-7);
  box-shadow: var(--shadow-sm);
  transform: translateX(3px);
}

.latest-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.latest-head h4 {
  margin: 0;
  font-size: 15.5px;
  font-weight: 650;
}

.latest-summary {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--ink-3);
}

.latest-date {
  flex-shrink: 0;
  font-size: 12.5px;
  color: var(--ink-3);
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 0 52px;
  }
  .entries {
    grid-template-columns: 1fr;
  }
  .latest-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .stats {
    gap: 24px;
  }
  .actions :deep(.el-button) {
    flex: 1 1 100%;
    min-width: 0;
  }
  .actions :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}
</style>
