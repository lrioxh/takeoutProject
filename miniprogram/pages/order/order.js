// pages/order/order.js
const db = wx.cloud.database();
const order = db.collection('order')
var app = getApp()
Page({
  data: {
    // tab切换  
    currentTab: 0,
    orders: null,
    dialogShow: false,
    buttons: [{ text: '取消' }, { text: '确定' }]
  },
  

  p(s) {
    return s < 10 ? '0' + s : s
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取所有订单信息
    order.get().then(res =>{
      var that = this;
      let key = "value";
      let value = 0;
      let orderTime ='orderTime';
      for (let i = 0; i < res.data.length; i++) {
        // 计算菜品总价
        res.data[i].price.forEach(ele => { value += ele })
        res.data[i][key] = value
        value=0;
        // 计算时间，表示成xx-xx-xx形式
        let d = res.data[i].orderTime
        let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
        // let resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
        res.data[i][orderTime]=resDate
      }
      that.setData({
        orders:res.data
      })
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    }
    else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
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
  /**
   * 获取云数据库订单信息
   */
  getorderlist:function(){

  },
  gotopeisongdetail:function(){
    wx.redirectTo({
      url: '../order-peisong-detail/order-peisong-detail',
    })
  },
  gotocanceldetail:function(){
    wx.redirectTo({
      url: '../order-cancel-detail/order-cancel-detail',
    })
  },
  openConfirm: function () {
    this.setData({
      dialogShow: true
    })
  },
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },

})