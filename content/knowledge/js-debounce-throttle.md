---
title: 防抖与节流：区别、实现和真实场景
category: JavaScript
tags: 手撕代码, 性能优化
date: 2026-05-20
summary: 一个等「停止后执行」，一个等「按固定频率执行」，代码只有十几行但细节很多。
---

## 区别

- **防抖**（debounce）：事件高频触发时只在「停止触发后」执行一次 —— 适合搜索联想、窗口 resize、表单校验
- **节流**（throttle）：固定时间间隔内最多执行一次 —— 适合滚动监听、拖拽、按钮防连点

## 防抖实现

```js
function debounce(fn, delay = 300, immediate = false) {
  let timer = null

  return function (...args) {
    if (timer) clearTimeout(timer)

    // immediate 模式：首次立即执行，后续重新计时
    if (immediate && !timer) {
      fn.apply(this, args)
    }

    timer = setTimeout(() => {
      timer = null
      if (!immediate) fn.apply(this, args)
    }, delay)
  }
}
```

## 节流实现（时间戳 + 定时器双保险）

```js
function throttle(fn, interval = 200) {
  let last = 0
  let timer = null

  return function (...args) {
    const now = Date.now()
    const remain = interval - (now - last)

    if (remain <= 0) {
      // 距离上次执行已超过间隔，直接执行
      last = now
      fn.apply(this, args)
    } else if (!timer) {
      // 保证最后一次触发也能被执行
      timer = setTimeout(() => {
        last = Date.now()
        timer = null
        fn.apply(this, args)
      }, remain)
    }
  }
}
```

## 易错点

- 必须保存 `this` 和参数（`apply` + `...args`），否则组件方法里 this 会丢
- 组件卸载时要 `clearTimeout`，否则可能操作已销毁的实例
- Vue3 里可以直接用 `lodash-es` 的 debounce，但面试要求手写就要能默写出来
