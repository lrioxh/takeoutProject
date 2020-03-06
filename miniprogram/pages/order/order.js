// pages/order/order.js
const db = wx.cloud.database();
const order = db.collection('order')
var app = getApp()
Page({
  data: {
    loading: false, //上拉加载更多的loading
    refreshLoading: false, //下拉刷新页面的loading
    orders: null,
    // 确认取消订单
    dialogShow: false,
    tempid: null,// 选中点单的id
    buttons: [{ text: '取消' }, { text: '确定' }],
    // tab切换  
    currentTab: 0,
    // 加载全部
    haveLoadAll: true,
  },
  
  onLoad: function (options) {
    // 获取所有订单信息
    this.initorders()
  },
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
  // 滑动切换tab   
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //点击tab切换 
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
// ---------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
  // 下拉刷新部分
  initorders: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      refreshLoading: true,
      haveLoadAll:true
    })
    setTimeout(() => {
      this.setData({
        orders: [],
        refreshLoading: false,
      })
      order.get().then(res => {
        var that = this;
        let key = "value";
        let value = 0;
        let orderTime = 'orderTime';
        for (let i = 0; i < res.data.length; i++) {
          // 计算菜品总价
          res.data[i].price.forEach(ele => { value += ele })
          res.data[i][key] = value
          value = 0;
          // 计算时间，表示成xx-xx-xx形式
          let d = res.data[i].orderTime
          let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
          // let resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
          res.data[i][orderTime] = resDate
        }
        console.log(res.data)
        this.setData({
          orders: res.data
        }, res => {
          wx.hideLoading();
          this.pageData.skip=0
        })
      })
    }, 1000

    )
  },
  loadmore: function () {
    let _this = this;
    if (this.data.haveLoadAll===true){
      wx.vibrateShort()

      wx.showLoading({
        title: '玩命加载中…'
      })
    }
    order.skip(_this.pageData.skip).get().then(res => {
      if (res.data.length===0){
        console.log("alldone")
        this.setData({
          haveLoadAll:false
        })
        // haveLoadAll
        wx.hideLoading();
      }
      else{
      var that = this;
      let key = "value";
      let value = 0;
      let orderTime = 'orderTime';
      for (let i = 0; i < res.data.length; i++) {
        // 计算菜品总价
        res.data[i].price.forEach(ele => { value += ele })
        res.data[i][key] = value
        value = 0;
        // 计算时间，表示成xx-xx-xx形式
        let d = res.data[i].orderTime
        let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
        // let resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
        res.data[i][orderTime] = resDate
      }
      let oldData = _this.data.orders;
      var order = oldData.concat(res.data)
      _this.setData({
        orders: order
      }, res => {
        _this.pageData.skip = _this.pageData.skip + 20
        console.log(_this.pageData.skip)
        wx.hideLoading();
      })
      }
    })
  },
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
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
  // 页面跳转
  gotopeisongdetail:function(){
    wx.redirectTo({
      url: '../order-peisong-detail/order-peisong-detail',
    })
  },

  // 取消订单
  gotocanceldetail:function(){
    wx.redirectTo({
      url: '../order-cancel-cus/order-cancel-cus',
    })
  },
  // 立即支付
  gotosubmitedpay:function(e){
    wx.redirectTo({
      url: '../order-submited-pay/order-submited-pay?id=' + [e.target.id],
    })
  },
  // 弹窗确认取消订单
  // js得去components的dialog改！！
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

  // 查询有多少菜品
  queryOrder: function () {
    order.where()
  },
  // 跳过20个开始加载菜品
  pageData: {
    skip: 0
  },
  // x >>>>>>>>0x
  p(s) {
    return s < 10 ? '0' + s : s
  },
  
  //order页面的函数由component中的dialog执行
  sendToDialog(){
    wx.showLoading({
      title: '加载中',
    })
    const id = this.data.tempid
    setTimeout(function () {
      wx.redirectTo({
        url: '../order-cancel-cus/order-cancel-cus?id=' + [id],
      })
      setTimeout(function(){
        wx.hideLoading()
      },100)
    }, 100)

  }


})
/*<view class="view-store-detail">
            <text>商家 > {{item.store}}</text>
            <text>{{item.paid===false ? '待付款' : item.done===false?'未完成' :item.comment ?'已评价':'待评价'}}</text>
          </view>
          <!-- 下划线 -->
          <view class="viewline"></view>
          <!-- 订单详情 -->
          <view class="view-order-detail">
            <view>
              <image class="image-dish" src="../../imgs/food.jpg"></image>
            </view>
            <view class="view-order-operate">
              <text>下单时间：{{item.orderTime}}</text>
              <text>消费：{{item.value}}￥</text>
              <view class="view-order-btn">
                <button size="mini" bindtap="openConfirm" id="{{item._id}}">取消订单</button>
                <button size="mini">立即支付</button>
              </view>
            </view>
          </view>*/