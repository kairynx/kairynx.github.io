---
title: 手写一个 Promise（够用的核心版）
category: JavaScript
tags: Promise, 手撕代码
date: 2026-06-10
summary: 从状态机、then 链式调用到错误穿透，手写实现能跑通常用用例的简易 Promise。
---

## 核心思路

- 三个状态：`pending` / `fulfilled` / `rejected`，状态只能从 pending 单向流转
- `then` 返回一个新的 Promise，从而实现链式调用
- `then` 的回调必须异步执行（用微任务模拟），保证执行顺序符合规范
- 回调返回普通值时，新 Promise 直接 fulfilled；返回值是 Promise 时，跟着它的状态走

## 实现代码

```js
class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  constructor(executor) {
    this.state = MyPromise.PENDING
    this.value = undefined
    this.callbacks = []

    const resolve = (value) => {
      if (this.state !== MyPromise.PENDING) return
      this.state = MyPromise.FULFILLED
      this.value = value
      this.flush()
    }

    const reject = (reason) => {
      if (this.state !== MyPromise.PENDING) return
      this.state = MyPromise.REJECTED
      this.value = reason
      this.flush()
    }

    // executor 内部的异常直接让 Promise 变为 rejected
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  flush() {
    // 用微任务模拟规范要求的异步执行
    queueMicrotask(() => {
      this.callbacks.forEach((fn) => fn())
      this.callbacks = []
    })
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = () => {
        const cb = this.state === MyPromise.FULFILLED ? onFulfilled : onRejected

        // 没有传回调时向后穿透
        if (typeof cb !== 'function') {
          return this.state === MyPromise.FULFILLED
            ? resolve(this.value)
            : reject(this.value)
        }

        try {
          const result = cb(this.value)
          result instanceof MyPromise ? result.then(resolve, reject) : resolve(result)
        } catch (err) {
          reject(err)
        }
      }

      if (this.state === MyPromise.PENDING) {
        this.callbacks.push(handle)
      } else {
        queueMicrotask(handle)
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(cb) {
    return this.then(
      (v) => MyPromise.resolve(cb()).then(() => v),
      (e) => MyPromise.resolve(cb()).then(() => {
        throw e
      })
    )
  }

  static resolve(value) {
    return value instanceof MyPromise ? value : new MyPromise((r) => r(value))
  }

  static reject(reason) {
    return new MyPromise((_, r) => r(reason))
  }
}
```

## 面试常追问

- 为什么 `then` 的回调要异步执行？—— 保证回调永远在同步代码之后，避免时序不确定
- `Promise.all` / `allSettled` / `race` / `any` 的区别？—— 全部成功 / 全等结束 / 首个结束 / 首个成功
- `async/await` 是 Promise 的语法糖，本质是 generator + 自动执行器
