// pages/ordersubmited/ordersubmited.js
const db = wx.cloud.database();
const order = db.collection('order')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order:null,
    id:null,
    // 确认取消订单
    dialogShow: false,
    tempid: null,// 选中点单的id
    buttons: [{ text: '取消' }, { text: '确定' }],
  },
  // 生命周期函数--监听页面加载
  p(s) {
    return s < 10 ? '0' + s : s
  },
  //防止出现24：xx
  h(s){
    return s == 24 ? s-'24' :s
  },

  pageData:{
    id:null
  },
  onLoad: function(options) {
    this.pageData.id = options.id
    order.doc(options.id)
      .get()
      .then(res => {
        let orderTime = 'orderTime';
        let d = res.data.orderTime
        // let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
        var hours = this.p(d.getHours() + 1)
        let resTime = this.h(hours) + ':' + this.p(d.getMinutes())
        res.data[orderTime] = resTime
        this.setData({
          order: res.data
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
//--------------------------------------------------------------------------------------------------------
// 弹窗dialog确认是否取消订单
  openConfirm: function (e) {
    this.setData({
      tempid: e.target.id,
      dialogShow: true
    })
  },
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },
  //order-submited-pay页面的函数由component中的dialog执行
  sendToDialog() {
    wx.showLoading({
      title: '加载中',
    })
    const id = this.data.tempid
    setTimeout(function () {
      wx.redirectTo({
        url: '../order-cancel-cus/order-cancel-cus?id=' + [id],
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 100)
    }, 100)

  },
})