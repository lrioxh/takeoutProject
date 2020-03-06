const app = getApp()
const db = wx.cloud.database();
const order = db.collection("order")
Page({
  data: {
    list: [],
    loading: false, //上拉加载更多的loading
    refreshLoading: false //下拉刷新页面的loading
  },
  onLoad: function () {
    this.initList()
  },
  initList: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      refreshLoading: true,
    })
    setTimeout(() => {
      this.setData({
        list: [],
        refreshLoading: false,
      })
      order.get().then(res => {
        console.log(res.data)
        this.setData({
          list: res.data
        },res=>{
          wx.hideLoading();
          this.pageData.skip=0
        })
      })
    }, 1000
    )
  }, 


  loadmore:function(){
    let _this = this;
    wx.showLoading({
      title: '玩命加载中…'
    })
    order.skip(_this.pageData.skip).get().then(res => {
      console.log(res.data)
      let oldData = _this.data.list;
      var listn = oldData.concat(res.data)
      _this.setData({
        list: listn
      }, res => {
        _this.pageData.skip = _this.pageData.skip + 20
        console.log(_this.pageData.skip)
        wx.hideLoading();
      })
    })
  },
    
  pageData:{
    skip:0
  },
  

  
})

/*data: {
    list: [],
    loading: false, //上拉加载更多的loading
    refreshLoading: false //下拉刷新页面的loading
  },
  onLoad: function () {
    this.initList()
  },
  
  initList: function () {
    this.setData({
      refreshLoading: true,
    })
    setTimeout(() => {
      this.setData({
        list: [],
        refreshLoading: false,
      })
      this.loadmore()
    }, 1000)
  },
  loadmore: function () {
    //过长的list需要做二维数组，因为setData一次只能设置1024kb的数据量，如果过大的时候，就会报错
    //二维数组每次只设置其中一维，所以没有这个问题
    let nowList = `list[${this.data.list.length}]`
    let demoList = this.getList(10)
    this.setData({
      [nowList]: demoList
    })
  },
  /**
   * 每次吸入num条数据
   
getList(num) {
  let list = []
  for (let i = 0; i < num; i++) {
    list.push({
      height: this.getRadomHeight()
    })
  }
  return list
},
/**
 * 生成随机(100, 400)高度
 
getRadomHeight() {
  return parseInt(Math.random() * 300 + 100)
},*/