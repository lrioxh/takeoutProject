// pages/order-peisong-detail/order-peisong-detail.js
const db = wx.cloud.database();
const rider = db.collection("rider")
const order = db.collection("order")
Page({
  data: {
    longitude: null,
    latitude: null,
    accuracy:null,
    markers: [{
      id: 0,
      latitude: null,
      longitude: null,
      width: 30,
      height: 30, 
      title:'aaa'
      // callout: {
      //   content: " 无锡 \n 12000元/㎡",
      //   padding: 10,
      //   display: 'ALWAYS',
      //   textAlign: 'center',
      //   // borderRadius: 10,
      //   // borderColor:'#ff0000',
      //   // borderWidth: 2,
      // }
    },
    {
      id: 1,
      latitude: null,
      longitude: null,
      width: 30,
      height: 30,
      callout: {
        content: " 无锡区政府 \n 12000元/㎡",
        padding: 10,
        display: 'ALWAYS',
        textAlign: 'center',
      }
    }
    ],
    time: '14:10',
    orders:null,
  },
  // 把数字 x 格式化为 0x
  p(s) {
    return s < 10 ? '0' + s : s
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    // 获取订单信息
    order.get().then(res=>{
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
      console.log(res.data[0])
      that.setData({
        orders: res.data[0]
      })
    })

    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        rider.get().then(res => {
          var rider_latitude = res.data[0].location.latitude;
          var rider_longitude = res.data[0].location.longitude;
          that.setData({
            latitude: latitude,
            longitude: longitude,
            markers: [{
              latitude: latitude,
              longitude: longitude
            },
            {
              latitude: rider_latitude,
              longitude: rider_longitude
            }
            ]
          })
        })
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

  // 测试使用
  logfsdf: function(){
    console.log(this.data.markers)
  }
})