<template>
  <view class="container">
    <scroll-view scroll-y="true" scroll-top="50">
      <image style="width: 750rpx; height: 375rpx" :src="config.baseURL + field.image"></image>
      <view style="padding: 0 20rpx">
        <rich-text :nodes="field.content" class="content" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { get as getPageDetail } from '/services/page.js'

import config from '@/configs/base.js'

const field = ref({
  image: '',
  content: ''
})

onMounted(() => {
  pageHandleDetail(3)
})
const pageHandleDetail = async (id) => {
  field.value = await getPageDetail(id)
}
</script>

<style scoped>
.content {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  color: gray;
  text-align: justify;
  text-align-last: left;
}
</style>
