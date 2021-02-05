// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    keyword:"", //默认关键词
    index:0,  //默认滑动到第几页
    host:app.globalData.host,
    flashList:[],
    shortcutList: [],
    list: [],//推荐案例
    page:1,
  },
  onLoad() {
    let _this=this;
    app.request('/user/0/flash', {}, function (res) {
      if(res.err===0){
        _this.setData({
          flashList: res.data,
        });
      }
    })
    app.request('/user/0/shortcut', {}, function (res) {
      if(res.err===0){
        _this.setData({
          shortcutList: res.data,
        });
      }
    });
    this.getData(1);
  },
  /**
   * 生命周期函数--监听页面显示   在每个tabbar页面onshow 调用即可;
   */
  onShow: function () {
    this.getTabBar().init();
  },
  onItemClick:function(event) {
    let id = event.target.dataset.url;
    if(undefined!==id){
      wx.navigateTo({
        url: `/pages/case/detail?id=${id}`
      })
    }
  },
  onReachBottom:function(){
    console.log('up..');
    this.setData({ loading: true });
    this.setData({ page: this.data.page + 1 });
    this.getData(this.data.page);
  },
  getData: function (page) {
    let _this = this;
    app.request('/user/0/category/0/cases', {page: page, max: 10}, function (res) {
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
