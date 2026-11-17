<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar, Clock } from '@element-plus/icons-vue'
import { interviewRecords, type InterviewRecord } from '../data/interview'

type ResultFilter = '全部' | InterviewRecord['result']

const filters: ResultFilter[] = ['全部', '已通过', '流程中', '未通过']
const activeFilter = ref<ResultFilter>('全部')

/** 每张卡片各自记录展开状态 */
const opened = ref<Record<string, string[]>>({})

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

            <el-collapse v-model="opened[item.id]" class="detail">
              <el-collapse-item name="q" title="面试题目">
                <div v-for="group in item.questions" :key="group.group" class="q-group">
                  <h4>{{ group.group }}</h4>
                  <ol>
                    <li v-for="(q, i) in group.items" :key="i">{{ q }}</li>
                  </ol>
                </div>
              </el-collapse-item>

              <el-collapse-item name="r" title="复盘与反思">
                <ul class="review">
                  <li v-for="(r, i) in item.review" :key="i">{{ r }}</li>
                </ul>
              </el-collapse-item>
            </el-collapse>
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

.q-group h4 {
  margin: 12px 0 6px;
  font-size: 13.5px;
  color: var(--brand);
}

.q-group ol,
.review {
  margin: 0;
  padding-left: 20px;
}

.q-group li,
.review li {
  font-size: 13.5px;
  line-height: 1.95;
  color: var(--ink-2);
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
