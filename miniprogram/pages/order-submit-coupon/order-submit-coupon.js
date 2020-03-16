// pages/order-submit-coupon/order-submit-coupon.js
var that;
var app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({
  data: {
    coupon: [],
    storeid:null,// 商家id
    date: new Date().getTime()
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      storeid: options.id
    })
    that.getData();
  },

// 获取列表数据
  getData: function () {
    db.collection('coupon')
      .where({
        user: app.globalData.openid,
      }).where({
        item: this.data.storeid
      })
      .orderBy('dateEnd', 'desc')
      .get({
        success: function (res) {
          that.data.coupon = res.data;
          // console.log('2', that.data.coupon);
          for (var i in that.data.coupon) {
            that.getstoreInfo(i);
          }
          console.log(that.data.coupon)
        },
      })
  },
// 获取coupon商家信息  
  getstoreInfo: function (i) {
    // var storeInfo = {};
    // for (var i = 0; i < that.data.collects.length; i++) {
    var storeId = that.data.coupon[i].item;
    // console.log('2',i)
    db.collection('store')
      .doc(storeId)
      .get({
        success: function (res) {
          // console.log('i',i)
          var dateTemp = that.data.coupon[i].dateEnd;
          that.data.coupon[i].dateNum = dateTemp.getTime();
          that.data.coupon[i].name = res.data.name;
          that.data.coupon[i].img = res.data.img;
          that.data.coupon[i].dateEnd = dateTemp.toLocaleString();
          // console.log('1', that.data.coupon)
          that.setData({
            coupon: that.data.coupon,
          })
        },
        fail: console.log
      })
  },
// 立即使用
  onItemClick: function (e) {
    var id = e.currentTarget.dataset.couponid;
    console.log(e);
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      couponid: id
    })
    wx.navigateBack()
  },
  

})