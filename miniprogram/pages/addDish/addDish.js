const app = getApp()
//获取数据库引用
const db = wx.cloud.database();
const store = db.collection('store');

Page({
  data: {
    capsuleInfo: app.globalData.capsuleInfo,
    saving: false,
    result: [],
    show: false,
    categories: ['套餐','米饭', '面条', '水饺/包子', '凉菜', '热菜', '点心', '饮品', '水果','快餐','其他'],
    category:null,
    fileList: null,
    dishName: null,
    dishPrice: null,
    dishCalorie: null,
    dishIngredient: null,
    dishBrief:null,
    wetherdiscounts:null,
    dishDiscountPrice:null,
    edit:false,
  },

  onLoad: function (options) {
   var that = this;
   if(options.edit){
     that.setData({
       dishName: options.name,
       dishCalorie:options.calorie,
       dishIngredient:options.ingredient,
       dishPrice:options.price,
       dishBrief:options.brief,
       edit: options.edit,
       index: options.index,
     })
   }


  },
  
  // 选择菜品分类
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onChange(event) {
    console.log(event.detail)

  },
  onCancel() {
    this.setData({ show: false });
  },
  onConfirm(event) {
    this.setData({ 
      show: false,
      category: event.detail.value
      });
  },

  // 选择供应时间
  offerTime(event) {
    this.setData({
      result: event.detail
    });
  },

  //上传菜品照片
  afterRead(event) {
    const { file } = event.detail;
    
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.cloud.uploadFile({
      cloudPath: `${Math.floor(Math.random()*1000000)}.png`,
      filePath: file.path,
      // name: 'file',
      // formData: { user: 'test' },
      }).then(res => {
      const { fileList = [] } = res.fileID;
      console.log(res.fileID)
      fileList.push({ ...file, url:res.fileID  });
      this.setData({ fileList });
    })
  },

  // 保存菜品的基本信息
  inputdishName: function (e) {
    this.setData({
      dishName: e.detail.value
    })
  },
  inputdishPrice: function (e) {
    this.setData({
      dishPrice: e.detail.value
    })
  },
  inputdishCalorie: function (e) {
    this.setData({
      dishCalorie: e.detail.value
    })
  },
  inputdishIngredient: function (e) {
    this.setData({
      dishIngredient: e.detail.value
    })
  },
  inputdishBrief: function (e) {
    this.setData({
      dishBrief: e.detail.value
    })
  },


  // 是否优惠
  whetherDiscount(event) {
    console.log(event.detail)
    this.setData({
      wetherdiscounts: event.detail
    });
  },
  inputdishDiscountPrice: function (e) {
    this.setData({
      dishDiscountPrice: e.detail.value
    })
  },

  
  submit: function (e) {
    console.log(e.detail.value)
    var value = e.detail.value;
    var offerTime = [] ;
    var that = this;
    if(value.breakfast){
      offerTime.push("早餐")
    }
    if(value.lunch){
      offerTime.push("午餐")
    }
    if(value.diner){
      offerTime.push("晚餐")
    }
    // wx.cloud.init({
    //   env: "test-wyzd6"//默认环境配置，传入字符串形式的环境 ID 可以指定所有服务的默认环境，传入对象可以分别指定各个服务的默认环境
    // })
    wx.cloud.callFunction({
      name:"addMyDish",
      data:{
        data:{
          name: e.detail.value.dishName,
          time: offerTime,
          category: that.data.category,
          src: that.data.fileList[0].url,
          price: e.detail.value.inputdishPrice,
          calorie: e.detail.value.dishCalorie,
          ingredient: e.detail.value.inputdishIngredient,
          isdiscounted: e.detail.value.discount,
          discountPrice: e.detail.value.inputdishDiscountPrice,
          brief: e.detail.value.inputdishBrief,
          onsale:true,
        },     
        storeID: app.globalData.openid,
        edit: that.data.edit,
        index: that.data.index,        
      },
      success(res){
        console.log(res);
        console.log("添加菜品成功")
        wx.showToast({
          title: '添加菜品成功！',
          icon: 'success',
          duration: 2000
        });
        wx.switchTab({
          url: '../mystore/mystore',
          //跳转后刷新
          success: function (e) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      }
    }) 
  }
})