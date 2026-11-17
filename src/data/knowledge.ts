/**
 * 知识库数据
 * ------------------------------------------------------------------
 * 新增文章：往 articles 里加一个对象即可，列表页、分类、搜索、详情页自动生效。
 * sections 支持三种内容块：正文 text、要点 list、代码 code。
 */

export interface ArticleSection {
  heading?: string
  text?: string
  list?: string[]
  code?: string
  lang?: string
}

export interface Article {
  id: string
  title: string
  category: string
  tags: string[]
  date: string
  readTime: string
  summary: string
  sections: ArticleSection[]
}

export const categories = ['全部', 'JavaScript', '计算机网络', '工程化', '框架'] as const

export const articles: Article[] = [
  {
    id: 'js-event-loop',
    title: '事件循环：宏任务与微任务的执行顺序',
    category: 'JavaScript',
    tags: ['事件循环', '异步', '面试高频'],
    date: '2026-06-02',
    readTime: '6 min',
    summary:
      '一次把「为什么 setTimeout 排在 Promise 后面」讲清楚：调用栈、任务队列、以及一次 tick 到底做了什么。',
    sections: [
      {
        heading: '一句话结论',
        text:
          'JS 是单线程的，同步代码执行完后，引擎会先把「微任务队列」全部清空，再去取「宏任务队列」中的一个任务执行。每执行完一个宏任务，就再清空一次微任务队列 —— 这个循环就是事件循环（Event Loop）。'
      },
      {
        heading: '两类任务队列',
        list: [
          '宏任务（macrotask）：script 整体代码、setTimeout / setInterval、I/O、UI 渲染、postMessage',
          '微任务（microtask）：Promise.then / catch / finally、queueMicrotask、MutationObserver、await 之后的代码',
          '关键差异：微任务在本轮 tick 内一定会全部执行完，宏任务一次只取一个'
        ]
      },
      {
        heading: '经典输出顺序题',
        code: `console.log('1')

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
//      2 是宏任务，等微任务清空后才轮到它`,
        lang: 'javascript'
      },
      {
        heading: 'await 的坑',
        text:
          'await 后面的表达式会先被求值（同步），然后暂停当前 async 函数，把它之后的所有代码包装成一个微任务。所以「await 之后」的代码等价于 Promise.then 的回调，而不是同步代码。'
      },
      {
        heading: '记忆口诀',
        list: [
          '同步 → 微任务全部 → 宏任务一个 → 微任务全部 → …',
          'async 函数体内部的 await 之前是同步，之后是微任务',
          'DOM 渲染发生在微任务清空之后、下一个宏任务之前'
        ]
      }
    ]
  },
  {
    id: 'js-promise',
    title: '手写一个 Promise（够用的核心版）',
    category: 'JavaScript',
    tags: ['Promise', '手撕代码'],
    date: '2026-06-10',
    readTime: '8 min',
    summary: '从状态机、then 链式调用到错误穿透，手写实现能跑通 A+ 用例的简易 Promise。',
    sections: [
      {
        heading: '核心思路',
        list: [
          '三个状态：pending / fulfilled / rejected，状态只能从 pending 单向流转',
          'then 返回一个新的 Promise，从而实现链式调用',
          'then 的回调必须异步执行（用微任务模拟），保证执行顺序符合规范',
          '回调返回普通值时，新 Promise 直接 fulfilled；返回值是 Promise 时，跟着它的状态走'
        ]
      },
      {
        heading: '实现代码',
        code: `class MyPromise {
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
}`,
        lang: 'javascript'
      },
      {
        heading: '面试常追问',
        list: [
          '为什么 then 的回调要异步执行？—— 保证回调永远在同步代码之后，避免时序不确定',
          'Promise.all / allSettled / race / any 的区别？—— 全部成功 / 全等结束 / 首个结束 / 首个成功',
          'async/await 是 Promise 的语法糖，本质是 generator + 自动执行器'
        ]
      }
    ]
  },
  {
    id: 'js-debounce-throttle',
    title: '防抖与节流：区别、实现和真实场景',
    category: 'JavaScript',
    tags: ['手撕代码', '性能优化'],
    date: '2026-05-20',
    readTime: '5 min',
    summary: '一个等「停止后执行」，一个等「按固定频率执行」，代码只有十几行但细节很多。',
    sections: [
      {
        heading: '区别',
        list: [
          '防抖（debounce）：事件高频触发时只在「停止触发后」执行一次 —— 适合搜索联想、窗口 resize、表单校验',
          '节流（throttle）：固定时间间隔内最多执行一次 —— 适合滚动监听、拖拽、按钮防连点'
        ]
      },
      {
        heading: '防抖实现',
        code: `function debounce(fn, delay = 300, immediate = false) {
  let timer = null

  return function (...args) {
    // immediate 模式：首次立即执行，后续重新计时
    if (timer) clearTimeout(timer)

    if (immediate && !timer) {
      fn.apply(this, args)
    }

    timer = setTimeout(() => {
      timer = null
      if (!immediate) fn.apply(this, args)
    }, delay)
  }
}`,
        lang: 'javascript'
      },
      {
        heading: '节流实现（时间戳 + 定时器双保险）',
        code: `function throttle(fn, interval = 200) {
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
}`,
        lang: 'javascript'
      },
      {
        heading: '易错点',
        list: [
          '必须保存 this 和参数（apply + ...args），否则组件方法里 this 会丢',
          '组件卸载时要 clearTimeout，否则可能操作已销毁的实例',
          'Vue3 里可以直接用 lodash-es 的 debounce，但面试要求手写就要能默写出来'
        ]
      }
    ]
  },
  {
    id: 'js-wrapper-type',
    title: '基本包装类型：字符串为什么能调用方法',
    category: 'JavaScript',
    tags: ['基础', '类型系统'],
    date: '2026-05-08',
    readTime: '4 min',
    summary: '原始值本身没有方法，是引擎临时「包装」了一个对象，执行完立刻销毁。',
    sections: [
      {
        heading: '发生了什么',
        text:
          '当你写 str.toUpperCase() 时，JS 引擎会隐式做三件事：创建 String 类型的临时对象 → 把 str 的值拷进去 → 调用方法并从原型上找。调用结束后这个临时对象即被销毁，所以给原始值加属性是无效的。'
      },
      {
        heading: '验证代码',
        code: `const s = 'hello'
s.foo = 1
console.log(s.foo) // undefined —— 临时对象被销毁了

// 手动包装则能保留属性
const obj = new String('hello')
obj.foo = 1
console.log(obj.foo) // 1
console.log(typeof obj) // 'object'`,
        lang: 'javascript'
      },
      {
        heading: '三个包装类型',
        list: [
          'String / Number / Boolean 是基本包装类型',
          'null 和 undefined 没有对应的包装类型，所以访问它们的属性会直接报错',
          '不要用 new 去创建包装对象：typeof 会变成 object，且布尔判断恒为 true'
        ]
      }
    ]
  },
  {
    id: 'net-http-cache',
    title: 'HTTP 缓存：强缓存与协商缓存',
    category: '计算机网络',
    tags: ['HTTP', '性能优化', '面试高频'],
    date: '2026-06-15',
    readTime: '7 min',
    summary: 'Cache-Control / ETag / Last-Modified 到底谁生效，一次请求的缓存决策顺序讲清楚。',
    sections: [
      {
        heading: '两类缓存',
        list: [
          '强缓存：命中后不发送请求，直接用本地副本，状态码显示 200 (from disk cache)',
          '协商缓存：发送请求带上校验字段，服务端判断是否可用，未变更返回 304 且不带响应体'
        ]
      },
      {
        heading: '相关响应头',
        code: `# 强缓存（优先级高于 Expires，单位秒）
Cache-Control: max-age=31536000, immutable
# 老字段，受客户端时间影响，已不推荐
Expires: Wed, 21 Oct 2026 07:28:00 GMT

# 协商缓存：内容指纹，优先级高于 Last-Modified
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 协商缓存：最后修改时间（精度到秒，可能不准）
Last-Modified: Wed, 21 Oct 2026 07:28:00 GMT
If-Modified-Since: Wed, 21 Oct 2026 07:28:00 GMT`,
        lang: 'http'
      },
      {
        heading: '决策顺序',
        list: [
          '先看 Cache-Control / Expires 是否还在有效期 → 命中强缓存，不发请求',
          '强缓存失效 → 带 If-None-Match / If-Modified-Since 发请求',
          '服务端比对 ETag：一致返回 304，不一致返回 200 + 新内容',
          '用户强制刷新（Ctrl+F5）会跳过强缓存，但仍可能用协商缓存'
        ]
      },
      {
        heading: '工程实践',
        list: [
          'HTML 入口文件：Cache-Control: no-cache（每次都校验，保证能拿到新的资源引用）',
          'JS / CSS / 图片等带 hash 的静态资源：max-age 一年 + immutable',
          '接口数据：按业务决定，一般 no-store 或短 max-age + ETag'
        ]
      }
    ]
  },
  {
    id: 'net-tcp-handshake',
    title: 'TCP 为什么是三次握手、四次挥手',
    category: '计算机网络',
    tags: ['TCP', '面试高频'],
    date: '2026-06-20',
    readTime: '6 min',
    summary: '握手是为了确认「双向收发能力」，挥手多一次是因为 TCP 是全双工的。',
    sections: [
      {
        heading: '三次握手',
        list: [
          '第一次：客户端 SYN=1, seq=x —— 我能发，你能收到吗',
          '第二次：服务端 SYN=1, ACK=1, seq=y, ack=x+1 —— 我能收也能发',
          '第三次：客户端 ACK=1, ack=y+1 —— 确认服务端也能发',
          '两次不够：服务端无法确认客户端能收到自己的包，且历史失效连接请求会造成资源浪费'
        ]
      },
      {
        heading: '四次挥手',
        list: [
          '客户端 FIN → 服务端 ACK（客户端不再发数据）',
          '服务端处理完剩余数据后 FIN → 客户端 ACK',
          '多出一次是因为 TCP 全双工，两个方向的关闭要分别确认',
          '主动关闭方要等 2MSL 才真正关闭：保证最后 ACK 能到达，并让旧连接的报文在网络中消散'
        ]
      },
      {
        heading: '常见追问',
        list: [
          'SYN Flood 攻击：伪造大量 SYN 占满半连接队列，用 SYN Cookie 防御',
          '为什么 seq 要随机初始化：防止历史报文被误认为当前连接的数据',
          'HTTP/2 的多路复用仍基于单条 TCP，丢包会阻塞所有流，这也是 QUIC 出现的动因'
        ]
      }
    ]
  },
  {
    id: 'eng-webpack-vite',
    title: 'Webpack 与 Vite 的构建原理差异',
    category: '工程化',
    tags: ['Vite', 'Webpack', '构建'],
    date: '2026-07-05',
    readTime: '6 min',
    summary: '一个「先打包再启动」，一个「先启动按需编译」，冷启动速度差了一个数量级。',
    sections: [
      {
        heading: '核心差异',
        list: [
          'Webpack：启动时递归分析依赖图，把一切编译成 bundle 放进内存，模块多了启动就慢',
          'Vite（开发环境）：利用浏览器原生 ESM，按需请求哪个模块就编译哪个，冷启动几乎与项目规模无关',
          'Vite（生产环境）：用 Rollup 打包，配合 esbuild 做依赖预构建和代码压缩'
        ]
      },
      {
        heading: '依赖预构建解决什么',
        text:
          '把 CommonJS / UMD 的第三方包转成 ESM，并把 lodash 这种「几百个小文件」的包合并成一个文件，减少浏览器的请求数量。预构建结果缓存在 node_modules/.vite 下。'
      },
      {
        heading: 'HMR 为什么快',
        list: [
          'Webpack 的 HMR 需要沿依赖图向上冒泡，重新构建受影响的 chunk',
          'Vite 的 HMR 基于 ESM 的模块边界，只需让浏览器重新请求变更的那个模块',
          '因此项目越大，Vite 热更新的优势越明显'
        ]
      },
      {
        heading: '一张对照表',
        code: `维度            Webpack                  Vite
-------------------------------------------------------------
启动原理        先打包，再起 dev server   先起服务，按需编译
冷启动          随模块数量线性变慢        基本恒定
HMR             重建受影响 chunk          只失效单个模块
生产构建        Webpack 自身             Rollup
生态            插件极丰富，历史包袱重     插件较少，但主流场景已覆盖
适用            大型存量项目 / 复杂定制    新项目 / 追求开发体验`,
        lang: 'text'
      }
    ]
  },
  {
    id: 'vue-reactivity',
    title: 'Vue3 响应式：Proxy 与 effect 的配合',
    category: '框架',
    tags: ['Vue3', '响应式原理'],
    date: '2026-07-12',
    readTime: '7 min',
    summary: '依赖收集发生在 get 里，派发更新发生在 set 里，中间靠 WeakMap 维护「对象 → 属性 → 副作用」的关系。',
    sections: [
      {
        heading: '为什么换成 Proxy',
        list: [
          'Object.defineProperty 只能劫持已存在的属性，新增 / 删除属性要额外调用 Vue.set / Vue.delete',
          'Proxy 可以拦截 get / set / deleteProperty / has 等 13 种操作，天然支持数组索引和 Map、Set',
          '惰性代理：只有真正访问到嵌套对象时才递归创建 Proxy，初始化开销更小'
        ]
      },
      {
        heading: '极简实现',
        code: `const targetMap = new WeakMap() // 对象 -> Map(属性 -> Set<effect>)
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
}`,
        lang: 'javascript'
      },
      {
        heading: 'ref 与 reactive',
        list: [
          'reactive 只能代理对象，对基本类型无效；ref 用一个 { value } 容器包住任意值',
          'ref 在模板中自动解包，在 setup 里需要 .value',
          'reactive 解构会丢失响应性，需要用 toRefs 或直接改用 ref'
        ]
      }
    ]
  }
]

export function getArticleById(id: string) {
  return articles.find((item) => item.id === id)
}

export function getArticlesByCategory(category: string) {
  return category === '全部' ? articles : articles.filter((a) => a.category === category)
}
