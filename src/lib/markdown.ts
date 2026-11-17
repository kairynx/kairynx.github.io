/**
 * 极简 Markdown 工具：解析文件头的 --- 元信息，正文交给 marked 渲染。
 * 用相对路径 + import.meta.glob 在构建期把 content/ 下的 md 全部读进来。
 */
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

export interface ParsedFile {
  /** 文件头 --- 之间的 key: value */
  data: Record<string, string>
  /** 去掉文件头之后的正文 */
  body: string
}

export function parseFrontMatter(raw: string): ParsedFile {
  const text = raw.replace(/\r\n/g, '\n')
  const matched = /^---\n([\s\S]*?)\n---\n?/.exec(text)

  if (!matched) return { data: {}, body: text.trim() }

  const data: Record<string, string> = {}
  for (const line of matched[1].split('\n')) {
    const pair = /^([A-Za-z0-9_-]+)\s*[:：]\s*(.*)$/.exec(line.trim())
    if (!pair) continue
    data[pair[1]] = pair[2].replace(/^["']|["']$/g, '').trim()
  }

  return { data, body: text.slice(matched[0].length).trim() }
}

/** "JS 基础, 网络" → ['JS 基础', '网络'] */
export function splitTags(value?: string): string[] {
  if (!value) return []
  return value
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function renderMarkdown(body: string): string {
  return marked.parse(body, { async: false }) as string
}

/** 文件头没写 readTime 时，按中英文混排粗略估算（技术文按 200 字/分钟偏保守） */
export function estimateReadTime(body: string): string {
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) || []).length
  const words = (body.match(/[a-zA-Z0-9_]+/g) || []).length
  const minutes = Math.max(1, Math.round(cjk / 200 + words / 100))
  return `${minutes} min`
}

/** 文件名（不含扩展名）作为默认 id */
export function idFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}
