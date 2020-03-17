// miniprogram/pages/mystore/mystore.js
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
const store = db.collection("store");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var storeID = app.globalData.openid;
    store.doc(storeID).get().then(res =>{
      console.log(res)
      this.setData({
        store:res.data,
      })
    })

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

  onChange(event) {
    // event.detail 的值为当前选中项的索引
    // this.setData({ active: event.detail });
    if (event.detail == 2) {
      wx.switchTab({
        url: '../store-personal/store-personal',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        // success(res) {
        //   this.setData({
        //     active: 0,
        //   })
        // }
      });
    }else if (event.detail == 0){
      wx.switchTab({
        url: '../store-order/store-order',
      })
    }
  },

  saleoff:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您要取消供应吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          console.log(e.currentTarget.dataset)
          wx.cloud.callFunction({
            name: 'saleOrNot',
            data: {
              index: e.currentTarget.dataset.index,
              sale:false,
              storeID: app.globalData.openid,
            },
            success: res => {
              console.log("ok", res);
              // console.log(res);
              wx.showToast({
                title: '已取消供应！',
                icon: 'success',
                duration: 2000
              });
              that.onLoad();
            },
            fail: err => {
              console.log("no")
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  saleon:function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您要开启供应吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.cloud.callFunction({
            name: 'saleOrNot',
            data: {
              index: e.currentTarget.dataset.index,
              storeID: app.globalData.openid,
              sale:true,
            },
            success: res => {
              console.log("ok", res);
              // console.log(res);
              wx.showToast({
                title: '已开启供应！',
                icon: 'success',
                duration: 2000
              });
              that.onLoad();
            },
            fail: err => {
              console.log("no")
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  edit:function(e){
    console.log(e.currentTarget.dataset)
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../addDish/addDish?edit=true&name=' + dataset.dishname + "&index=" + dataset.index + "&category=" + dataset.category + "&calorie=" + dataset.calorie + "&ingredient=" + dataset.ingredient + "&brief=" + dataset.brief + "&price=" + dataset.price
    })
  }
})