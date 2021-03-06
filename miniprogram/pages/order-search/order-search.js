// pages/order-search/order-search.js
const db = wx.cloud.database();
const order = db.collection("order")
const _ = db.command
const app =getApp();
Page({
  data: {
    reciveInfo:null,// 接收到的搜索信息
    order: null,
    orderEmpty: true, //不显示“抱歉，没有找到相关的订单 换个关键字试试吧”
  },
  onLoad:function(e){
    this.setData({
      reciveInfo: e.info
    })
    this.getOrder();
  },
  searchEvent(e) {
    this.setData({
      reciveInfo: e.detail
    })
    this.getOrder();
  },
  p(s) {
    return s < 10 ? '0' + s : s
  },

  getOrder(){
    console.log(app.globalData.openid)
    order.where({
      _openid: app.globalData.openid
    }).where(_.or([{
      dish: {
        name: db.RegExp({
          regexp: this.data.reciveInfo,
          option: 'i'
        })
      }
    },
    {
      store: db.RegExp({
        regexp: this.data.reciveInfo,
        option: 'i'
      })
    },
    {
      hall: db.RegExp({
        regexp: this.data.reciveInfo,
        option: 'i'
      })
    }
      ])).orderBy('orderTime', 'desc').get().then(res => {
      if (res.data.length == 0) {
        this.setData({
          order: null,
          orderEmpty: false
        })
        wx.hideLoading()
      } else {
        var that = this;
        let key = "value";
        let value = 0;
        let orderTime = 'orderTime';
        let sum = "sum";
        let number = 0;
        console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          // res.data.length
          // 计算菜品总价
          for (let j = 0; j < res.data[i].dish.length; j++) {
            value += res.data[i].dish[j].price
            number += res.data[i].dish[j].num
            res.data[i][key] = value
            res.data[i][sum] = number
          }
          value = 0;
          number = 0;
          // 计算时间，表示成xx-xx-xx形式
          let d = res.data[i].orderTime
          let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
          // let resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
          res.data[i][orderTime] = resDate
          }
        console.log(res.data)
        this.setData({
          orderEmpty: true,
          order: res.data
        }, res => {
          wx.hideLoading();
        })
      }
    })
  },
})
