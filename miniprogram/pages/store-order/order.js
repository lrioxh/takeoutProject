// pages/order/order.js
var app = getApp()
const db = wx.cloud.database();
const _ = db.command;
const order = db.collection("order");

Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    orderDetails:[],
    active:0,
  },

  onChange(event) {
    // event.detail 的值为当前选中项的索引
    // this.setData({ active: event.detail });
    if(event.detail == 2){
      wx.switchTab({
        url: '../store-personal/store-personal',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        // success(res) {
        //   this.setData({
        //     active: 0,
        //   })
        // }
      });
    }else if(event.detail == 1){
      wx.switchTab({
        url: '../mystore/mystore',   
      })
    }


  },
  onLoad: function () {
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    
    order.where({
      storeID: app.globalData.openid,
    }).get().then(res =>{
      var allData = res.data;
      var that = this;
      console.log(allData);
      var num_total=[];
      var price_total=[];
      var i = 0;
      var j = 0;
      var k = 0;
      var status = '';
      for (i = 0; i < res.data.length; i++) {
        var sum_prcie = 0;
        var sum_num = 0;
        if (allData[i].done) {
          if (allData[i].paid) {
            allData[i].done = '已完成'
            // console.log(allData[i].done)
          } else {
            allData[i].done = '已退款'
            // console.log(allData[i].done)
          }
        } else {
          if (allData[i].paid) {
            allData[i].done = '待完成'
            // console.log(allData[i].done)
          } else {
            allData[i].done = '待付款'
            // console.log(allData[i].done)
          }
        }

        var orderStTime = allData[i].orderTime
        // console.log(orderStTime)
        var order_time = orderStTime.getFullYear() + "-" + (orderStTime.getMonth() + 1) + "-" + orderStTime.getDate() + ' ' + orderStTime.getHours() + ':' + orderStTime.getMinutes() + ':' + orderStTime.getSeconds();
        var time = order_time;
        allData[i].orderTime = time
        if(allData[i].dish){
          for(j=0;j<allData[i].dish.length;j++){
            sum_num += allData[i].dish[j].num;
            sum_prcie += allData[i].dish[j].price;
          }        
        }
        num_total[i] = sum_num;
        price_total[i] = sum_prcie;
      };

      that.setData({
        orderDetails:allData,
        num_total:num_total,
        price_total:price_total,
      })
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  take:function(e){
    var that = this;
    wx.cloud.callFunction({
      name: 'orderTake_store',
      data: {
        id: e.currentTarget.dataset.id,
      },
      success: res => {
        console.log("ok", res);
        // console.log(res);
        wx.showToast({
          title: '已接单！',
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
  },

  cancel: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您真的要取消订单吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.cloud.callFunction({
            name: 'cancel_order',
            data: {
              id: e.currentTarget.dataset.id,
            },
            success: res => {
              console.log("ok", res);
              // console.log(res);
              wx.showToast({
                title: '已取消订单！',
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
    var that = this;
    that.onLoad();
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
})  