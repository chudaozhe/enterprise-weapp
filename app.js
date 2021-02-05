// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    host: 'https://test.yuanxi.ltd/enterprise',
    userInfo: null,
    mobile: '00000000000',
    wx: '00000000000',
  },
  request: function (uri, data, callback, method = 'get', xtoken = false) {
    let host = this.globalData.host;
    let token = '';
    let header = {};
    wx.getStorage({
      key: 'userinfo',
      success: function (res) {
        token = res.data.token
      },
      fail: function (res) {

      },
      complete: function (res) {
        if (token !== '' && xtoken) header = { 'Content-Type': 'application/x-www-form-urlencoded', 'token': token }
        else header = { 'Content-Type': 'application/x-www-form-urlencoded' }
        wx.request({
          url: host + uri,
          data: data,
          method: method,
          header: header,
          success: function (res) {
            return typeof callback == "function" && callback(res.data)
          },
          fail: function () {
            return typeof callback == "function" && callback(false)
          }
        })
      }
    })

  },
  isEmpty: function (data) {
    return data === undefined || data.replace(/(^\s+)|(\s+$)/g, "") === '';
  },
  isEmail: function isEmail(str) {
    let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return reg.test(str);
  }
})
