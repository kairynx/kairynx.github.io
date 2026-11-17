<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Calendar, Timer } from '@element-plus/icons-vue'
import { articles, getArticleById } from '../data/knowledge'

const route = useRoute()
const router = useRouter()

const article = computed(() => getArticleById(String(route.params.id)))

const related = computed(() => {
  if (!article.value) return []
  return articles
    .filter((a) => a.category === article.value!.category && a.id !== article.value!.id)
    .slice(0, 3)
})
</script>

<template>
  <div class="page">
    <div class="container narrow">
      <el-button text class="back" @click="router.push('/knowledge')">
        <el-icon><ArrowLeft /></el-icon>
        返回知识库
      </el-button>

      <template v-if="article">
        <article class="article">
          <div class="head">
            <el-tag size="small" effect="light" round>{{ article.category }}</el-tag>
            <h1>{{ article.title }}</h1>
            <p class="summary">{{ article.summary }}</p>
            <div class="meta">
              <span><el-icon><Calendar /></el-icon>{{ article.date }}</span>
              <span><el-icon><Timer /></el-icon>{{ article.readTime }}</span>
              <span class="tags">
                <em v-for="t in article.tags" :key="t">#{{ t }}</em>
              </span>
            </div>
          </div>

          <div class="body markdown" v-html="article.html"></div>
        </article>

        <section v-if="related.length" class="related">
          <h3>同类文章</h3>
          <div class="related-list">
            <router-link
              v-for="item in related"
              :key="item.id"
              :to="`/knowledge/${item.id}`"
              class="related-item"
            >
              <span>{{ item.title }}</span>
              <span class="mono">{{ item.date }}</span>
            </router-link>
          </div>
        </section>
      </template>

      <el-result
        v-else
        icon="warning"
        title="文章不存在"
        sub-title="链接可能已经失效，或者这篇文章被重命名了"
      >
        <template #extra>
          <el-button type="primary" @click="router.push('/knowledge')">回到知识库</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 34px 0 90px;
}

.narrow {
  max-width: 780px;
}

.back {
  margin-bottom: 18px;
  font-size: 13.5px;
  color: var(--ink-2);
}

.head {
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.head h1 {
  margin: 14px 0 12px;
  font-size: clamp(26px, 4vw, 34px);
  line-height: 1.35;
  letter-spacing: -0.8px;
  font-weight: 800;
}

.summary {
  margin: 0 0 16px;
  font-size: 15px;
  line-height: 1.85;
  color: var(--ink-2);
}

.meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12.5px;
  color: var(--ink-3);
  flex-wrap: wrap;
}

.meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.tags {
  gap: 10px;
}

.tags em {
  font-style: normal;
  color: var(--el-color-primary-light-3);
}

.body {
  padding-top: 10px;
}

.related {
  margin-top: 56px;
  padding-top: 26px;
  border-top: 1px solid var(--line);
}

.related h3 {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 700;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.related-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 16px;
  border: 1px solid var(--line);
  border-radius: 11px;
  font-size: 14px;
  color: var(--ink-2);
  transition: all 0.18s ease;
}

.related-item:hover {
  border-color: var(--el-color-primary-light-7);
  color: var(--brand);
  background: var(--el-color-primary-light-9);
}

.related-item .mono {
  font-size: 12px;
  color: var(--ink-3);
}
</style>
