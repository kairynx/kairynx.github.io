/**
 * 面经数据：从 content/interview/*.md 自动读取
 * ------------------------------------------------------------------
 * 你只需要在 content/interview/ 下新建或编辑 .md 文件，页面自动更新。
 * 文件名就是这条记录的唯一 id，删掉文件即删除记录。
 *
 * 文件格式见 content/interview/README 或仓库根目录 README.md。
 */
import { idFromPath, parseFrontMatter, splitTags } from '../lib/markdown'

export interface InterviewQuestionGroup {
  /** 分组标题，例如「JavaScript 基础」 */
  group: string
  /** 该组下的问题列表 */
  items: string[]
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
  questions: InterviewQuestionGroup[]
  /** 复盘与反思 */
  review: string[]
}

const RESULT_VALUES: InterviewRecord['result'][] = ['已通过', '流程中', '未通过']

/** 正文约定：`## 题目` 下用 `### 分组` + `- 题目`；`## 复盘` 下用 `- 要点` */
function parseBody(body: string) {
  const questions: InterviewQuestionGroup[] = []
  const review: string[] = []

  let zone: 'question' | 'review' = 'question'
  let current: InterviewQuestionGroup | null = null

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim()

    const h2 = /^##\s+(.+)$/.exec(line)
    if (h2) {
      zone = /复盘|反思|总结/.test(h2[1]) ? 'review' : 'question'
      current = null
      continue
    }

    const h3 = /^###\s+(.+)$/.exec(line)
    if (h3) {
      if (zone === 'question') {
        current = { group: h3[1].trim(), items: [] }
        questions.push(current)
      }
      continue
    }

    const li = /^[-*]\s+(.+)$/.exec(line)
    if (!li) continue

    if (zone === 'review') {
      review.push(li[1].trim())
    } else {
      if (!current) {
        current = { group: '题目', items: [] }
        questions.push(current)
      }
      current.items.push(li[1].trim())
    }
  }

  return { questions, review }
}

const files = import.meta.glob('/content/interview/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

export const interviewRecords: InterviewRecord[] = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontMatter(raw)
    const { questions, review } = parseBody(body)
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
      questions,
      review
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))
