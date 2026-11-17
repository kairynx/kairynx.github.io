/**
 * 面经数据：从 content/interview/*.md 自动读取
 * ------------------------------------------------------------------
 * 你只需要在 content/interview/ 下新建或编辑 .md 文件，页面自动更新。
 * 文件名就是这条记录的唯一 id，删掉文件即删除记录。
 *
 * 正文规则（尽量宽松，写什么显示什么）：
 *   # 章节标题      → 卡片里的一个分组标签
 *   ## 小节标题     → 一个可折叠块
 *   其余内容        → 原样按 Markdown 渲染（列表 / 表格 / 代码块 / 引用都支持）
 * 详见仓库根目录 README.md。
 */
import { idFromPath, parseFrontMatter, renderMarkdown, splitTags } from '../lib/markdown'

/** 一个可折叠小节（对应正文里的 ## 标题） */
export interface InterviewPanel {
  /** 小节标题；正文开头没有标题的内容为空串 */
  title: string
  /** 已渲染好的 HTML */
  html: string
}

/** 一个章节（对应正文里的 # 标题） */
export interface InterviewChapter {
  /** 章节标题；文件里没写 # 标题时为空串 */
  title: string
  panels: InterviewPanel[]
}

export interface InterviewRecord {
  id: string
  company: string
  position: string
  /** 面试时间 */
  date: string
  /** 轮次，例如「一面」「二面」 */
  stage: string
  /** 结果标签 */
  result: '已通过' | '流程中' | '未通过'
  tags: string[]
  /** 一句话总结 */
  summary: string
  /** 正文解析结果 */
  chapters: InterviewChapter[]
}

const RESULT_VALUES: InterviewRecord['result'][] = ['已通过', '流程中', '未通过']

/**
 * 按 # / ## 切分正文，其余内容整段交给 marked 渲染。
 * 只有「空的小节」会被丢掉——它本来就没有内容。
 */
function parseBody(body: string): InterviewChapter[] {
  const chapters: InterviewChapter[] = []

  let chapter: InterviewChapter = { title: '', panels: [] }
  let panel: InterviewPanel | null = null
  let buffer: string[] = []

  const flushPanel = () => {
    const text = buffer.join('\n').trim()
    buffer = []
    if (!text) return

    const html = renderMarkdown(text)
    if (panel) {
      panel.html = html
    } else {
      panel = { title: '', html }
      chapter.panels.push(panel)
    }
  }

  const flushChapter = () => {
    flushPanel()
    const panels = chapter.panels.filter((p) => p.html.trim())
    if (panels.length) chapters.push({ title: chapter.title, panels })
    chapter = { title: '', panels: [] }
    panel = null
  }

  for (const line of body.split('\n')) {
    const h1 = /^#\s+(.+?)\s*#*\s*$/.exec(line)
    if (h1) {
      flushChapter()
      chapter.title = h1[1].trim()
      continue
    }

    const h2 = /^##\s+(.+?)\s*#*\s*$/.exec(line)
    if (h2) {
      flushPanel()
      panel = { title: h2[1].trim(), html: '' }
      chapter.panels.push(panel)
      continue
    }

    buffer.push(line)
  }

  flushChapter()
  return chapters
}

const files = import.meta.glob('/content/interview/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

export const interviewRecords: InterviewRecord[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontMatter(raw)
    const result = RESULT_VALUES.includes(data.result as InterviewRecord['result'])
      ? (data.result as InterviewRecord['result'])
      : '流程中'

    return {
      id: data.id || idFromPath(path),
      company: data.company || '未填写公司',
      position: data.position || '',
      date: data.date || '',
      stage: data.stage || '',
      result,
      tags: splitTags(data.tags),
      summary: data.summary || '',
      chapters: parseBody(body)
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))
