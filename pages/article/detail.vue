<template>
  <view class="container">
    <scroll-view>
      <view class="header">
        <view class="title">{{ field.title }}</view>
        <view class="memo">
          <text>发布时间：{{ field.create_time }}</text>
          <text style="margin-left: 20rpx">{{ field.views }}人看过</text>
        </view>
      </view>
      <!--图文详情  -->
      <rich-text :nodes="field.content" class="content" />
    </scroll-view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { get as getArticleDetail } from '/services/article.js'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
const id = ref(0)
const field = ref({
  title: '',
  content: '',
  views: '',
  create_time: ''
})

onLoad((query) => {
  id.value = query.id || 0
  console.log(query)
})

onMounted(() => {
  articleHandleDetail(id.value)
})
const articleHandleDetail = async (id) => {
  field.value = await getArticleDetail(id)
}
</script>

<style scoped>
.container {
  padding: 20rpx;
}
.header {
  width: 100%;
  margin-bottom: 20rpx;
}
.title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20rpx;
}
.memo {
  text-align: right;
  font-size: 12px;
}
.content {
  margin-bottom: 20rpx;
  width: 100%;
}
.content >>> .img {
  margin: 20rpx 0;
}
</style>
