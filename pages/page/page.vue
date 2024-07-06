<template>
  <view class="container">
    <scroll-view scroll-y="true" scroll-top="50">
      <image
        v-if="field.image"
        style="width: 750rpx; height: 375rpx"
        :src="config.baseURL + field.image"
      ></image>
      <view style="padding: 0 20rpx">
        <rich-text :nodes="field.content" class="content" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { get as getPageDetail } from '/services/page.js'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import config from '@/configs/base.js'

const id = ref(0)
const field = ref({
  image: '',
  content: ''
})

onLoad((query) => {
  id.value = query.id || 0 // 获取案例id，如果没有id，默认为0，即第一个案例。
  console.log(query)
})

onMounted(() => {
  pageHandleDetail(id.value)
})
const pageHandleDetail = async (id) => {
  field.value = await getPageDetail(id)
  uni.setNavigationBarTitle({
    title: field.value.title ?? null
  })
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
