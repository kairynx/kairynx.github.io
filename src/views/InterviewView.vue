<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar, Clock } from '@element-plus/icons-vue'
import { interviewRecords, type InterviewRecord } from '../data/interview'

type ResultFilter = '全部' | InterviewRecord['result']

const filters: ResultFilter[] = ['全部', '已通过', '流程中', '未通过']
const activeFilter = ref<ResultFilter>('全部')

/** 每张卡片各自记录展开状态：默认全部展开，避免内容藏在折叠里看不见 */
const opened = ref<Record<string, string[]>>(
  Object.fromEntries(
    interviewRecords.map((record) => [
      record.id,
      record.chapters.flatMap((chapter, ci) =>
        chapter.panels
          .map((panel, pi) => (panel.title ? `${ci}-${pi}` : ''))
          .filter(Boolean)
      )
    ])
  )
)

const list = computed(() =>
  activeFilter.value === '全部'
    ? interviewRecords
    : interviewRecords.filter((item) => item.result === activeFilter.value)
)

const tagType = (result: InterviewRecord['result']) => {
  if (result === '已通过') return 'success'
  if (result === '流程中') return 'warning'
  return 'info'
}

const countOf = (filter: ResultFilter) =>
  filter === '全部'
    ? interviewRecords.length
    : interviewRecords.filter((item) => item.result === filter).length
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="page-head">
        <h1 class="section-title">面经</h1>
        <p class="section-desc">
          真实面试记录：题目、当场没答上来的点、以及事后的复盘。持续更新中。
        </p>

        <el-radio-group v-model="activeFilter" class="filters">
          <el-radio-button v-for="f in filters" :key="f" :value="f">
            {{ f }} ({{ countOf(f) }})
          </el-radio-button>
        </el-radio-group>
      </header>

      <div v-if="list.length" class="records">
        <article v-for="item in list" :key="item.id" class="record">
          <div class="record-side">
            <div class="logo">{{ item.company.slice(0, 1) }}</div>
          </div>

          <div class="record-main">
            <div class="record-top">
              <div>
                <h2 class="company">
                  {{ item.company }}
                  <el-tag :type="tagType(item.result)" size="small" effect="light" round>
                    {{ item.result }}
                  </el-tag>
                </h2>
                <p class="position">{{ item.position }}</p>
              </div>
            </div>

            <div class="meta">
              <span><el-icon><Calendar /></el-icon>{{ item.date }}</span>
              <span><el-icon><Clock /></el-icon>{{ item.stage }}</span>
            </div>

            <p class="summary">{{ item.summary }}</p>

            <div class="tags">
              <el-tag v-for="t in item.tags" :key="t" size="small" effect="plain" round>
                {{ t }}
              </el-tag>
            </div>

            <div v-if="item.chapters.length" class="detail">
              <el-collapse v-model="opened[item.id]">
                <template v-for="(chapter, ci) in item.chapters" :key="ci">
                  <p v-if="chapter.title" class="chapter">{{ chapter.title }}</p>

                  <template v-for="(panel, pi) in chapter.panels" :key="pi">
                    <el-collapse-item v-if="panel.title" :name="`${ci}-${pi}`" :title="panel.title">
                      <!-- 正文来自仓库内的 md 文件，按 Markdown 渲染 -->
                      <div class="markdown panel" v-html="panel.html" />
                    </el-collapse-item>
                    <div v-else class="markdown panel" v-html="panel.html" />
                  </template>
                </template>
              </el-collapse>
            </div>
            <p v-else class="summary">这条记录还没有写正文。</p>
          </div>
        </article>
      </div>

      <el-empty v-else description="这里还没有记录" />
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 48px 0 90px;
}

.page-head {
  margin-bottom: 30px;
}

.filters {
  margin-top: 4px;
}

.filters :deep(.el-radio-button__inner) {
  border-radius: 10px;
  border: 1px solid var(--line) !important;
  margin-right: 8px;
  font-size: 13px;
  box-shadow: none !important;
}

.filters :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  border-color: var(--brand) !important;
  background: var(--brand);
  box-shadow: 0 6px 16px rgba(79, 110, 247, 0.28) !important;
}

.records {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.record {
  display: flex;
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.record:hover {
  border-color: var(--el-color-primary-light-7);
  box-shadow: var(--shadow-sm);
}

.logo {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: linear-gradient(135deg, rgba(79, 110, 247, 0.14), rgba(124, 92, 247, 0.14));
  color: var(--brand);
  font-size: 18px;
  font-weight: 800;
}

.record-main {
  flex: 1;
  min-width: 0;
}

.company {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 750;
}

.position {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink-2);
}

.meta {
  display: flex;
  gap: 18px;
  margin: 10px 0 12px;
  font-size: 12.5px;
  color: var(--ink-3);
  flex-wrap: wrap;
}

.meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.summary {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--ink-2);
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.detail {
  margin-top: 8px;
  border-top: 1px dashed var(--line);
  border-bottom: none;
}

.detail :deep(.el-collapse-item__header) {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-2);
  border-bottom: none;
  height: 44px;
}

.detail :deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

.detail :deep(.el-collapse-item__content) {
  padding-bottom: 8px;
}

/* 章节（正文里的 # 标题） */
.chapter {
  margin: 22px 0 4px;
  padding-bottom: 7px;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 1px;
  color: var(--ink-3);
  border-bottom: 1px solid var(--line);
}

.chapter:first-child {
  margin-top: 14px;
}

/* 小节正文：复用全局 .markdown 的排版，字号收紧一点 */
.panel {
  font-size: 14px;
  line-height: 1.9;
}

.panel :deep(> *:first-child) {
  margin-top: 0;
}

.panel :deep(h1),
.panel :deep(h2),
.panel :deep(h3),
.panel :deep(h4) {
  margin: 18px 0 8px;
  padding-left: 0;
  font-size: 14.5px;
}

.panel :deep(h1)::before,
.panel :deep(h2)::before {
  display: none;
}

.panel :deep(p) {
  margin-bottom: 10px;
}

.panel :deep(ul),
.panel :deep(ol) {
  margin-bottom: 10px;
}

.panel :deep(hr) {
  margin: 18px 0;
  border: none;
  border-top: 1px dashed var(--line);
}

/* 正文末尾/开头的分隔线不占位，避免每块底部拖出一段空白 */
.panel :deep(> hr:first-child),
.panel :deep(> hr:last-child) {
  display: none;
}

@media (max-width: 640px) {
  .record {
    padding: 20px 16px;
  }
  .record-side {
    display: none;
  }
}
</style>
