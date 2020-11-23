// pages/hosList/hosList.js
var app = getApp()
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    titleBarHeight: getApp().globalData.titleBarHeight,
    navtitle: '选择登录医院',
    showIs:false,
    kw:'',
    schemeList:[],
    showNone:false
  },
  selectThis(e){
    // app.globalData.loginHospitalId=e.currentTarget.dataset.id
    // app.globalData.loginHpitalName=e.currentTarget.dataset.name
    wx.setStorageSync('loginHospitalId', e.currentTarget.dataset.id)
    wx.setStorageSync('loginHpitalName', e.currentTarget.dataset.name)
    
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      change:1
    });
    wx.navigateBack({
      delta: 1
    })
  },
  backHistory(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.lastPage(0)
    
    wx.request({
      url: app.globalData.url + '/ypt/hospitals-sum',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        // pn: toPageNo,
        // ps: 55,
        // kw:that.data.kw,
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          
        } else {
          wx.showModal({
            showCancel: false,
            title: res.data.codeMsg
          })
        }
      }
    });
  },
  search(e){
    this.setData({
      schemeList:[],
      kw:e.detail.value,
    })
    this.lastPage(0)
  },
  lastPage: function (toPageNo) {
    var that = this
    toPageNo++
    wx.request({
      url: app.globalData.url + '/ypt/hospitals',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        'cookie': wx.getStorageSync('cookie')
      },
      data: {
        pn: toPageNo,
        ps: 30,
        kw:that.data.kw,
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        if (res.data.code == 0) {
          var addTime
          if(toPageNo==1&&res.data.data.rows.length==0){
            that.setData({
              showNone: true,
            });
          }else{
            that.setData({
              showNone: false,
            });
          }
          for (var i = 0; i < res.data.data.rows.length; i++) {
            addTime = res.data.data.rows[i].addTime
            res.data.data.rows[i].addTime = utils.formatTime(addTime / 1000, 'Y-M-D h:m');
          }
          var schemeListArr = that.data.schemeList;
          var newSchemeListArr = schemeListArr.concat(res.data.data.rows)
          if (res.data.data.rows.length == 0) {
            that.setData({
              schemeList: newSchemeListArr,
            });
          } else {
            that.setData({
              schemeList: newSchemeListArr,
              toPageNo: String(toPageNo)
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
      schemeList: [],
    })
    this.lastPage(0)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var toPageNo = this.data.toPageNo;
    this.lastPage(toPageNo)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.request({
      url: app.globalData.url + '/ypt/user/share',
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
  }
})