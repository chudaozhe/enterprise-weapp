// index.js文件
Component({
  data: {
    active: 0,
    list: [
      {
        "url": "/pages/index/index",
        "icon": "wap-home-o",
        "text": "首页"
      },
      {
        "url": "/pages/case/index",
        "icon": "apps-o",
        "text": "成功案例"
      },
      {
        "url": "/pages/article/index",
        "icon": "newspaper-o",
        "text": "资讯中心"
      },
      {
        "url": "/pages/page/about",
        "icon": "friends-o",
        "text": "关于我们"
      }
    ]
  },
  methods: {
    onChange(e) {
      this.setData({ active: e.detail });
      wx.switchTab({
        url: this.data.list[e.detail].url
      });
    },
    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  }
});