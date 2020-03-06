const app = getApp()

Page({
  data: {
    arr: [],
    triggered: false,
  },
  onReady: function () {
    const arr = []
    for (let i = 0; i < 100; i++) arr.push(i)
    this.setData({
      arr
    })

    setTimeout(() => {
      this.setData({
        triggered: true,
      })
    }, 1000)
  },

  onPulling(e) {
    console.log('onPulling:', e)
  },

  onRefresh() {
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },
})