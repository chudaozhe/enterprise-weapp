// pages/case.js
// 获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    host:app.globalData.host,
    keyword:"", //默认关键词
    categorys: [],
    list: [],  //项目列表
    category_id: 0,  // 左侧菜单项的id,默认0
    loading: false,
    scrollHeight:0,
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    // 加载左侧菜单栏 及右侧内容
    app.request('/user/0/category', {type: 3}, function (res) {
      if(res.err===0){
        let category = res.data;
        _this.setData({
          categorys: category,
          category_id: category[0].id
        });
        if (options.id !== undefined){
          _this.setData({ category_id: options.id });
        }
        _this.getData(_this.data.page);
        _this.calculateScrollViewHeight();
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示   在每个tabbar页面onshow 调用即可;
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
  menuClick(e) {
    let _this = this;
    _this.setData({
      category_id: e.target.dataset.id
    });
    app.request('/user/0/category/'+_this.data.category_id+'/cases', {page: 1, max: 10}, function (res) {
      if(res.err===0){
        _this.setData({
          list: res.data.list,
        });
      }
    });
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
    query.select('#search').boundingClientRect();

    query.exec((res) => {
      // 搜索框高度，单位px
      let searchHeight = res[0].height;
      //tabBar:80
      let scrollViewHeight = wx.getSystemInfoSync().windowHeight - searchHeight -80;
      _this.setData({
        scrollHeight: scrollViewHeight
      });
    })
  },
  getData: function (page) {
    let _this = this;
    app.request('/user/0/category/'+_this.data.category_id+'/cases', {page: page, max: 10}, function (res) {
      if(res.err===0){
        _this.setData({
          list: _this.data.list.concat(res.data.list)
        });
      }
    });

    _this.setData({ loading: false });
  },

  onChange(event){
    this.setData({keyword:event.detail});
  },
  onSearch() {
    if(undefined!==this.data.keyword && ""!==this.data.keyword){
      wx.navigateTo({
        url: `/pages/index/search?keyword=${this.data.keyword}`
      });
    }
  },
})