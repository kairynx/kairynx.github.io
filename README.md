# Kairynx · 个人博客

用 **Vue 3 + Vite + Element Plus** 搭建的静态个人博客，内容全部是 **Markdown 文件**，部署在 GitHub Pages。

- 首页：`hello, world!` 欢迎语 + 两个入口（面经 / 知识库）
- 面经：按结果筛选，题目与复盘可折叠
- 知识库：分类 + 关键词搜索 + Markdown 文章详情
- 全站响应式，移动端折叠菜单

线上地址：<https://kairynx.github.io/>

---

## 本地开发

```bash
npm install      # 首次安装依赖
npm run dev      # 本地预览 http://localhost:5173
npm run build    # 构建到 dist/（部署时 CI 会自动执行，平时不用手动跑）
```

## 写内容：只改 Markdown，不碰代码

所有内容都在 `content/` 目录：

```
content/
├─ interview/     ← 面经，一个 .md = 一条面试记录
└─ knowledge/     ← 知识库，一个 .md = 一篇文章
```

新建文件、写内容、保存、提交推送，就完事了。**文件名就是 id**（决定文章地址 `/#/knowledge/<文件名>`），改名等于换链接。

### 面经怎么写

`content/interview/tencent-2026-07.md`：

````markdown
---
company: 腾讯
position: 前端开发 · 日常实习
date: 2026-07-31
stage: 一面 · 45min
result: 流程中
tags: JS 基础, 网络, 手撕代码
summary: 一句话总结这场面试
---

## 题目

### JavaScript 基础

- 说说事件循环，宏任务和微任务的执行顺序
- 防抖和节流的区别

### 手撕代码

- 数组扁平化

## 复盘

- 事件循环的输出题差点翻车，`await` 之后属于微任务
- 项目深挖准备不足，被追问「为什么」时只答了结论
````

约定：

- `## 题目` 下面用 `### 分组名` 分组，每条题目写 `- `
- `## 复盘` 下面的 `- ` 会显示为复盘清单
- `result` 只能填 **`已通过` / `流程中` / `未通过`**，填错会默认成「流程中」
- `tags` 用逗号分隔
- 面经按 `date` 倒序排列

### 知识库怎么写

`content/knowledge/js-event-loop.md`：

````markdown
---
title: 事件循环：宏任务与微任务的执行顺序
category: JavaScript
tags: 事件循环, 异步
date: 2026-06-02
readTime: 6 min
summary: 列表页显示的摘要
---

## 一句话结论

正文随便写 Markdown。

- 支持列表
- 支持 **加粗**、`行内代码`、[链接](https://example.com)

```js
// 代码块带语言标识
console.log('hello')
```

| 表头 | 表头 |
| --- | --- |
| 单元格 | 单元格 |
````

约定：

- `category` 决定分类按钮，**新分类自动出现在筛选栏**，不用改代码
- `readTime` 可以不写，会按字数自动估算
- 代码块用三个反引号包裹；正文里不要再出现三个反引号，否则会截断
- 文章按 `date` 倒序排列，`date` 请写成 `2026-06-02` 这种补零格式

### 增删改

| 操作 | 做法 |
| --- | --- |
| 新增 | 在对应目录新建 `.md` 文件 |
| 修改 | 直接编辑 `.md` 文件 |
| 删除 | 删掉 `.md` 文件 |
| 调顺序 | 改 `date`（面经、文章都按日期倒序） |

## 目录结构

```
├─ content/                       # ★ 内容（Markdown）
│  ├─ interview/
│  └─ knowledge/
├─ .github/workflows/deploy.yml   # 推送到 main 自动构建并发布 Pages
├─ src/
│  ├─ data/interview.ts           # 读取 content/interview/*.md
│  ├─ data/knowledge.ts           # 读取 content/knowledge/*.md
│  ├─ lib/markdown.ts             # 文件头解析 + Markdown 渲染
│  ├─ components/                 # 顶部导航、页脚
│  ├─ router/index.ts             # 路由（hash 模式）
│  ├─ styles/main.css             # 全局样式 + Markdown 排版
│  └─ views/                      # 首页 / 面经 / 知识库 / 文章 / 404
└─ vite.config.ts
```

## 改完怎么上线

```bash
git add -A
git commit -m "docs: 新增一篇面经"
git push
```

推送后 GitHub Actions 自动构建发布，约 1 分钟生效，不需要手动 build、也不需要本地有构建环境。

## 部署

仓库名必须是 **`kairynx.github.io`**，Pages 的 Source 选择 **GitHub Actions**。

> 如果仓库名不是 `kairynx.github.io`（比如叫 `blog`），访问地址会变成 `https://kairynx.github.io/blog/`，需要把 `vite.config.ts` 里的 `base: '/'` 改成 `base: '/blog/'`，否则资源 404 白屏。

### 为什么用 hash 路由

GitHub Pages 是纯静态托管，没有服务端 rewrite。路由用 `createWebHashHistory()`，地址形如 `/#/interview`，任意子路径刷新都不会 404。
