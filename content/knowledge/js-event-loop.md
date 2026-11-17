---
title: 事件循环：宏任务与微任务的执行顺序
category: JavaScript
tags: 事件循环, 异步, 面试高频
date: 2026-06-02
summary: 一次把「为什么 setTimeout 排在 Promise 后面」讲清楚：调用栈、任务队列、以及一次 tick 到底做了什么。
---

## 一句话结论

JS 是单线程的，同步代码执行完后，引擎会先把「微任务队列」全部清空，再去取「宏任务队列」中的一个任务执行。每执行完一个宏任务，就再清空一次微任务队列 —— 这个循环就是事件循环（Event Loop）。

## 两类任务队列

- **宏任务**（macrotask）：script 整体代码、`setTimeout` / `setInterval`、I/O、UI 渲染、`postMessage`
- **微任务**（microtask）：`Promise.then` / `catch` / `finally`、`queueMicrotask`、`MutationObserver`、`await` 之后的代码
- 关键差异：微任务在本轮 tick 内一定会全部执行完，宏任务一次只取一个

## 经典输出顺序题

```js
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

new Promise((resolve) => {
  console.log('4')
  resolve()
}).then(() => console.log('5'))

console.log('6')

// 输出：1 4 6 3 5 2
// 解析：1、4、6 是同步代码（new Promise 的 executor 是同步执行的）
//      3、5 是微任务，按入队顺序执行
//      2 是宏任务，等微任务清空后才轮到它
```

## await 的坑

`await` 后面的表达式会先被求值（同步），然后暂停当前 async 函数，把它之后的所有代码包装成一个微任务。所以「await 之后」的代码等价于 `Promise.then` 的回调，而不是同步代码。

## 记忆口诀

- 同步 → 微任务全部 → 宏任务一个 → 微任务全部 → …
- async 函数体内部的 await 之前是同步，之后是微任务
- DOM 渲染发生在微任务清空之后、下一个宏任务之前
