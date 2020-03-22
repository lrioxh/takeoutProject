// pages/revenue-analysis/revenue-analysis.js
const db = wx.cloud.database();
const _ = db.command;
const order = db.collection("order");
const curDate =new Date();
const year = curDate.getFullYear()
const month = curDate.getMonth()+1
const date = curDate.getDate()
const app = getApp()

import * as echarts from '../../ec-canvas/echarts/';

function initChart(canvas, width, height) {

  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  let revenue = [0,0,0,0,0,0,0,0,0,0,0,0];
  order.where({
    storeID: app.globalData.openid,
  }).
    get()
    .then(res => {
      var i = 0;
      var j = 0;
      var allData = res.data;
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
      }
      for (i = 0; i < res.data.length; i++) {
        if (allData[i].done == "已完成"){
          var orderStTime = res.data[i].orderTime;
          // var orderPrice = res.data[i].price
          // var orderNum= res.data[i].dishnum
          var dish = res.data[i].dish
          var orderMonth_1 = orderStTime.getMonth();
          for (j = 0; j < dish.length; j++) {
            var dish_item = res.data[i].dish[j]
            revenue[orderMonth_1] += (dish_item.price * dish_item.num) / 1000;
          }
        }       
      }
      for(i=0;i<revenue.length;i++){
        revenue[i] = revenue[i].toFixed(1);
      }
      console.log(revenue);
      var option = {
        title: {
          show: true,
          text: '本年收入情况',
          textStyle:{
            color:'white',
          },
        },
        backgroundColor: "#FF893B",
        color: ["#37A2DA", "#FF9F7F"],
        tooltip: {
        },
        xAxis: {
          type:'category',
          name:'月份',
          nameTextStyle:{
            color:'white',
            fontWeight:'normal',
          },
          data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
          axisLine: {
            show: true
          },
          // splitArea: {
          //   // show: true,
          //   color: '#f00',
          //   lineStyle: {
          //     color: '#f00'
          //   },
          // },
          axisLabel: {
            show: true,
            margin: 20,
            textStyle: {
              color: 'white',
              fontWeight: 'bold',

            },
          },
          // splitLine: {
          //   show: true
          // },
          boundaryGap: true,
        },
        yAxis: {
          type:'value',
          name:'收入/千元',
          nameTextStyle: {
            color: 'white',
            fontWeight: 'normal',
          },
          min: 0,
          // max: 140,
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.5)'
            }
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            show: true,
            margin: 20,
            textStyle: {
              color: 'white',
              fontWeight:'bold',
            },
          },
          axisTick: {
            show: true,
          },
        },
        series: [{
          showAllSymbol: true,
          symbol: 'circle',
          symbolSize: 10,
          lineStyle: {
            normal: {
              color: "#6c50f3",
              shadowColor: 'rgba(0, 0, 0, .3)',
              shadowBlur: 0,
              shadowOffsetY: 5,
              shadowOffsetX: 5,
            },
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#6c50f3',
            }
          },
          itemStyle: {
            color: "#6c50f3",
            borderColor: "#fff",
            borderWidth: 3,
            shadowColor: 'rgba(0, 0, 0, .3)',
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2,
          },
          tooltip: {
            show: false
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(108,80,243,0.3)'
              },
              {
                offset: 1,
                color: 'rgba(108,80,243,0)'
              }
              ], false),
              shadowColor: 'rgba(108,80,243, 0.9)',
              shadowBlur: 20
            }
          },
          name: '本年收入情况',
          type: 'line',
          data: revenue,

        }]
      };
      chart.setOption(option);
      return chart;
    })
}
Page({
  data: {
    store:"真好吃",
    today_revenue:0,
    today_num_bill:0,
    month_revenue:0,
    bill:0,
    ec: {
      onInit: initChart
    }
  },
  onLoad: function (options) {
    order.where({
      storeID: app.globalData.openid,
    }).get().then(res => {
      console.log(res.data[0].orderTime)
      var allData = res.data;
      var todayRevenue = 0;
      var monthRevenue = 0;
      var i=0;
      var numOrder = 0;
      var j=0;
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
      }}
      for(i=0;i<res.data.length;i++){
        if(res.data[i].done == "已完成"){
            var orderStTime = res.data[i].orderTime;
            // var orderPrice = res.data[i].price
            // var orderNum= res.data[i].dishnum
            var dish = res.data[i].dish
            var orderYear = orderStTime.getFullYear();
            var orderMonth = orderStTime.getMonth() + 1;
            var orderDate = orderStTime.getDate();

            if (orderYear == year) {
              if (orderMonth == month) {
                for (j = 0; j < dish.length; j++) {
                  var dish_item = res.data[i].dish[j]
                  monthRevenue += dish_item.price * dish_item.num;
                }
                if (orderDate == date) {
                  for (j = 0; j < dish.length; j++) {
                    var dish_item = res.data[i].dish[j]
                    todayRevenue += dish_item.price * dish_item.num;
                  }
                  numOrder += 1;
                }
              }
            }
          }
      }
          this.setData(
            {
              bill: res.data,
              store: res.data[0].store,
              today_revenue: todayRevenue,
              month_revenue: monthRevenue,
              today_num_bill: numOrder,
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

  }
})