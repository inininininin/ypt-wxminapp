// pages/evaluation/evaluation.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    navtitle: '全部评价',
    hospitalName: app.globalData.hospitalName,
    allHidden: 'block',
    showNone:true,
    doctorNum:0,
    nurseNum:0,
    hospitalNum:0,
  },
  lookMore(e){
    wx.navigateTo({
      url: '../evalutionList/evalutionList?type='+e.currentTarget.dataset.type,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.lastPage(0, '/user/my-doctor-comments', 'doctorList')
    this.lastPage(0, '/user/my-nurse-comments', 'nurseList')
    this.lastPage(0, '/user/my-hospital-comments', 'hospitalList')
    this.numList(0, '/user/my-doctor-comments-sum', 'doctorList')
    this.numList(0, '/user/my-nurse-comments-sum', 'nurseList')
    this.numList(0, '/user/my-hospital-comments-sum', 'hospitalList')
    if(this.data.doctorNum==0&&this.data.doctorNum==0&&this.data.doctorNum==0){
      this.setData({
        showNone: true,
      });
    }
  },
  numList:function(toPageNo, url, list){
    var that=this
    wx.request({
      url: app.globalData.url + url, // '/user/my-messages',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          if(res.data.data.rowCount!=0){
            that.setData({
              showNone: false,
            });
          }
          if (list == 'doctorList') {
            that.setData({
              doctorNum: res.data.data.rowCount,
            });
          } else if (list == 'nurseList') {
            that.setData({
              nurseNum: res.data.data.rowCount,
            });
          } else {
            that.setData({
              hospitalNum: res.data.data.rowCount,
            });
          }
        } else {
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
  },
  lastPage: function (toPageNo, url, list) {
    var that = this
    toPageNo++
    wx.request({
      url: app.globalData.url + url, // '/user/my-messages',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': app.globalData.cookie
      },
      data: {
        pn: toPageNo,
        ps: 3,
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          if (res.data.data.rows) {
            var addTime
            for (var i = 0; i < res.data.data.rows.length; i++) {
              addTime = res.data.data.rows[i].createTime
              res.data.data.rows[i].addTime = utils.formatTime(addTime / 1000, 'Y-M-D h:m');
            }
          }
          if (list == 'doctorList') {
            that.setData({
              doctorList: res.data.data.rows,
            });
          } else if (list == 'nurseList') {
            that.setData({
              nurseList: res.data.data.rows,
            });
          } else {
            that.setData({
              hospitalList: res.data.data.rows,
            });
          }
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
    this.setData({
      allHidden:'none'
    })
  },
  backHistory(e) {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      allHidden: 'none'
    })
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
      doctorList: [],
      nurseList: [],
      hospitalList: [],
    })
    this.lastPage(0, '/user/my-doctor-comments', 'doctorList')
    this.lastPage(0, '/user/my-nurse-comments', 'nurseList')
    this.lastPage(0, '/user/my-hospital-comments', 'hospitalList')
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

  }
})