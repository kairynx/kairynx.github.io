<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Timer } from '@element-plus/icons-vue'
import { articles, categories } from '../data/knowledge'

const router = useRouter()
const activeCategory = ref<string>('全部')
const keyword = ref('')

const list = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return articles
    .filter((item) => activeCategory.value === '全部' || item.category === activeCategory.value)
    .filter((item) => {
      if (!kw) return true
      const text = [item.title, item.summary, item.category, ...item.tags].join(' ').toLowerCase()
      return text.includes(kw)
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
})

const countOf = (cat: string) =>
  cat === '全部' ? articles.length : articles.filter((a) => a.category === cat).length

const open = (id: string) => router.push(`/knowledge/${id}`)
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="page-head">
        <h1 class="section-title">知识库</h1>
        <p class="section-desc">
          把搞懂的知识点写成自己的话，附上可运行的代码和面试追问，方便随时回看。
        </p>

        <div class="toolbar">
          <el-radio-group v-model="activeCategory" class="cats">
            <el-radio-button v-for="c in categories" :key="c" :value="c">
              {{ c }} ({{ countOf(c) }})
            </el-radio-button>
          </el-radio-group>

          <el-input
            v-model="keyword"
            class="search"
            placeholder="搜索标题、标签、关键词"
            clearable
            :prefix-icon="Search"
          />
        </div>
      </header>

      <div v-if="list.length" class="grid">
        <article
          v-for="item in list"
          :key="item.id"
          class="card"
          @click="open(item.id)"
        >
          <div class="card-top">
            <el-tag size="small" effect="light" round>{{ item.category }}</el-tag>
            <span class="read mono">
              <el-icon><Timer /></el-icon>{{ item.readTime }}
            </span>
          </div>

          <h3>{{ item.title }}</h3>
          <p class="card-desc">{{ item.summary }}</p>

          <div class="card-foot">
            <div class="tags">
              <span v-for="t in item.tags" :key="t" class="tag">#{{ t }}</span>
            </div>
            <span class="date mono">{{ item.date }}</span>
          </div>
        </article>
      </div>

      <el-empty
        v-else
        :description="keyword ? `没有找到与「${keyword}」相关的文章` : '这个分类下还没有文章'"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 48px 0 90px;
}

.page-head {
  margin-bottom: 28px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.cats :deep(.el-radio-button__inner) {
  border-radius: 10px;
  border: 1px solid var(--line) !important;
  margin-right: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  box-shadow: none !important;
}

.cats :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  border-color: var(--brand) !important;
  background: var(--brand);
  box-shadow: 0 6px 16px rgba(79, 110, 247, 0.26) !important;
}

.search {
  width: 260px;
}

.search :deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px var(--line) inset;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: var(--el-color-primary-light-7);
  box-shadow: var(--shadow-md);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.read {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--ink-3);
}

.card h3 {
  margin: 0 0 10px;
  font-size: 16.5px;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: -0.2px;
}

.card-desc {
  margin: 0 0 18px;
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--ink-2);
  flex: 1;
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px dashed var(--line);
  flex-wrap: wrap;
}

.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  font-size: 12px;
  color: var(--el-color-primary-light-3);
}

.date {
  font-size: 12px;
  color: var(--ink-3);
}

@media (max-width: 640px) {
  .search {
    width: 100%;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
