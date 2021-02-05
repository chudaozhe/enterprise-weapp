let app = getApp();

Page({
  data: {
    host: app.globalData.host,
    column_num:2,//两列
    list: [],
    page: 1,
    max: 20,
  },

  onLoad: function (options) {
    let _this = this;
    wx.setNavigationBarTitle({ title: "案例"});
    if (options.keyword) {
      app.request('/user/0/category/0/cases', {keyword: options.keyword, page: _this.data.page, max: _this.data.max}, function (res) {
        if(res.err===0){
          if(res.data.count===1){
            _this.setData({
              column_num: 1
            });
          }
          _this.setData({
            list: res.data.list
          });
        }
      });
    }

  },

})