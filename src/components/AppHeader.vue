<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const scrolled = ref(false)

const go = (path: string) => router.push(path)

/** /knowledge/xxx 这类子路径也要让「知识库」高亮 */
const activePath = computed(() => {
  if (route.path.startsWith('/knowledge')) return '/knowledge'
  if (route.path.startsWith('/interview')) return '/interview'
  return route.path
})

const onScroll = () => {
  scrolled.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header" :class="{ 'is-scrolled': scrolled }">
    <div class="header-inner container">
      <router-link to="/" class="brand">
        <span class="brand-avatar">K</span>
        <span class="brand-text">
          <strong>Kairynx</strong>
          <em>keep coding, keep notes</em>
        </span>
      </router-link>

      <el-menu
        class="nav"
        mode="horizontal"
        router
        :default-active="activePath"
        :ellipsis="true"
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/interview">面经</el-menu-item>
        <el-menu-item index="/knowledge">知识库</el-menu-item>
      </el-menu>

      <!-- 小屏改用折叠菜单 -->
      <el-dropdown class="mobile-nav" trigger="click" @command="go">
        <button class="menu-btn" type="button" aria-label="导航菜单">
          <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="/">首页</el-dropdown-item>
            <el-dropdown-item command="/interview">面经</el-dropdown-item>
            <el-dropdown-item command="/knowledge">知识库</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <a
        class="gh-link"
        href="https://github.com/kairynx"
        target="_blank"
        rel="noopener"
        title="GitHub"
      >
        <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
          />
        </svg>
      </a>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  height: 64px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.header.is-scrolled {
  border-bottom-color: var(--line);
  box-shadow: 0 2px 16px rgba(28, 32, 51, 0.05);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.32);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-text strong {
  font-size: 15px;
  letter-spacing: 0.2px;
}

.brand-text em {
  font-style: normal;
  font-size: 11px;
  color: var(--ink-3);
}

.nav {
  flex: 1;
  border-bottom: none !important;
  background: transparent;
  justify-content: flex-end;
}

.nav :deep(.el-menu-item) {
  height: 64px;
  line-height: 64px;
  font-size: 14.5px;
  border-bottom: 2px solid transparent;
  color: var(--ink-2);
}

.nav :deep(.el-menu-item.is-active) {
  color: var(--brand);
  border-bottom-color: var(--brand);
  font-weight: 600;
}

.nav :deep(.el-menu-item:hover) {
  background: rgba(79, 110, 247, 0.06);
}

.gh-link {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: var(--ink-2);
  transition: all 0.18s ease;
}

.gh-link:hover {
  color: var(--brand);
  background: rgba(79, 110, 247, 0.08);
}

/* 小屏折叠菜单，默认隐藏 */
.mobile-nav {
  display: none;
  margin-left: auto;
}

.menu-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--ink-2);
  font-size: 19px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.menu-btn:hover {
  color: var(--brand);
  background: rgba(79, 110, 247, 0.08);
}

@media (max-width: 620px) {
  .brand-text em {
    display: none;
  }
  .nav {
    display: none;
  }
  .mobile-nav {
    display: block;
  }
  .gh-link {
    margin-left: 4px;
  }
}
</style>
