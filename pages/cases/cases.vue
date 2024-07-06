<template>
  <view class="container">
    <!--搜索框  -->
    <uni-search-bar
      id="search"
      @confirm="search"
      v-model="keyword"
      placeholder="请输入搜索内容"
      cancelButton="none"
    />

    <view class="main">
      <!--左边-->
      <view class="aside">
        <view
          :class="category_id === item.id ? 'active' : ''"
          v-for="(item, index) in categoryList"
          :key="item.id"
          @click="categoryClick(item.id)"
        >
          {{ item.name }}
          <view class="line" v-if="category_id === item.id"></view>
        </view>
      </view>

      <!--右边-->
      <view class="content">
        <view class="app">
          <scroll-view
            class="scroll-view"
            style="height: calc(100vh - var(--window-top) - var(--window-bottom) - 56px)"
            :scroll-y="true"
            :refresher-enabled="true"
            @refresherrefresh="onRefresh"
            :refresher-triggered="loading"
            @scrolltolower="onReachBottom"
          >
            <navigator
              :url="'/pages/cases/detail?id=' + item.id"
              class="list-item"
              v-for="(item, index) in caseList"
              :key="item.id"
            >
              <image v-if="item.image !== ''" :src="config.baseURL + item.image" />
              <image v-else src="/static/nopic.jpg" />
              <view class="text">
                <text class="title">{{ item.title }}</text>
                <text class="description">{{ item.description }}</text>
              </view>
            </navigator>
            <empty-view v-if="caseList.length == 0"></empty-view>
            <uni-load-more v-else :status="status"></uni-load-more>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { gets as getCaseList } from '@/services/cases.js'
import { gets as getCategoryList } from '@/services/category.js'
import EmptyView from '@/components/empty-view.vue'
import config from '@/configs/base.js'

const keyword = ref('')
const categoryList = ref([])
const caseList = ref([])
const category_id = ref(0)
const loading = ref(false)
const status = ref('more')
const page = ref(1)
const max = ref(10)
const first = ref(true)

onMounted(() => {
  categoryHandleList()
})
const onRefresh = (e) => {
  console.log('down...')
  loadFirst()
}
const onReachBottom = () => {
  console.log('up...')
  loadMore()
}
const categoryHandleList = async () => {
  categoryList.value = await getCategoryList(3)
  if (Array.isArray(categoryList.value) && categoryList.value.length > 0) {
    category_id.value = categoryList.value[0].id // 默认选中第一个分类
    console.log('category id')
    console.log(category_id.value)
    loadFirst()
  }
}
const caseHandleList = async () => {
  let res = await getCaseList(category_id.value, keyword.value, page.value, 10)
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
const categoryClick = (id) => {
  if (caseList.value.length != id) {
    caseList.value = [] // 清空列表
  }
  category_id.value = id
  console.log(category_id.value)

  loadFirst()
}
const search = (res) => {
  uni.navigateTo({
    url: `/pages/index/search?keyword=${res.value}`
  })
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
/* pages/case.wxss */
.page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scroll-view {
  width: 100%;
}

.container {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

/* 主体部分  */
.main {
  width: 100%;
  height: 100%;
  display: flex;
}

/* 左侧  */
.aside {
  width: 166rpx;
  background-color: #f8f8f8;
  font-size: 26rpx;
}

.aside view {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  position: relative;
  text-indent: 1em;
}

.aside view.active {
  background-color: #fff;
}

.aside view .line {
  width: 5rpx;
  height: 50rpx;
  position: absolute;
  top: 26rpx;
  left: 0;
  background-color: orange;
}

/* 右侧  */
.content {
  width: 584rpx;
  background-color: #fff;
}

.list-item {
  height: 100rpx;
  padding: 20rpx;
  border-bottom: 1rpx solid #ddd;
}

.list-item image {
  width: 180rpx;
  height: 100rpx;
  float: left;
  margin-right: 20rpx;
}

.list-item .text {
  overflow: hidden;
}

.list-item .text .title {
  font-size: 30rpx;
  font-family: '黑体';
  float: left;
  display: block;
  width: 100%;
  /* 单行，超出显示省略号 start*/
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* 单行，超出显示省略号 end*/
}

.list-item .text .description {
  width: 100%;
  font-size: 24rpx;
  margin-top: 18rpx;
  float: left;
  color: gray;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
