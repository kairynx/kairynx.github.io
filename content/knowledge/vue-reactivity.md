---
title: Vue3 响应式：Proxy 与 effect 的配合
category: 框架
tags: Vue3, 响应式原理
date: 2026-07-12
summary: 依赖收集发生在 get 里，派发更新发生在 set 里，中间靠 WeakMap 维护「对象 → 属性 → 副作用」的关系。
---

## 为什么换成 Proxy

- `Object.defineProperty` 只能劫持已存在的属性，新增 / 删除属性要额外调用 `Vue.set` / `Vue.delete`
- `Proxy` 可以拦截 get / set / deleteProperty / has 等 13 种操作，天然支持数组索引和 `Map`、`Set`
- **惰性代理**：只有真正访问到嵌套对象时才递归创建 Proxy，初始化开销更小

## 极简实现

```js
const targetMap = new WeakMap() // 对象 -> Map(属性 -> Set<effect>)
let activeEffect = null

function track(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))

  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  dep.add(activeEffect)
}

function trigger(target, key) {
  const dep = targetMap.get(target)?.get(key)
  dep && dep.forEach((effect) => effect())
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key) // 读取时收集依赖
      const value = Reflect.get(target, key, receiver)
      return typeof value === 'object' && value !== null ? reactive(value) : value
    },
    set(target, key, value, receiver) {
      const ok = Reflect.set(target, key, value, receiver)
      trigger(target, key) // 写入时派发更新
      return ok
    }
  })
}
```

## ref 与 reactive

- `reactive` 只能代理对象，对基本类型无效；`ref` 用一个 `{ value }` 容器包住任意值
- `ref` 在模板中自动解包，在 setup 里需要 `.value`
- `reactive` 解构会丢失响应性，需要用 `toRefs` 或直接改用 `ref`
