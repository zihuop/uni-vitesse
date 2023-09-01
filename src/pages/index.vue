<script setup lang="ts">
import { getTestData } from '~/api/index'

const name = $ref('')
const ins = getCurrentInstance()!
const ctx = ins.appContext.config.globalProperties

function handleToast() {
  const toast1 = ctx.$toast.loading({
    duration: 0,
    mask: true,
    message: '加载中...',
  })
  setTimeout(() => {
    toast1.close()
  }, 5000)
}

function handleDialog() {
  ctx.$dialog
    .confirm({
      title: '提示',
      message: '代码是写出来给人看的，附带能在机器上运行',
    })
    .then(() => {
      ctx.$toast.default('click confirm')
    })
    .catch(() => {
      ctx.$toast.default('click cancel')
    })
}

async function testRequest() {
  const toast1 = ctx.$toast.loading({
    duration: 0,
    mask: true,
    message: '加载中...',
  })
  getTestData().then((res) => {
    toast1.close()
    console.log('🚀 ~ file: index.vue:36 ~ getTestData ~ res:', res)
  }).catch((err) => {
    console.log('🚀 ~ file: index.vue:42 ~ getTestData ~ err:', err)
    toast1.close()
  })
}
</script>

<template>
  <div>
    <TheLogo />

    <div py-4 />

    <TheInput
      v-model:value="name"
      placeholder="What's your name?"
    />

    <div>
      <button
        m-3 text-sm btn
        :disabled="!name"
        @click="router.push(`/pages/hi?name=${name}`)"
      >
        Go
      </button>
      <van-button type="primary" size="small" @click="handleToast">
        toast
      </van-button>
      <van-button type="primary" size="small" @click="handleDialog">
        dialog
      </van-button>
      <van-button type="primary" size="small" @click="testRequest">
        请求
      </van-button>
    </div>
  </div>
</template>

<route lang="yaml">
layout: home
</route>
