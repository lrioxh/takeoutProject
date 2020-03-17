// pages/personal/personal.js
const app = getApp()
const db = wx.cloud.database();
const _ = db.command;
const store = db.collection("store");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    menuitems: [

      { text: '收入分析', url: '../revenue-analysis/revenue-analysis', icon: 'chart-trending-o', tips: '', arrows: '/images/user/arrows.png' },
      { text: '收到评价', url: '../reviews/reviews', icon: 'comment-o', tips: '', arrows: '/images/user/arrows.png' },
      { text: '联系客服', url: '#', icon: '/images/user/user4.png', tips: '', arrows: '/images/user/arrows.png' },
      { text: '反馈', url: '#', icon: '/images/user/user4.png', tips: '', arrows: '/images/user/arrows.png' }
    ],
    active: 2,
    mystore:false,
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    // this.setData({ active: event.detail })
    if(this.data.mystore == false){
      wx.showModal({
        title: '提示',
        content: '您还未申请店铺，是否现在申请？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.navigateTo({
              url: '../addMyStore/addMyStore',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      if (event.detail == 0) {
        wx.switchTab({
          url: '../store-order/store-order',   //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        })
      } else if (event.detail == 1) {
        wx.switchTab({
          url: '../mystore/mystore',
        })
      }
    }  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.mystore){
      that.setData({
        mystore:true,
      })
    }
    try{
      store.doc(app.globalData.openid).get().then(res =>{
        if(res.data){
          that.setData({
            mystore:true,
          })
        }
      })
    } catch (e) {
      console.error(e)
      wx.showModal({
        title: '提示',
        content: '您还未申请店铺，是否现在申请？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.switchTab({
              url: '../addMyStore/addMystore',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res){
              app.globalData.userInfo = res.userInfo
              that.setData({
                userInfo: res.userInfo,
                // hasUserInfo: true
              })
            }
          });
        }else{
          that.setData({
            isHide: true
          });
        }
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

  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log(e.detail.userInfo)
      that.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
    }
  }
})

// { text: '店铺信息', url: '#', icon: 'info-o', tips: '', arrows: '/images/user/arrows.png' },
// { text: '申请店铺', url: '../addMyStore/addMyStore', icon: 'shop-o', tips: '', arrows: '/images/user/arrows.png' },