<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="page container">
    <el-result
      icon="info"
      title="404"
      sub-title="这个页面可能已经被删掉了，或者你输错了地址"
    >
      <template #extra>
        <el-button type="primary" @click="router.push('/')">回到首页</el-button>
        <el-button @click="router.push('/knowledge')">去知识库</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.page {
  padding: 80px 24px 100px;
}
</style>
