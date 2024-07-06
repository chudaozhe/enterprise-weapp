<template>
  <view class="container">
    <uni-swiper-dot :info="flashList" :current="current">
      <swiper class="swiper" @change="change">
        <swiper-item v-for="(item, index) in flashList" :key="index">
          <image
            mode="widthFix"
            :src="config.baseURL + item.image"
            :alt="item.title"
            style="width: 100%; height: 100%"
          />
        </swiper-item>
      </swiper>
    </uni-swiper-dot>

    <uni-search-bar
      @confirm="search"
      v-model="keyword"
      placeholder="请输入搜索内容"
      cancelButton="none"
    />

    <uni-grid :column="4" :showBorder="false" @change="shortcutChange">
      <uni-grid-item v-for="(item, index) in shortcutList" :index="index" :key="index">
        <view class="grid-item">
          <image
            mode="widthFix"
            :src="config.baseURL + item.image"
            :alt="item.title"
            style="width: 80rpx; height: 80rpx"
          />
          <text class="shortcut-title">{{ item.title }}</text>
        </view>
      </uni-grid-item>
    </uni-grid>

    <uni-section title="案例展示" padding>
      <template v-slot:decoration>
        <view class="decoration"></view>
      </template>
      <scroll-view :scroll-y="true" @scrolltolower="onReachBottom">
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
    </uni-section>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUserInfoStore } from '@/stores/store.js'

import { gets as getFlashList } from '/services/flash.js'
import { gets as getShortcutList } from '/services/shortcut.js'
import { gets as getCaseList } from '/services/cases.js'
import { onShareAppMessage } from '@dcloudio/uni-app'
import EmptyView from '@/components/empty-view.vue'
import config from '@/configs/base.js'

const flashList = ref([])
const shortcutList = ref([])
const caseList = ref([])
const current = ref(0)
const keyword = ref('')
const status = ref('more')
const page = ref(1)
const max = ref(10)
const first = ref(true)

onShareAppMessage((res) => {
  let current = new Date().toLocaleDateString()
  let date = current.replace(/\//g, '-')
  return {
    title: '标题X',
    imageUrl: '/static/nopic.jpg?' + date,
    path: '/pages/index/search?keyword=test'
  }
})

onMounted(() => {
  storeTest()
  flashHandleList()
  shortcutHandleList()
  loadFirst()
})
const storeTest = () => {
  console.log('store test')
  let data = {}
  data.id = 0
  data.nickname = 'nick..'
  data.avatar = 'avatar.'
  data.token_type = 'xxx'
  data.token = 'token..'
  useUserInfoStore().setUserInfo(data)
}
const flashHandleList = async () => {
  flashList.value = await getFlashList()
}
const shortcutHandleList = async () => {
  shortcutList.value = await getShortcutList()
}
const caseHandleList = async () => {
  let res = await getCaseList(0, '', page.value, max.value)
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

const change = (e) => {
  current.value = e.detail.current
}

const shortcutChange = (e) => {
  let { index } = e.detail

  console.log(index, shortcutList.value[index].url)
  // 跳转到案例详情页，并传递案例id参数
  uni.navigateTo({
    url: `/pages/page/page?id=${shortcutList.value[index].url}`
  })
}
const caseChange = (e) => {
  let { index } = e.detail

  console.log(index, caseList.value[index].id)
  // 跳转到案例详情页，A并传递案例id参数
  uni.navigateTo({
    url: `/pages/cases/detail?id=${caseList.value[index].id}`
  })
  // uni.showToast({
  // 	title: `点击第${index+1}个宫格`,
  // 	icon: 'none'
  // })
}
const onReachBottom = () => {
  console.log('up...')
  loadMore()
}

const search = (res) => {
  uni.navigateTo({
    url: `/pages/index/search?keyword=${res.value}`
  })
  // uni.showToast({
  // 	title: '搜索：' + res.value,
  // 	icon: 'none'
  // })
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

<style>
.container {
  padding: 0;
  font-size: 14px;
  line-height: 24px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

/* .swiper {
		height: 350rpx;
	} */
.swiper {
  background-color: orange;
  width: 100%;
  height: 200px;
}

.swiper-item {
  text-align: center;
  line-height: 200px;
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
}
</style>
