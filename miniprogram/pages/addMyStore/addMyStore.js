const app = getApp()

Page({

  data: {
    storeName:null,
    storBrief:null,
    managerName:null,
    managerID:null,
    phoneNumber:null,
    address:null,
    time:null,
    fileList: null,
    inner_fileList:null,
    places: ['馨园', '泰圆', '荟园', '雀圆']
  },

  // 保存基本信息
  inputstoreName: function (e) {
    this.setData({
      storeName: e.detail.value
    })
  },
  inputstorBrief: function (e) {
    this.setData({
      storBrief: e.detail.value
    })
  },
  inputmanagerName: function (e) {
    this.setData({
      managerName: e.detail.value
    })
  },
  inputmanagerID: function (e) {
    this.setData({
      managerID: e.detail.value
    })
  },
  inputphoneNumber: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  inputaddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  inputtime: function (e) {
    this.setData({
      time: e.detail.value
    })
  },


  //上传店铺头像
  afterRead(event) {
    const { file } = event.detail;

    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.cloud.uploadFile({
      cloudPath: `${Math.floor(Math.random() * 1000000)}.png`,
      filePath: file.path,
      // name: 'file',
      // formData: { user: 'test' },
    }).then(res => {
      const { fileList = [] } = res.fileID;
      console.log(res.fileID)
      fileList.push({ ...file, url: res.fileID });
      this.setData({ fileList });
    })
  },

  //上传店内照片
  inner_afterRead(event) {
    const { file } = event.detail;

    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.cloud.uploadFile({
      cloudPath: `${Math.floor(Math.random() * 1000000)}.png`,
      filePath: file.path,
      // name: 'file',
      // formData: { user: 'test' },
    }).then(res => {
      const { inner_fileList = [] } = res.fileID;
      console.log(res.fileID)
      inner_fileList.push({ ...file, url: res.fileID });
      this.setData({ inner_fileList });
    })
  },

  // 选择地址
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
  },
  onCancel() {
    this.setData({ show: false });
  },
  onConfirm(event) {
    this.setData({
      show: false,
      address: event.detail.value
    });
  },

  
  submit: function (e) {
    console.log(e);
    wx.cloud.callFunction({
      name: "addStore",
      data: {
        data:{
          name: e.detail.value.storeName,
          story: e.detail.value.storeBrief,
          managerName: e.detail.value.managerName,
          managerID: e.detail.value.managerID,
          tel: e.detail.value.phoneNumber,
          place: e.currentTarget.dataset.place,
          time: e.detail.value.time,
          img: e.currentTarget.dataset.img,
          location: e.detail.value.location,
          inner: e.currentTarget.dataset.inner,
        },
        storeID: app.globalData.openid,
      },
      success(res) {
        console.log(res);
        console.log("创建店铺成功")
        wx.showToast({
          title: '创建店铺成功！',
          icon: 'success',
          duration: 2000
        });
        wx.switchTab({
          url: '../store-personal/store-personal',
          success: function (e) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      }
    });
  },
})