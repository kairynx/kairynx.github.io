/**
 * 知识库数据：从 content/knowledge/*.md 自动读取
 * ------------------------------------------------------------------
 * 你只需要在 content/knowledge/ 下新建或编辑 .md 文件，页面自动更新。
 * 正文直接写 Markdown（标题、列表、代码块、表格都支持），文件头的 --- 里写元信息。
 * 文件名就是文章 id，决定详情页地址 /#/knowledge/<文件名>。
 */
import { estimateReadTime, idFromPath, parseFrontMatter, renderMarkdown, splitTags } from '../lib/markdown'

export interface Article {
  id: string
  title: string
  category: string
  tags: string[]
  date: string
  readTime: string
  summary: string
  /** 正文渲染后的 HTML */
  html: string
}

const files = import.meta.glob('/content/knowledge/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

export const articles: Article[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontMatter(raw)

    return {
      id: data.id || idFromPath(path),
      title: data.title || idFromPath(path),
      category: data.category || '未分类',
      tags: splitTags(data.tags),
      date: data.date || '',
      readTime: data.readTime || estimateReadTime(body),
      summary: data.summary || '',
      html: renderMarkdown(body)
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

/** 分类按钮：先「全部」，其余按文章数量从多到少 */
const countByCategory = (name: string) =>
  articles.filter((a) => a.category === name).length

export const categories: string[] = [
  '全部',
  ...Array.from(new Set(articles.map((a) => a.category))).sort(
    (a, b) => countByCategory(b) - countByCategory(a) || a.localeCompare(b, 'zh')
  )
]

export function getArticleById(id: string) {
  return articles.find((item) => item.id === id)
}

export function getArticlesByCategory(category: string) {
  return category === '全部' ? articles : articles.filter((a) => a.category === category)
}
