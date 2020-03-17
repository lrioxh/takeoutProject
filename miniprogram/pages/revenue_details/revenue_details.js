// miniprogram/pages/revenue_details/revenue_details.js
const db = wx.cloud.database();
const _ = db.command;
const order = db.collection("order");
const app = getApp();
Page({
  data: {
    orderDetails: "",
  },
  onLoad: function(options) {},
  onReady: function() {
    order.where({
      storeID: app.globalData.openid,
    }).get().then(res => {
      // console.log(res.data)
      var allData = res.data;
      var i = 0;
      var j = 0;
      var k = 0;
      let revenue = new Array(allData.length)
      for (i = 0; i < res.data.length; i++) {
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

        // console.log(allData)
        var orderStTime = allData[i].orderTime
        // console.log(orderStTime)
        var order_date = orderStTime.getFullYear() + "-" + (orderStTime.getMonth() + 1) + "-" + orderStTime.getDate();
        var order_time = orderStTime.getHours() + ':' + orderStTime.getMinutes() + ':' + orderStTime.getSeconds()
        var time = [order_date, order_time]
        allData[i].orderTime = time
        // console.log(allData[i].orderTime)
        var sum_price = 0;
        for (j = 0; j < allData[i].dish.length; j++) {
          sum_price += allData[i].dish[j].price * allData[i].dish[j].num;
        }
        revenue[i] = sum_price;

      }

      this.setData({
        orderDetails: allData,
        revenue: revenue,
      })
    })
  },
})