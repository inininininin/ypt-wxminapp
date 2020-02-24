// pages/evalutionList/evalutionList.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    navtitle: '',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type='',url=''
    if(options.type==1){
      type='医师评价列表';
      url='/user/my-doctor-comments';
    }else  if(options.type==2){
      type='医护评价列表';
      url='/user/my-nurse-comments'
    }else{
      type='医院评价列表';
      url='/user/my-hospital-comments'
    }
    this.setData({
      navtitle:type,
      types:options.type,
      url:url
    })
    this.lastPage(0, url)
  },
  backHistory(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  lastPage: function (toPageNo, url) {
    var that = this
    // toPageNo++
    var toPageNo = parseInt(toPageNo) + 1
    wx.request({
      url: app.globalData.url + url, // '/user/my-messages',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      data: {
        pn: toPageNo,
        ps: 15,
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          if (res.data.data.rows) {
            var addTime
            for (var i = 0; i < res.data.data.rows.length; i++) {
              addTime = res.data.data.rows[i].addTime
              res.data.data.rows[i].addTime = utils.formatTime(addTime / 1000, 'Y-M-D h:m');
            }
          }
        var list=that.data.list.concat(res.data.data.rows)
            that.setData({
              list: list,
              toPageNo: String(toPageNo)
            });
         
        } else {
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
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
    this.setData({
      list:[]
    })
    this.lastPage(0, this.data.url)
    wx.stopPullDownRefresh({
      complete: (res) => {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var toPageNo = this.data.toPageNo
    this.lastPage(toPageNo, this.data.url)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})