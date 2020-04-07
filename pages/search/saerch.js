// pages/search/saerch.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    keyword: '',
    searchVal:2,
    navbar: ['综合', '医生', '护士','评价'],
    currentTab: 0,
    docList: [],
    numlist1:[],
    numlist1Show:true,
    numlist2:[],
    numlist2Show:true,
    numlist3:[],
    numlist3Show:true
  },
  backHistory(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      productIs: e.currentTarget.dataset.idx,
      qx:1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      keyword:options.kw
    })
    if(options.kw){
      this.docList(0,15,options.kw)
    }else{
      this.docList(0,15,'')
    }
    
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
    wx.stopPullDownRefresh({
      complete: (res) => {},
    })
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

  // 请求数据方法
  // 医生列表
  docList(pn,ps,kw) {
    var that = this
    pn++
    wx.request({
      url: app.globalData.url + '/user/doctors',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      method: 'get',
      data: {
        hosptialId:wx.getStorageSync('loginHospitalId'),
        pn: pn,
        ps: ps,
        kw:kw,
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.rows) {
            for (var i in res.data.data.rows) {
              res.data.data.rows[i].cover = app.cover(res.data.data.rows[i].cover)
            }
          }
          that.setData({
            docList: res.data.data.rows,
            pn:pn
          })
        } 
      }
    })
  },
})