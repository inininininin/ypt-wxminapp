// pages/hosIndex/hosIndex.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    titleBarHeight: app.globalData.titleBarHeight,
    background:'rgba(0,0,0,0)',
    detail:[],
  },
  panoramaVrUrl(e){
    wx.navigateTo({
      url: '../webview/webview?href=' + encodeURIComponent(app.globalData.url+this.data.detail.panoramaVrUrl),
    })
  },
  evahospital(e){
    wx.navigateTo({
      url: '../evaNow/evaNow?type=3&name='+this.data.detail.name,
    })
  },
  hosDetail() {
    var that=this
    wx.request({
      url: app.globalData.url + '/user/hospital',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hospitalId: wx.getStorageSync('loginHospitalId'),
      },
      success: function (res) {
        if (res.data.code == 0) {
          app.globalData.hospitalName = res.data.data.name
          var tag = []
          res.data.data.cover = app.cover(res.data.data.cover)
          if (res.data.data.tag) {
            for (var i in res.data.data.tag.split(',')) {
              tag.push(res.data.data.tag.split(',')[i])
            }
          }
          res.data.data.tag = tag
          that.setData({
            detail: res.data.data,
            testImg: res.data.data.cover,
          })
        } else {
          wx.showToast({
            title: res.data.codeMsg,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.hosDetail();
  },
  onPageScroll: function (e) {
    if (e.scrollTop>0){
      this.setData({
        'background': '#2b77ef'
      })
    }else{
      this.setData({
        'background': 'rgba(0,0,0,0)'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  backHistory(e){
    wx.navigateBack({
      delta:1
    })
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
    wx.stopPullDownRefresh()
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
    wx.request({
      url: app.globalData.url + '/user/share',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
        
        }
      }
    })
  },
})