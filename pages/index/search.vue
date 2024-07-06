<template>
  <view class="container">
    <scroll-view
      style="height: calc(100vh - var(--window-top))"
      :scroll-y="true"
      :refresher-enabled="true"
      @refresherrefresh="onRefresh"
      :refresher-triggered="loading"
      @scrolltolower="onReachBottom"
    >
      <uni-grid :column="2" :showBorder="false" @change="caseChange">
        <uni-grid-item
          v-for="(item, index) in caseList"
          :index="index"
          :key="index"
          style="height: 260rpx; margin-bottom: 10rpx"
        >
          <image
            mode="widthFix"
            class="case-icon"
            :src="item.image ? config.baseURL + item.image : '/static/nopic.jpg'"
            :alt="item.title"
          />
          <text class="case-title">[{{ item.category_name }}]-{{ item.title }}</text>
        </uni-grid-item>
      </uni-grid>
      <empty-view v-if="caseList.length == 0"></empty-view>
      <uni-load-more v-else :status="status" @click="loadMore"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { gets as getCaseList } from '/services/cases.js'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import EmptyView from '@/components/empty-view.vue'
import config from '@/configs/base.js'

const loading = ref(false)
const caseList = ref([])
const current = ref(0)
const keyword = ref('')
const status = ref('more')
const page = ref(1)
const max = ref(10)
const first = ref(true)

onMounted(() => {
  loadFirst()
})
onLoad((query) => {
  keyword.value = query.keyword || ''
  console.log(query)
})
const caseHandleList = async () => {
  let res = await getCaseList(0, keyword.value, page.value, 10)
  //刷新，or加载？
  if (first.value) {
    caseList.value = res.list
    //todo: 完成刷新
  } else {
    if (caseList.value.length >= res.count || res.list.length < max.value) {
      //全部数据加载完毕
      status.value = 'noMore' // 设置状态为没有更多数据。
    } else {
      status.value = 'more' // 设置状态为还有更多数据。
    }
    caseList.value = caseList.value.concat(res.list)
  }
}
const caseChange = (e) => {
  let { index } = e.detail

  console.log(index, caseList.value[index].id)
  uni.navigateTo({
    url: `/pages/cases/detail?id=${caseList.value[index].id}`
  })
}
const onRefresh = (e) => {
  console.log('down...')
  loadFirst()
}
const onReachBottom = () => {
  console.log('up...')
  loadMore()
}
const loadFirst = () => {
  loadData(true)
}

const loadMore = () => {
  loadData(false)
}
const loadData = (is_first) => {
  first.value = is_first
  if (first.value) {
    page.value = 1 // 如果是第一次加载，重置页码为1
  } else {
    ++page.value // 否则页码加1。
  }
  caseHandleList()
}
</script>

<style scoped>
.container {
  padding-top: 16rpx;
}
.shortcut-title,
.case-title {
  color: gray;
  margin-top: 10rpx;
  text-align: center;
  font-size: 26rpx;
}

.decoration {
  width: 4px;
  height: 10px;
  margin-right: 4px;
  background: orange;
}

.case-icon {
  width: 335rpx;
  height: 188rpx;
  margin: 0 auto;
}
</style>
