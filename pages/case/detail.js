// pages/case/detail.js
// 获取应用实例
const app = getApp();
let WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: app.globalData.host,
    id:0,
    images: [],
    field:{
      title: "",
      description: "",
      content:"",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id});
    if (this.data.id) {
      let _this = this;
      app.request('/user/0/cases/' + _this.data.id, {}, function (res) {
        if(res.err===0){
          let field = res.data;
          let urls = field.images.split(",");
          let images=[];
          for (let i in urls) {
            images[i] = _this.data.host + urls[i]
          }
          _this.setData({
            images: images,
            field:{
              title: field.title,
              description: field.description,
            }
          });
          WxParse.wxParse('content', 'html', field.content, _this, 10);
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //电话咨询
  handleCall (e) {
    wx.makePhoneCall({
      phoneNumber: app.globalData.mobile,
      fail(res){
        console.log('取消');
      }
    })
  },

  //微信咨询
  handleWx (e) {
    wx.showModal({
      title: "微信号",
      content: app.globalData.wx,
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log("用户点击确定");
        }
      }
    });
  },
})