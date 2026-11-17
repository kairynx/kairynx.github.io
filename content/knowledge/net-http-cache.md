---
title: HTTP 缓存：强缓存与协商缓存
category: 计算机网络
tags: HTTP, 性能优化, 面试高频
date: 2026-06-15
summary: Cache-Control / ETag / Last-Modified 到底谁生效，一次请求的缓存决策顺序讲清楚。
---

## 两类缓存

- **强缓存**：命中后不发送请求，直接用本地副本，状态码显示 200 (from disk cache)
- **协商缓存**：发送请求带上校验字段，服务端判断是否可用，未变更返回 304 且不带响应体

## 相关响应头

```http
# 强缓存（优先级高于 Expires，单位秒）
Cache-Control: max-age=31536000, immutable
# 老字段，受客户端时间影响，已不推荐
Expires: Wed, 21 Oct 2026 07:28:00 GMT

# 协商缓存：内容指纹，优先级高于 Last-Modified
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 协商缓存：最后修改时间（精度到秒，可能不准）
Last-Modified: Wed, 21 Oct 2026 07:28:00 GMT
If-Modified-Since: Wed, 21 Oct 2026 07:28:00 GMT
```

## 决策顺序

1. 先看 `Cache-Control` / `Expires` 是否还在有效期 → 命中强缓存，不发请求
2. 强缓存失效 → 带 `If-None-Match` / `If-Modified-Since` 发请求
3. 服务端比对 ETag：一致返回 304，不一致返回 200 + 新内容
4. 用户强制刷新（Ctrl+F5）会跳过强缓存，但仍可能用协商缓存

## 工程实践

- HTML 入口文件：`Cache-Control: no-cache`（每次都校验，保证能拿到新的资源引用）
- JS / CSS / 图片等带 hash 的静态资源：`max-age` 一年 + `immutable`
- 接口数据：按业务决定，一般 `no-store` 或短 `max-age` + `ETag`
