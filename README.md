# 企业展示型小程序

UI组件使用的`Vant Weapp`

如果需要`服务端`或`管理员端`，请移步：https://github.com/chudaozhe/gin-vue-weapp

## 在线体验
```
https://ent.cuiwei.net/console/
用户名：admin
密码：123456
```

## 配置
1、修改接口前缀
```
vi app.js
...
  globalData: {
    host: 'https://ent.cuiwei.net', //http://localhost
  },
...
```

2、关于我们

这是个单页，并且id是写死的，如果后台修改了，小程序需要同步修改
```
vi pages/page/about.js
...
    app.request('/user/0/page/3', {}, function (res) {
...
```

# 截图

![home.jpg](https://ent.cuiwei.net/screenshots/user/home.jpg)
![cases.jpg](https://ent.cuiwei.net/screenshots/user/cases.jpg)
![news.jpg](https://ent.cuiwei.net/screenshots/user/news.jpg)

# 快速开始

1.在项目根目录执行
```
npm install
```

2.不校验域名, 使用npm模块

![WX20210204-170252@2x.jpg](https://ent.cuiwei.net/screenshots/user/WX20210204-170252@2x.jpg)

3.工具->构建npm

![WX20210204-170106@2x.jpg](https://ent.cuiwei.net/screenshots/user/WX20210204-170106@2x.jpg)

# 案例展示
![code1.png](screenshots/code1.png)
