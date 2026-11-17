/**
 * 面经数据
 * ------------------------------------------------------------------
 * 这个文件就是你的「面经内容源」，改这里即可更新页面，不用动组件。
 * 新增一条：复制一个对象，改 id（唯一）、公司、岗位、题目即可。
 */

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
  /** 面试时间，展示用 */
  date: string
  /** 轮次，例如「一面」「二面」「HR 面」 */
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

export const interviewRecords: InterviewRecord[] = [
  {
    id: 'tencent-fe-2026-07',
    company: '腾讯',
    position: '前端开发 · 日常实习（数据计算平台）',
    date: '2026-07-31',
    stage: '一面 · 45min · 腾讯会议',
    result: '流程中',
    tags: ['JS 基础', 'Vue 原理', 'HTTP 缓存', '手撕代码'],
    summary:
      '整体节奏偏基础 + 项目深挖，八股占比约一半，剩下全是项目细节和一道手撕。面试官很关注「你为什么这么做」，而不是背结论。',
    questions: [
      {
        group: 'JavaScript 基础',
        items: [
          '说说事件循环：宏任务和微任务的执行顺序，给出 console 输出题',
          'Promise 有哪几种状态？then 返回的是什么？',
          '防抖和节流的区别，分别用在什么场景',
          '基本包装类型是什么？为什么字符串能调用方法',
          'var / let / const 的区别，暂时性死区'
        ]
      },
      {
        group: '框架（Vue3 / React）',
        items: [
          'Vue3 为什么用 Proxy 替代 Object.defineProperty',
          'ref 和 reactive 的区别，什么时候用哪个',
          'React19 里你项目用了哪些新特性',
          '受控组件和非受控组件'
        ]
      },
      {
        group: '计算机网络',
        items: [
          '从输入 URL 到页面渲染发生了什么',
          '强缓存和协商缓存分别有哪些响应头',
          'HTTP/1.1 和 HTTP/2 的主要区别',
          'TCP 为什么三次握手而不是两次'
        ]
      },
      {
        group: '工程化',
        items: [
          'Webpack 和 Vite 的构建原理差异',
          '你项目里怎么做的首屏优化',
          'Docker 部署流程介绍一下'
        ]
      },
      {
        group: '手撕代码',
        items: [
          '数组扁平化（要求手写递归 + reduce 两种写法）',
          '手写防抖，支持 immediate 参数',
          '两数之和，讲一下时间复杂度的优化思路'
        ]
      }
    ],
    review: [
      '事件循环的输出题差点翻车：async/await 的 await 之后属于 microtask，要能手推顺序。',
      '项目深挖准备不足，被追问「为什么用 Web Worker 做 OCR」时只回答了「不阻塞主线程」，没有给出数据量、耗时对比。',
      '手撕写出来了但没先讲思路，面试官提醒「先说复杂度再写」。',
      '下次准备：每个项目至少准备 3 层追问（为什么做 → 怎么实现 → 有什么坑 / 怎么优化）。'
    ]
  },
  {
    id: 'xiaohongshu-fe-2026-03',
    company: '小红书',
    position: '前端开发实习生',
    date: '2026-03-18',
    stage: '一面 + 二面',
    result: '已通过',
    tags: ['React', '性能优化', '项目深挖'],
    summary: '两轮都围绕项目展开，几乎没有纯八股，重点考察技术选型的思考过程。',
    questions: [
      {
        group: '项目深挖',
        items: [
          '面经助手为什么选 React19 而不是 Vue？',
          'OCR 识别放在前端做，准确率和性能怎么权衡',
          'MCP 是什么？你的项目里它解决了什么问题',
          '如果日活涨 100 倍，架构上先改哪里'
        ]
      },
      {
        group: '工程能力',
        items: [
          'Web Worker 和主线程怎么通信，结构化克隆有什么限制',
          'Docker 镜像怎么减小体积',
          'Git 遇到冲突怎么处理，rebase 和 merge 的区别'
        ]
      }
    ],
    review: [
      '技术选型类问题用「场景约束 → 候选方案 → 取舍理由」三段式回答，面试官反馈清晰。',
      '被问到「架构演进」时答得比较空，需要补一点容量估算的常识。'
    ]
  },
  {
    id: 'bytedance-fe-2026-05',
    company: '字节跳动',
    position: '前端开发实习生',
    date: '2026-05-12',
    stage: '一面',
    result: '未通过',
    tags: ['算法', 'CSS', '浏览器'],
    summary: '算法占比高，两道 medium 只做出了一道，CSS 布局细节答得不够准。',
    questions: [
      {
        group: '算法',
        items: ['最长无重复子串', '手写 LRU 缓存'],
      },
      {
        group: 'CSS / 浏览器',
        items: [
          'BFC 是什么，怎么触发，能解决什么问题',
          '元素水平垂直居中几种方案',
          '重排和重绘的区别，哪些属性只触发重绘'
        ]
      }
    ],
    review: [
      '算法是硬伤，LRU 卡在双向链表指针更新上，需要专项刷题。',
      'CSS 只答出 flex / absolute，grid 和 table-cell 方案没想起来。'
    ]
  }
]
