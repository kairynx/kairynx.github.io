# Kairynx · 个人博客

一个用 **Vue 3 + Vite + Element Plus** 搭建的静态个人博客，部署在 GitHub Pages。

- 首页：`hello, world!` 欢迎语 + 两个跳转入口（面经 / 知识库）
- 面经页：按结果筛选、题目与复盘可折叠展开
- 知识库：分类筛选 + 关键词搜索 + 文章详情页（支持代码块）
- 全站响应式，移动端折叠菜单

线上地址：<https://kairynx.github.io/>

---

## 本地开发

```bash
npm install      # 首次安装依赖
npm run dev      # 本地开发，默认 http://localhost:5173
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建产物
```

## 目录结构

```
├─ .github/workflows/deploy.yml   # 推送到 main 自动构建并发布 Pages
├─ public/favicon.svg
├─ src/
│  ├─ components/AppHeader.vue    # 顶部导航（桌面菜单 + 移动端折叠）
│  ├─ components/AppFooter.vue
│  ├─ data/interview.ts           # ★ 面经内容
│  ├─ data/knowledge.ts           # ★ 知识库内容
│  ├─ router/index.ts             # 路由（hash 模式）
│  ├─ styles/main.css             # 全局样式变量
│  ├─ views/HomeView.vue          # 首页
│  ├─ views/InterviewView.vue     # 面经列表
│  ├─ views/KnowledgeView.vue     # 知识库列表
│  ├─ views/ArticleView.vue       # 文章详情
│  ├─ views/NotFoundView.vue      # 404
│  ├─ App.vue
│  └─ main.ts
└─ vite.config.ts
```

## 怎么更新内容

所有内容都放在 `src/data/` 下，改数据即可，不用动组件。

**加一篇面经**：在 `src/data/interview.ts` 的 `interviewRecords` 数组里追加一个对象。

```ts
{
  id: 'xxx-2026',            // 唯一，用于锚点
  company: '公司名',
  position: '岗位',
  date: '2026-08-01',
  stage: '一面 · 45min',
  result: '流程中',           // '已通过' | '流程中' | '未通过'
  tags: ['JS 基础'],
  summary: '一句话总结',
  questions: [{ group: '分组名', items: ['题目 1', '题目 2'] }],
  review: ['复盘要点 1']
}
```

**加一篇知识库文章**：在 `src/data/knowledge.ts` 的 `articles` 数组里追加。

```ts
{
  id: 'my-article',
  title: '标题',
  category: 'JavaScript',    // 需在 categories 里（JS / 计算机网络 / 工程化 / 框架）
  tags: ['标签'],
  date: '2026-08-01',
  readTime: '5 min',
  summary: '摘要',
  sections: [
    { heading: '小标题', text: '正文' },
    { heading: '要点', list: ['要点 1', '要点 2'] },
    { heading: '代码', code: `const a = 1`, lang: 'javascript' }
  ]
}
```

## 部署到 GitHub Pages

项目已经配好 GitHub Actions 自动部署，只需三步：

1. 在 GitHub 新建仓库，仓库名填 **`kairynx.github.io`**（这样访问地址就是 `https://kairynx.github.io/`）
2. 推送代码（首次）：

   ```bash
   git remote add origin https://github.com/kairynx/kairynx.github.io.git
   git push -u origin main
   ```

3. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**

之后每次 `git push` 到 `main`，Actions 会自动构建并发布，约 1 分钟上线。

### 如果仓库名不是 `kairynx.github.io`

比如仓库叫 `blog`，访问地址会变成 `https://kairynx.github.io/blog/`，
需要把 `vite.config.ts` 里的 `base: '/'` 改成 `base: '/blog/'`，否则资源 404、页面空白。

### 为什么用 hash 路由

GitHub Pages 是纯静态托管，没有服务端 rewrite。路由用 `createWebHashHistory()`，
地址形如 `/#/interview`，任意子路径刷新都不会 404，零额外配置。
