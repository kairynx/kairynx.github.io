<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p class="copy">© {{ year }} Kairynx · 用 Vue 3 + Element Plus 搭建</p>
      <div class="links">
        <a href="https://github.com/kairynx" target="_blank" rel="noopener">GitHub</a>
        <span class="dot">·</span>
        <router-link to="/interview">面经</router-link>
        <span class="dot">·</span>
        <router-link to="/knowledge">知识库</router-link>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--line);
  background: var(--bg-soft);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 24px;
  flex-wrap: wrap;
}

.copy {
  margin: 0;
  font-size: 13px;
  color: var(--ink-3);
}

.links {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--ink-2);
}

.links a:hover {
  color: var(--brand);
}

.dot {
  color: var(--el-color-primary-light-5);
}
</style>
