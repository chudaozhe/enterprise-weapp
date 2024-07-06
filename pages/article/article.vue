<template>
  <view class="container">
    <view class="tabs">
      <view
        :class="{ activedTab: activedTab == index }"
        @click="toggleTab(index)"
        v-for="(item, index) in categoryList"
        :key="index"
      >
        {{ item.name }}
      </view>
    </view>

    <swiper
      :current="activedTab"
      :autoplay="false"
      :duration="300"
      @change="changeContentBox"
      class="content"
    >
      <swiper-item v-for="(item, index) in categoryList" :key="index" class="items">
        <scroll-view
          :scroll-y="true"
          :refresher-enabled="true"
          @refresherrefresh="onRefresh"
          :refresher-triggered="loading"
          @scrolltolower="onReachBottom"
          style="height: calc(100vh - var(--window-top) - var(--window-bottom) - 35px)"
        >
          <view>
            <!-- 		<view style="height: var(--window-top);">--window-top 44px</view>
		<view style="height: var(--window-bottom);">--window-bottom 50px</view> -->
            <navigator
              :url="'/pages/article/detail?id=' + item.id"
              class="list-item"
              v-for="(item, index) in articleList"
              :key="item.id"
            >
              <image v-if="item.image !== ''" :src="config.baseURL + item.image" />
              <image v-else src="/static/nopic.jpg" />
              <view class="text">
                <text class="title">{{ item.title }}</text>
                <view class="description">
                  <text class="date">{{ item.create_time }}</text>
                  <text class="views">{{ item.views }}人看过</text>
                </view>
              </view>
            </navigator>
          </view>

          <empty-view v-if="articleList.length == 0"></empty-view>
          <uni-load-more v-else :status="status"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { gets as getCategoryList } from '@/services/category.js'
import { gets as getArticleList } from '@/services/article.js'

import EmptyView from '@/components/empty-view.vue'

import config from '@/configs/base.js'

const loading = ref(false)
const status = ref('more')
const activedTab = ref(0) // 初始化时，第一个tab被选中。
const categoryList = ref([])
const articleList = ref([])
const category_id = ref(0)
const page = ref(1)
const max = ref(10)
const first = ref(true)

const changeContentBox = (e) => {
  activedTab.value = e.detail.current
  category_id.value = categoryList.value[activedTab.value].id
  //第一屏
  loadFirst()
}
onMounted(() => {
  categoryHandleList()
})
const toggleTab = (index) => {
  activedTab.value = index
  category_id.value = categoryList.value[activedTab.value].id
  loadFirst()
}

const categoryHandleList = async () => {
  categoryList.value = await getCategoryList(2)
  console.log(JSON.stringify(categoryList.value))
  if (Array.isArray(categoryList.value) && categoryList.value.length > 0) {
    category_id.value = categoryList.value[0].id
    console.log('category id')
    console.log(category_id.value)
    loadFirst()
  }
}
const articleHandleList = async () => {
  let res = await getArticleList(category_id.value, page.value, 10)

  //刷新，or加载？
  if (first.value) {
    articleList.value = res.list
    //todo: 完成刷新
  } else {
    if (articleList.value.length >= res.count || res.list.length < max.value) {
      //全部数据加载完毕
      status.value = 'noMore' // 设置状态为没有更多数据。
    } else {
      status.value = 'more' // 设置状态为还有更多数据。
    }
    articleList.value = articleList.value.concat(res.list)
  }
}
const onRefresh = (e) => {
  console.log('down...')
  loadFirst()
}
const onReachBottom = () => {
  console.log('up...')
  status.value = 'loading'
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
  articleHandleList()
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--window-top));
  width: 100%;
  background-color: #fff;
}

.content {
  flex: 1;
}

.content .items {
  width: 100%;
  height: 100%;
}

.tabs {
  height: 80rpx;
  line-height: 80rpx;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  color: #5f5f5f;
}

.scroll-view {
  width: 100%;
}

.activedTab {
  color: #000;
  border-bottom: 2px solid orange;
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
  /* 多行，超过显示省略号 */
  /* display: -webkit-box;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  word-wrap: break-word;
	  white-space: normal !important;
	  -webkit-line-clamp: 2;
	  -webkit-box-orient: vertical; */
}

.description .date {
  float: left;
}

.description .views {
  float: right;
}
</style>
