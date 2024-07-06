<template>
  <view class="container">
    <!-- 轮播  -->
    <view class="swiper">
      <uni-swiper-dot :info="caseImages" :current="current">
        <swiper class="swiper-box">
          <swiper-item v-for="(image, index) in caseImages" :key="index">
            <image mode="widthFix" :src="image" alt="" style="width: 100%; height: 100%" />
          </swiper-item>
        </swiper>
      </uni-swiper-dot>
    </view>
    <view class="header">
      <view class="title">{{ field.title }}</view>
      <view class="desc">
        {{ field.description }}
      </view>
    </view>
    <view class="case-title">案例详情</view>
    <view class="case-detail">
      <rich-text :nodes="field.content" class="content" />
    </view>
    <!-- 咨询  -->
    <view class="contact">
      <view class="phone" @click="handleCall">
        <image src="/static/phone-contact.png" />
        <text>电话咨询</text>
      </view>
      <view class="wx" @click="handleWx">
        <image src="/static/wechat-contact.png" />
        <text>微信咨询</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { get as getCaseDetail } from '/services/cases.js'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import config from '@/configs/base.js'

const id = ref(0)
const caseImages = ref([])
const current = ref(0)
const field = ref({
  title: '',
  description: '',
  content: ''
})

onLoad((query) => {
  id.value = query.id || 0
  console.log(query)
})

onMounted(() => {
  caseHandleDetail(id.value)
})
const caseHandleDetail = async (id) => {
  field.value = await getCaseDetail(id)
  field.value.content = field.value.content.replace(/<img/gi, '<img class="img"') // 处理图片宽度。
  let urls = field.value.images.split(',')
  caseImages.value = urls.map((url) => config.baseURL + url)
  console.log(caseImages.value) // 打印案例图片数组，用于页面展示。
}
const handleCall = () => {
  uni.makePhoneCall({
    phoneNumber: config.mobile,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    },
    fail: function (res) {
      console.log(res.errMsg)
    }
  })
}
const handleWx = () => {
  uni.showModal({
    // 调用uni.showToast方法，实现微信咨询功能。
    title: '微信咨询', // 提示文字。
    content: config.wx,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;
  font-family: '黑体';
}

/* 轮播  */
.swiper,
.swiper swiper {
  width: 750rpx;
  height: 375rpx;
}

.swiper image {
  width: 100%;
  height: 100%;
}

/* header  */
.header {
  width: 750rpx;
  background-color: #fff;
}

.header .title {
  margin-top: 20rpx;
  padding: 0 20rpx;
  font-size: 34rpx;
}

.header .desc {
  margin-top: 10rpx;
  padding: 10rpx 20rpx;
  font-size: 26rpx;
  color: #999;
}

/* detail  */
.case-title {
  width: 710rpx;
  line-height: 74rpx;
  margin-top: 10rpx;
  padding: 0 20rpx;
  background-color: #fff;
}

.case-detail {
  width: 750rpx;
  background-color: #fff;
}

.content {
  padding: 0 20rpx;
}

.content >>> .img {
  width: 100%;
  height: 100%;
}

/* contact  */
.contact {
  width: 100%;
  display: flex;
  position: fixed;
  bottom: 40rpx;
  left: 0;
  z-index: 100;
}

.contact .phone {
  width: 375rpx;
  color: orange;
  background-color: #fff;
}

.contact .wx {
  flex: 1;
  background-color: orange;
  color: #fff;
}

.contact view {
  display: flex;
  justify-content: center;
  height: 98rpx;
  line-height: 98rpx;
}

.contact image {
  width: 66rpx;
  height: 66rpx;
  margin-right: 6rpx;
  margin-top: 16rpx;
}
</style>
