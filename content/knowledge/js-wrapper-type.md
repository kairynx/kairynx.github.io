---
title: 基本包装类型：字符串为什么能调用方法
category: JavaScript
tags: 基础, 类型系统
date: 2026-05-08
summary: 原始值本身没有方法，是引擎临时「包装」了一个对象，执行完立刻销毁。
---

## 发生了什么

当你写 `str.toUpperCase()` 时，JS 引擎会隐式做三件事：创建 String 类型的临时对象 → 把 str 的值拷进去 → 调用方法并从原型上找。调用结束后这个临时对象即被销毁，所以给原始值加属性是无效的。

## 验证代码

```js
const s = 'hello'
s.foo = 1
console.log(s.foo) // undefined —— 临时对象被销毁了

// 手动包装则能保留属性
const obj = new String('hello')
obj.foo = 1
console.log(obj.foo) // 1
console.log(typeof obj) // 'object'
```

## 三个包装类型

- `String` / `Number` / `Boolean` 是基本包装类型
- `null` 和 `undefined` 没有对应的包装类型，所以访问它们的属性会直接报错
- 不要用 `new` 去创建包装对象：`typeof` 会变成 object，且布尔判断恒为 true
