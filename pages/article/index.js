// pages/article/index.js
// 获取应用实例
const app = getApp();
let util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host:app.globalData.host,
    categorys: [],
    category_id:0,
    list:[],
    loading: false,
    scrollHeight:0,
    page:1,
    active:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    app.request('/user/0/category', {type: 2}, function (res) {
      if(res.err===0){
        let result = res.data;
        _this.setData({
          categorys: result,
          category_id: result[0].id
        });
        
        _this.calculateScrollViewHeight();
        _this.getData(_this.data.page);
      }
    });

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
    this.getTabBar().init();
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
    console.log('up...');
    this.setData({ loading: true });
    this.setData({ page: this.data.page + 1 });
    this.getData(this.data.page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onRefresh: function(e) {
    console.log("down...");
    this.setData({page: 1, list: [] });
    this.getData(1);
  },
  /**
   * 计算scrollview高度
   */
  calculateScrollViewHeight() {
    let _this = this;
    
    let query = wx.createSelectorQuery().in(this);
    query.exec((res) => {
      // tabs:30, tabBar:80
      let scrollViewHeight = wx.getSystemInfoSync().windowHeight - 30 -80;
      _this.setData({
        scrollHeight: scrollViewHeight
      });
    })
  },
  getData: function (page) {
    let _this = this;
    app.request('/user/0/category/'+_this.data.category_id+'/article', {page: page, max: 10}, function (res) {
      if(res.err===0){
        res.data.list.forEach((item, index, arr) => {
          if (item.create_time > 0) {
            arr[index].create_time = util.formatDate(new Date(parseInt(item.create_time + '000')))
          }
        });
        _this.setData({
          list: _this.data.list.concat(res.data.list)
        });
      }
    });

    _this.setData({ loading: false });
  },
  onChange(event) {
    let category=this.data.categorys[event.detail.index];
    this.setData({category_id:category.id, list:[]});
    this.getData(1);
  },
})