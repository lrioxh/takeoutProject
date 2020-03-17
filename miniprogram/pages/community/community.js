// pages/community/community.js//discovery.js
// var util = require('../../utils/util.js')
var that
const app = getApp()
const db = wx.cloud.database();

Page({
  data: {
    tabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [{
        "pagePath": "../index/index",
        "text": "首页",
        "iconPath": "../../imgs/tabBar/home-default.png",
        "selectedIconPath": "../../imgs/tabBar/home-active.png",
        "selectedColor": "#FF893B",
        "active": false
      },
      {
        "pagePath": "../community/community",
        "text": "社区",
        "iconPath": "../../imgs/tabBar/com_def.png",
        "selectedIconPath": "../../imgs/tabBar/com_act.png",
        "selectedColor": "#FF893B",
        "active": true
      },
      {
        "pagePath": "../order/order",
        "text": "订单",
        "iconPath": "../../imgs/tabBar/buy-list-default.png",
        "selectedIconPath": "../../imgs/tabBar/buy-list-active.png",
        "selectedColor": "#FF893B",
        "active": false
      },
      {
        "pagePath": "../mine/mine",
        "text": "我的",
        "iconPath": "../../imgs/tabBar/my-default.png",
        "selectedIconPath": "../../imgs/tabBar/my-active.png",
        "selectedColor": "#FF893B",
        "active": false
      }
      ],
      "position": "bottom"
    },
    userInfo: app.globalData.userInfo,
    topics: {},
    show: false

  },
  onLoad: function() {
    that = this
    that.data.user = app.globalData.userInfo;
  },
  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      show: false
    })
    that.getData();
  },

  authorizeClick: function(event) {
    let _this = this;
    // console.log(event);
    //1.授权之后将数据存放在app.js中
    let userInfo = event.detail.userInfo;
    if (userInfo) {
      app.globalData.userInfo = userInfo;
      //2.刷新界面
      _this.setData({
        userInfo: userInfo,
      })
      // console.log(app.globalData.userInfo, this.data.userInfo)
      //3.实现登陆功能
      app.globalData.isLogin = true;
    }

  },
  /**
   * 获取列表数据
   * 
   */
  getData: function() {

    db.collection('topicPo')
      .orderBy('realDate', 'desc')
      .limit(10)
      .get({
        success: function(res) {
          // res.data 是包含以上定义的两条记录的数组
          // console.log("数据：" + res.data)
          // console.log(res)
          that.data.topics = res.data;
          that.setData({
            topics: that.data.topics,
          })
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();

        },
        fail: function(event) {
          wx.hideNavigationBarLoading(); //隐藏加载
          wx.stopPullDownRefresh();
        }
      })

  },
  /**
   * item 点击
   */
  onItemClick: function(event) {
    var id = event.currentTarget.dataset.topicid;
    var openid = event.currentTarget.dataset.openid;
    console.log(id);
    console.log(openid);
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id + "&openid=" + openid
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var temp = [];
    // 获取后面十条

    const db = wx.cloud.database();
    db.collection('topicPo')
      .orderBy('realDate', 'desc')
      .skip(that.data.topics.length)
      .limit(10)
      .get({
        success: function(res) {
          // res.data 是包含以上定义的两条记录的数组
          if (res.data.length > 0) {
            for (var i = 0; i < res.data.length; i++) {
              var tempTopic = res.data[i];
              console.log(tempTopic);
              temp.push(tempTopic);
            }

            var totalTopic = {};
            totalTopic = that.data.topics.concat(temp);

            console.log(totalTopic);
            that.setData({
              topics: totalTopic,
            })
          } else {
            wx.showToast({
              title: '没有更多数据了',
            })
          }
        },
      })


  },
  //菜单
  select: function(e) {
    this.setData({
      show: !this.data.show
    })
  },
  onPageScroll: function() {
    this.setData({
      show: false
    })
  },
  tocollect: function() {
    wx.navigateTo({
      url: '../collectPo/collect',
    })
  },
  tohistory: function() {
    wx.navigateTo({
      url: '../historyPo/history',
    })
  },
  //发帖
  add: function() {
    wx.navigateTo({
      url: '../publish/publish'
    })
  }
})